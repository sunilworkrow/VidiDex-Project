import db from '@/app/lib/db'

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT NOW() AS time');
    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}