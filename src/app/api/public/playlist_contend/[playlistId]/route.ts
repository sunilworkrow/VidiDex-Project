import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: Request,
  { params }: { params: { playlistId: string } }
) {
  try {
    const { playlistId } = await params;

    if (!playlistId) {
      return NextResponse.json(
        { success: false, message: "Playlist ID is required" },
        { status: 400 }
      );
    }

    const [rows]: [RowDataPacket[], unknown] = await db.query(
      `
      SELECT 
        pc.id,
        pc.content_id,
        c.name AS content_name,
        c.url AS content_url,
        pc.playlist_id,
        p.name AS playlist_name,
        pc.user_id,
        pc.create_at,
        pc.updated_at
      FROM playlist_contents pc
      JOIN contents c ON pc.content_id = c.id
      JOIN playlist p ON pc.playlist_id = p.id
      WHERE pc.playlist_id = ?
      `,
      [playlistId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "No contents found for this playlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      playlistId,
      contents: rows,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
