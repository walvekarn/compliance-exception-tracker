import { NextRequest, NextResponse } from "next/server";
import { getExceptionById, updateException } from "@/data/exceptions";
import { validateExceptionUpdate } from "@/lib/validations/exception";
import { canTransition } from "@/lib/validations/status";
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exception = getExceptionById(id);
    if (!exception) {
      return NextResponse.json({ error: "Exception not found" }, { status: 404 });
    }
    const withOpenDays = {
      ...exception,
      openDays: computeOpenDays(exception),
      vendorName: getVendorById(exception.vendorId)?.name,
      assignedToName: getUserById(exception.assignedToId)?.name,
      managerName: getUserById(exception.managerId)?.name,
    };
    return NextResponse.json({ data: withOpenDays });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch exception" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = getExceptionById(id);
    if (!existing) {
      return NextResponse.json({ error: "Exception not found" }, { status: 404 });
    }

    const body = await request.json();
    const validation = validateExceptionUpdate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    const update = validation.data!;
    if (update.status !== undefined && update.status !== existing.status) {
      if (!canTransition(existing.status, update.status)) {
        return NextResponse.json(
          {
            error: "Invalid status transition",
            errors: {
              status: `Cannot transition from "${existing.status}" to "${update.status}"`,
            },
          },
          { status: 400 }
        );
      }
    }

    const updated = updateException(id, update);
    if (!updated) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
    const { userId, userName } = getActingUser(request);
    appendAuditEntry(id, userId, existing, updated);
    if (update.status !== undefined && update.status !== existing.status) {
      appendActionEntry(
        id,
        userId,
        userName,
        "status_change",
        `Status changed from "${existing.status}" to "${update.status}".`
      );
    }
    if (update.assignedToId !== undefined && update.assignedToId !== existing.assignedToId) {
      const reason = (request.headers.get("X-Reassignment-Reason") as string) || "Reassigned.";
      appendActionEntry(id, userId, userName, "reassigned", reason);
    }
    const withOpenDays = {
      ...updated,
      openDays: computeOpenDays(updated),
    };
    return NextResponse.json({ data: withOpenDays });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update exception" },
      { status: 500 }
    );
  }
}
