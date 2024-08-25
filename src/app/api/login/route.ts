import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
import { login } from '@/app/lib/auth';
import { cookies } from 'next/headers';

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const formData = await request.json<{ password: string }>()
  const password = formData.password;
  const token = await login(password)
  if (!token) {
    return NextResponse.json({ pass: false, message: "Invalid password" })
  }

  const cookieStore = cookies();
  cookieStore.set('token', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ pass: true });
}
