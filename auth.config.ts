import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  //   secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    // maxAge: 2 * 60,
  },
  pages: {
    signIn: '/auth', // custom sign-in page
    // newUser: '/auth/create',
  },
  providers: [],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.type === 'credentials' && user) {
        token.userId = user.id; // associate userId with token
      }
      return token;
    },
    async session({ session, token }) {
      // safeguard session.user mutation
      session.user = session.user || {};
      session.user.id = token.userId as string;
      return session;
    },
  },
};
