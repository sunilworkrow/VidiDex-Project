// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import  db from '@/app/lib/db';

import { RowDataPacket } from "mysql2";



// Function to generate unique key
function generateUniqueKey(length: number = 50): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";

  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return key + Date.now().toString(); // Add timestamp at end
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser]: [RowDataPacket[], unknown] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

     // Generate unique key
    const uniqueKey = generateUniqueKey();

    // Insert user
    await db.query(
      'INSERT INTO users (name, email, password, role, unique_key) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, "admin", uniqueKey]
    );

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      uniqueKey,
    });
  } 
  
  
  catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
