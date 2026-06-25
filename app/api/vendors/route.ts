import { NextResponse } from "next/server";
import { getAllVendors } from "@/data/vendors";

export async function GET() {
  try {
    const vendors = getAllVendors();
    return NextResponse.json({ data: vendors });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}
