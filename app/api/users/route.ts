import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, getUsersByRole } from "@/data/users";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const users =
      role === "analyst" || role === "manager"
        ? getUsersByRole(role)
        : getAllUsers();
    return NextResponse.json({ data: users });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
