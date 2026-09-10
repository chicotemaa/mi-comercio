import { NextResponse } from "next/server";
import { getOperationAlerts } from "@/lib/operation-alerts-server";
export async function GET() {
  try {
    const { counts, attentionCount, updatedAt } = await getOperationAlerts();
    return NextResponse.json(
      { counts, attentionCount, updatedAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "No se pudieron actualizar los avisos." },
      { status: 503 },
    );
  }
}
