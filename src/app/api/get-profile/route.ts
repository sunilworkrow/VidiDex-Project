import { NextResponse } from 'next/server'
import db from '@/app/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token missing' }, { status: 401 })
    }

    const token = await authHeader.split(' ')[1]
    const decoded: any =  jwt.verify(token, process.env.JWT_SECRET!)

    const userEmail = decoded.email
    const userunique_key = decoded.unique_key


   const [rows]: any = await db.query(
  'SELECT name, lastName, dob, description, image, unique_key FROM users WHERE email = ? AND unique_key = ?', 
  [userEmail, userunique_key]
)


    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: rows[0] })

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
