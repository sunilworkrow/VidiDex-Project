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

    const { url, name } = await req.json();


    if (!url) {
      return NextResponse.json({ success: false, message: "Url input is required" }, { status: 400 });
    }

    const user_id = decoded.id;

    const [existing]: [RowDataPacket[], unknown] = await db.query(
      'SELECT * FROM contents WHERE url = ? AND user_id = ?',
      [url, user_id]
    );


    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Url already exists" }, { status: 400 });
    }

    await (await db).query(
      'INSERT INTO contents (url, user_id, name) VALUES (?, ?, ?)',
      [url, user_id, name]
    );

    return NextResponse.json({ success: true, message: "Url Add successfully" });

  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}



// GET API: 

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, {
        status: 401
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;


    const user_id = decoded.id;

    console.log("user_iduser_id", user_id);


  const [rows]: [RowDataPacket[], unknown] = await db.query(
  'SELECT * FROM contents WHERE user_id = ?',
  [user_id]
);



    return NextResponse.json({
      success: true,
      data: rows
    });

  } 
  
  catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, {
      status: 500
    });
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

    await db.query("DELETE FROM contents WHERE id = ? AND user_id = ?", [id, user_id]);

    return NextResponse.json({
      success: true,
      message: "Url deleted successfully",
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}






