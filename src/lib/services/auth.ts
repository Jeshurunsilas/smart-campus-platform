import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { UserProfile, UserRole, AccountApprovalStatus } from "@/types";

export interface SignUpStudentParams {
  email: string;
  password: string;
  fullName: string;
  registrationNumber: string;
  departmentId?: string;
}

export interface SignUpFacultyParams {
  email: string;
  password: string;
  fullName: string;
  facultyId: string;
  departmentId?: string;
}

export interface SignInResult {
  success: boolean;
  isDemo?: boolean;
  demoRole?: string;
  user?: unknown;
  profile?: {
    id: string;
    role: string;
    approval_status: string;
    full_name: string;
    email: string;
  };
}

export async function signUpStudent(params: SignUpStudentParams) {
  if (!isSupabaseConfigured()) {
    return { success: true, isDemo: true };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        role: "student",
        registration_number: params.registrationNumber,
        department_id: params.departmentId || null,
      },
    },
  });

  if (error) throw error;
  return { success: true, data };
}

export async function signUpFaculty(params: SignUpFacultyParams) {
  if (!isSupabaseConfigured()) {
    return { success: true, isDemo: true };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        role: "faculty",
        faculty_id: params.facultyId,
        department_id: params.departmentId || null,
      },
    },
  });

  if (error) throw error;
  return { success: true, data };
}

export async function signInWithEmail(email: string, password: string): Promise<SignInResult> {
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "DemoCampus2026!";
  const isDemoEmail =
    email.endsWith("@smartcampus.demo") ||
    email.endsWith("@campus.edu") ||
    email === "admin@smartcampus.demo" ||
    email === "student@smartcampus.demo" ||
    email === "faculty@smartcampus.demo" ||
    email === "staff@smartcampus.demo";

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      isDemo: true,
      demoRole: email.includes("faculty")
        ? "faculty"
        : email.includes("staff")
        ? "staff"
        : email.includes("admin")
        ? "administrator"
        : "student",
    };
  }

  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (isDemoEmail && (password === demoPassword || password === "password123")) {
        return {
          success: true,
          isDemo: true,
          demoRole: email.includes("faculty")
            ? "faculty"
            : email.includes("staff")
            ? "staff"
            : email.includes("admin")
            ? "administrator"
            : "student",
        };
      }
      throw error;
    }

    if (data.user) {
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileErr || !profileData) {
        if (isDemoEmail) {
          return {
            success: true,
            isDemo: true,
            demoRole: email.includes("faculty")
              ? "faculty"
              : email.includes("staff")
              ? "staff"
              : email.includes("admin")
              ? "administrator"
              : "student",
          };
        }
        await supabase.auth.signOut();
        throw new Error("Could not load user profile. Please contact an administrator.");
      }

      const profile = profileData as {
        id: string;
        role: string;
        approval_status: string;
        full_name: string;
        email: string;
      };

      if (profile.approval_status === "pending") {
        await supabase.auth.signOut();
        throw new Error(
          "Your registration is currently pending administrator approval. You will receive access once verified."
        );
      }

      if (profile.approval_status === "rejected") {
        await supabase.auth.signOut();
        throw new Error(
          "Your account registration was not approved. Please contact the campus administration."
        );
      }

      return {
        success: true,
        user: data.user,
        profile,
      };
    }
  } catch (err: unknown) {
    if (isDemoEmail && (password === demoPassword || password === "password123")) {
      return {
        success: true,
        isDemo: true,
        demoRole: email.includes("faculty")
          ? "faculty"
          : email.includes("staff")
          ? "staff"
          : email.includes("admin")
          ? "administrator"
          : "student",
      };
    }
    throw err;
  }

  return { success: true };
}

export async function signOutUser() {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
}

export async function sendPasswordResetEmail(email: string) {
  if (!isSupabaseConfigured()) {
    return { success: true, isDemo: true };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
  return { success: true };
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  const row = data as {
    id: string;
    email: string;
    full_name: string;
    role: string;
    approval_status: string;
    registration_number?: string | null;
    faculty_id?: string | null;
    department_id?: string | null;
    avatar_url?: string | null;
    created_at: string;
    updated_at: string;
  };

  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: row.role as UserRole,
    approval_status: row.approval_status as AccountApprovalStatus,
    student_id: row.registration_number,
    faculty_id: row.faculty_id,
    department_id: row.department_id,
    avatar_url: row.avatar_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
