import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { RowDataPacket } from "mysql2";
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userid: number;
    id: number;
    email: string;

}

export async function POST(req: Request) {

    try {

        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const { content_id, playlist_id } = await req.json();


        if (!content_id || !playlist_id) {
            return NextResponse.json({ success: false, message: "Url input is required" }, { status: 400 });
        }

        const user_id = decoded.id;


        await (await db).query(
            'INSERT INTO playlist_contents (content_id, playlist_id, user_id) VALUES (?, ?, ?)',
            [content_id, playlist_id, user_id]
        );

        return NextResponse.json({ success: true, message: "Content Playlist Add successfully" });


    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
    }

}


export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const user_id = decoded.id;

        // join tables: playlist_contents, contents, playlist
        const [rows] = await (
            await db
        ).query<RowDataPacket[]>(
            `SELECT pc.id,
              pc.content_id,
              c.url AS content_url,
              c.name AS content_name,
              pc.playlist_id,
              p.name AS playlist_name
       FROM playlist_contents pc
       JOIN contents c ON pc.content_id = c.id
       JOIN playlist p ON pc.playlist_id = p.id
       WHERE pc.user_id = ?`,
            [user_id]
        );

        return NextResponse.json({ success: true, data: rows });
    } catch (error: unknown) {
        return NextResponse.json(
            { success: false, message: (error as Error).message },
            { status: 500 }
        );
    }
}