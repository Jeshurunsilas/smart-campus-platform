import { NextResponse } from "next/server";
import {
  checkIsDemoSeeded,
  getDemoRecordCounts,
  seedDemoDatabase,
  cleanDemoDatabase,
  DEMO_USER_CONFIG,
  DEMO_DEPARTMENTS_CONFIG,
  DEMO_LOCATIONS_CONFIG,
} from "@/lib/services/seed-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isSeeded = await checkIsDemoSeeded();
    const counts = await getDemoRecordCounts();

    return NextResponse.json({
      isSeeded,
      counts,
      demoUsers: DEMO_USER_CONFIG.map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        identifier:
          (u as { registration_number?: string }).registration_number ||
          (u as { faculty_id?: string }).faculty_id ||
          (u as { staff_id?: string }).staff_id ||
          "ROOT-ADMIN",
      })),
      departments: DEMO_DEPARTMENTS_CONFIG,
      locations: DEMO_LOCATIONS_CONFIG,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to query demo seed state";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST() {
  // Production guard: seeding demo data is prevented in strict production unless explicitly allowed
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PROD_DEMO_SEED !== "true" &&
    process.env.ALLOW_PROD_DEMO !== "true"
  ) {
    return NextResponse.json(
      {
        error: "Forbidden: Seeding demo datasets is disabled in production environments.",
      },
      { status: 403 }
    );
  }

  try {
    const result = await seedDemoDatabase();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to seed demo database";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PROD_DEMO_RESET !== "true"
  ) {
    return NextResponse.json(
      {
        error: "Forbidden: Destructive demo data reset is disabled in production environments.",
      },
      { status: 403 }
    );
  }

  try {
    const result = await cleanDemoDatabase();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to clean demo database";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
