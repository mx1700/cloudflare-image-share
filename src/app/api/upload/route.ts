import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getStorageProvider, StorageProvider } from '@/app/provider/StorageProvider';
import R2StorageProvider from '@/app/provider/R2StorageProvider';
import { NextResponse } from 'next/server';
import TelegraphStorageProvider from '@/app/provider/TelegraphStorageProvider';
import { checkAuth } from '@/app/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const isAuth = await checkAuth(cookies().get('token')?.value);
  if(!isAuth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get("file") as File;

  const provider = getStorageProvider();
  const key = await provider.save(file, file.name)
  const query = key.query?.toString()
  const fileUrl = query ? `${key.path}?${query}` : key.path;

  return NextResponse.json({ key: fileUrl });
}
