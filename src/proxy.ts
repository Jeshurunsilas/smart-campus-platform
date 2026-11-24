import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment variables are not yet configured, allow demonstration navigation
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") || c.name.includes("auth-token") || c.name.includes("supabase"));

  let user = null;
  if (hasAuthCookie) {
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch (error) {
      console.warn("Supabase auth check failed in proxy middleware:", error);
      user = null;
    }
  }

  const pathname = request.nextUrl.pathname;

  const isStudentRoute = pathname.startsWith("/student");
  const isFacultyRoute = pathname.startsWith("/faculty");
  const isAdminRoute = pathname.startsWith("/admin");
  const isStaffRoute = pathname.startsWith("/staff") || pathname.startsWith("/department");
  const isProtectedRoute = isStudentRoute || isFacultyRoute || isAdminRoute || isStaffRoute;

  // Unauthenticated user attempting to access protected route
  if (isProtectedRoute && !user) {
    // In demo environment, allow direct access so reviewers can test all routes
    if (process.env.ALLOW_PROD_DEMO === "true" || process.env.NODE_ENV !== "production") {
      return response;
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Role & Approval verification for authenticated users
  if (isProtectedRoute && user) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, approval_status")
        .eq("id", user.id)
        .single();

      if (profile) {
        // Gate 1: Check Approval Status
        if (profile.approval_status !== "approved") {
          const url = request.nextUrl.clone();
          url.pathname = "/login";
          url.searchParams.set("error", "account_pending_approval");
          return NextResponse.redirect(url);
        }

        // Gate 2: Strict Role Access Isolation
        const userRole = profile.role;
        if (isAdminRoute && userRole !== "administrator") {
          const fallback = userRole === "faculty" ? "/faculty/dashboard" : userRole === "department_staff" ? "/department/dashboard" : "/student/dashboard";
          return NextResponse.redirect(new URL(fallback, request.url));
        }
        if (isStudentRoute && userRole !== "student" && userRole !== "administrator") {
          const fallback = userRole === "faculty" ? "/faculty/dashboard" : "/department/dashboard";
          return NextResponse.redirect(new URL(fallback, request.url));
        }
        if (isFacultyRoute && userRole !== "faculty" && userRole !== "administrator") {
          const fallback = userRole === "student" ? "/student/dashboard" : "/department/dashboard";
          return NextResponse.redirect(new URL(fallback, request.url));
        }
        if (isStaffRoute && userRole !== "department_staff" && userRole !== "administrator") {
          const fallback = userRole === "student" ? "/student/dashboard" : "/faculty/dashboard";
          return NextResponse.redirect(new URL(fallback, request.url));
        }
      }
    } catch {
      // Allow demo navigation if profile query fails
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export const middleware = proxy;
export default proxy;
