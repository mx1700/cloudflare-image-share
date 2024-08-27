import React from 'react';
import { cookies } from 'next/headers';
import { checkAuth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { ImgUpload } from '@/app/components/img-upload';
import { Navbar } from '@/app/components/navbar';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge'

export default async function Home() {
  const token = cookies().get('token')?.value
  const isAuth = await checkAuth(token)
  if(!isAuth) {
    redirect('/login')
  }

  const env =  getRequestContext().env;
  const maxImageSize = env.MAX_IMAGE_SIZE != undefined ? Number(env.MAX_IMAGE_SIZE) : 10;
  const enableImageCompression = env.ENABLE_IMAGE_COMPRESSION == undefined || env.ENABLE_IMAGE_COMPRESSION.toString() == 'true';   //默认打开压缩
  const compressedImageMaxSize = env.COMPRESSED_IMAGE_MAX_SIZE != undefined ? Number(env.COMPRESSED_IMAGE_MAX_SIZE) : 5;
  const maxImageWidthOrHeight = env.MAX_IMAGE_WIDTH_OR_HEIGHT != undefined ? Number(env.MAX_IMAGE_WIDTH_OR_HEIGHT) : 2560;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <div></div>
      <div className="relative w-full">
        <ImgUpload
            maxImageSize={maxImageSize}
            enableImageCompression={enableImageCompression}
            compressedImageMaxSize={compressedImageMaxSize}
            maxImageWidthOrHeight={maxImageWidthOrHeight}
        />
        <div className="
        absolute opacity-50 -z-20 top-1/2 left-1/2 ml-[-40px] mt-[30px] h-[240px]  translate-x-1/3 bg-gradient-conic from-emerald-100 via-green-200 blur-2xl content-['']
        sm:w-[240px]
        "></div>
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
      </div>
    </main>
  );
}

