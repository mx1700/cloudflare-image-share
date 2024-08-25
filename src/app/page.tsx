import React from 'react';
import { cookies } from 'next/headers';
import { checkAuth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { ImgUpload } from '@/app/components/img-upload';
import { Navbar } from '@/app/components/navbar';
export const runtime = 'edge'

export default async function Home() {
  const token = cookies().get('token')?.value
  const isAuth = await checkAuth(token)
  if(!isAuth) {
    redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <div></div>
      <div className="relative w-full">
        <ImgUpload />
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

