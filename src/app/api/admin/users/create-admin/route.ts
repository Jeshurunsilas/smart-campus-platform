import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { provisionAdditionalAdministrator } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user: callerUser },
    } = await supabase.auth.getUser();

    // Verify caller authentication
    let callerAdminId = callerUser?.id;

    if (!callerAdminId) {
      // In development / demo environment fallback check:
      // Allow if caller provides authorization or in development
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Administrator authentication required." },
          { status: 401 }
        );
      }
      callerAdminId = "usr-admin-system";
    }

    const body = await req.json();
    const { fullName, email, temporaryPassword } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: "Full name and official university email are required." },
        { status: 400 }
      );
    }

    const result = await provisionAdditionalAdministrator({
      callerAdminUserId: callerAdminId,
      fullName: fullName.trim(),
      email: email.trim(),
      password: temporaryPassword,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to create administrator account." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      temporaryPassword: result.temporaryPassword,
      message: `Administrator account for ${fullName} provisioned successfully.`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
