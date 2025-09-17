// app/api/get-profile/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

// const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_dummy_key";


interface JwtPayload {
  email: string;
}



export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token missing' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const userEmail = decoded.email

    const [rows]: [RowDataPacket[], unknown] = await db.query('SELECT name, lastName, dob, description, image FROM signup WHERE email = ?', [userEmail])

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: rows[0] })

  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 })
  }
}
