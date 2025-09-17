// app/api/public/[key]/route.ts
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params;

    // Look up user by unique key
    const [rows]: [RowDataPacket[], unknown] = await db.query(
      "SELECT id FROM users WHERE unique_key = ?",
      [key]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired key" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: rows[0].id,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
