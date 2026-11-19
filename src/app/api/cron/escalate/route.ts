import { NextResponse } from "next/server";
import { checkAndEscalateOverdueRequests } from "@/lib/services/sla";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await checkAndEscalateOverdueRequests();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      checkedCount: result.checkedCount,
      escalatedCount: result.escalatedCount,
      escalatedTicketIds: result.escalatedIds,
      message: `Evaluated ${result.checkedCount} active tickets; escalated ${result.escalatedCount} overdue service orders.`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error during escalation check.";
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
