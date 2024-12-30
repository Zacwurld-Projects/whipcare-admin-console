import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { userService } from './app/api/apiClient';

declare module 'next-auth' {
  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
    token?: string;
  }

  interface Session {
    user: User;
  }

  interface Token {
    userId: string;
    accessToken: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.type === 'credentials' && user) {
        token.userId = user.id; // associate userId with token
        token.accessToken = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // safeguard session.user mutation
      session.user = session.user || {};
      session.user.id = token.userId as string;
      session.user.token = token.accessToken as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await userService.authenticate(email, password);
        if (user && user.token) {
          return { ...user, token: user.token };
        }
        return null;
      },
    }),
  ],
});
