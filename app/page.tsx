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
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      Whipcare Admin Console In Development
    </div>
  );
}
