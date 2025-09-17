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

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, message: "Name input is required" }, { status: 400 });
    }

    const user_id = decoded.id;

    const [existing]: [RowDataPacket[], unknown] = await db.query(
      'SELECT * FROM playlist WHERE name = ? AND user_id = ?',
      [name, user_id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Name already exists" }, { status: 400 });
    }

    await (await db).query(
      'INSERT INTO playlist (name, user_id) VALUES (?, ?)',
      [name, user_id]
    );

    return NextResponse.json({ success: true, message: "Name Add successfully" });

  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}



// GET API: 
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user_id = decoded.id;

    console.log("user_iduser_id", user_id);

    const [rows]: [RowDataPacket[], unknown] = await db.query(
      'SELECT * FROM playlist WHERE user_id = ?',
      [user_id]
    );

    return NextResponse.json({ success: true, data: rows });

  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}



// DELETE API:
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user_id = decoded.id;

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    await db.query("DELETE FROM playlist WHERE id = ? AND user_id = ?", [id, user_id]);

    return NextResponse.json({
      success: true,
      message: "Name deleted successfully",
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}




