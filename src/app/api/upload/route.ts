import type { NextRequest } from 'next/server'
import { getStorageProvider } from '@/app/provider/StorageProvider';
import { NextResponse } from 'next/server';
import { checkAuth } from '@/app/lib/auth';
import { cookies } from 'next/headers';

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const isAuth = await checkAuth(cookies().get('token')?.value);
  if(!isAuth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get("file") as File;

  const provider = getStorageProvider();
  try {
    const key = await provider.save(file, file.name)
    const query = key.query?.toString()
    const fileUrl = query ? `${key.path}?${query}` : key.path;

    return NextResponse.json({ key: fileUrl });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
