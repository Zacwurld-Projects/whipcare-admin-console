import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  const isAuthenticated = !!session?.user;
  if (isAuthenticated) {
    console.log(session.user, session.expiresAt);
    redirect('/dashboard');
  } else {
    console.log('logged out');
    redirect('/auth');
  }

  return null;
}
