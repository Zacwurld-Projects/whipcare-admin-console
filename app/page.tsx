'use client';

import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = getCookie('auth-token');

    if (!isAuth) router.push('/auth');
    else router.push('/dashboard');
  });

  return (
    <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20'>
      Whipcare Admin Console In Development
    </div>
  );
}
