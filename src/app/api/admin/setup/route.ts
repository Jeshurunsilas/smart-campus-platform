import { NextRequest, NextResponse } from "next/server";
import { hasAnyAdministrator, provisionInitialAdministrator } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminExists = await hasAnyAdministrator();
    return NextResponse.json({
      setupAvailable: !adminExists,
      message: adminExists
        ? "Initial administrator setup is disabled. An administrator account already exists."
        : "Initial administrator setup is available.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error checking administrator status.";
    return NextResponse.json({ setupAvailable: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminExists = await hasAnyAdministrator();
    if (adminExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: An administrator account already exists. Initial setup is permanently disabled.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Full name, email address, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters in length." },
        { status: 400 }
      );
    }

    const result = await provisionInitialAdministrator({ fullName, email, password });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to provision administrator." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: "Administrator account provisioned successfully. You may now log in to the administrator portal.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
