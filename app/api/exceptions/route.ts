import { NextRequest, NextResponse } from "next/server";
import { getAllExceptions, createException } from "@/data/exceptions";
import { validateExceptionCreate } from "@/lib/validations/exception";
import { computeOpenDays } from "@/lib/utils/exception";
import { getVendorById } from "@/data/vendors";
import { getUserById } from "@/data/users";
import { appendAuditEntry } from "@/data/auditLog";
import { appendActionEntry } from "@/data/actionLog";

function getActingUser(request: NextRequest): { userId: string; userName: string } {
  const userId = request.headers.get("X-User-Id") ?? "u1";
  const userName = request.headers.get("X-User-Name") ?? getUserById(userId)?.name ?? "System";
  return { userId, userName };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const assignedToId = searchParams.get("assignedToId") ?? undefined;
    const severity = searchParams.get("severity") ?? undefined;

    let list = getAllExceptions({ vendorId, status, assignedToId });
    if (severity) list = list.filter((e) => e.severity === severity);
    const withOpenDays = list.map((e) => ({
      ...e,
      openDays: computeOpenDays(e),
      vendorName: getVendorById(e.vendorId)?.name,
      assignedToName: getUserById(e.assignedToId)?.name,
      managerName: getUserById(e.managerId)?.name,
    }));
    return NextResponse.json({ data: withOpenDays });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch exceptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateExceptionCreate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }
    const created = createException(validation.data!);
    const { userId, userName } = getActingUser(request);
    appendAuditEntry(created.id, userId, null, created);
    appendActionEntry(created.id, userId, userName, "created", "Exception created.");
    const withOpenDays = {
      ...created,
      openDays: computeOpenDays(created),
    };
    return NextResponse.json({ data: withOpenDays }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create exception" },
      { status: 500 }
    );
  }
}
