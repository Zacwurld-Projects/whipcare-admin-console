import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  //   secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 10 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth', // custom sign-in page
    // newUser: '/auth/create',
  },
  providers: [],
};
