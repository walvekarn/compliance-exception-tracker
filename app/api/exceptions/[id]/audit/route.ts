import { NextRequest, NextResponse } from "next/server";
import { getExceptionById } from "@/data/exceptions";
import { getAuditEntriesByExceptionId } from "@/data/auditLog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exception = getExceptionById(id);
    if (!exception) {
      return NextResponse.json({ error: "Exception not found" }, { status: 404 });
    }
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;
    const entries = getAuditEntriesByExceptionId(id, { limit, offset });
    return NextResponse.json({ data: entries });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch audit log" },
      { status: 500 }
    );
  }
}
