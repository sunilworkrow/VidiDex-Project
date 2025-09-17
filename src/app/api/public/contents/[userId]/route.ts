// app/api/public/contents/[userId]/route.ts
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch contents for this user
    const [rows]: [RowDataPacket[], unknown] = await db.query(
      "SELECT * FROM contents WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "No contents found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      contents: rows,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
