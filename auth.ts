import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { userService } from './app/api/apiClient';
import { JWT } from 'next-auth/jwt';
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
    expiresAt: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string | undefined;
    accessToken: string | undefined;
    expires_at: number;
    expired: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  callbacks: {
    async jwt({ token, account, user }): Promise<JWT | null> {
      // 1. Handle initial login or token updates
      if (account?.type === 'credentials' && user) {
        // Initial login: set expires_at
        return {
          ...token,
          userId: user.id,
          accessToken: user.token,
          expires_at: Date.now() + 60 * 60 * 24 * 10 * 1000, // 10 days
          role: user.role,
          expired: false,
        };
      }

      // 2. For subsequent requests, ensure expires_at exists
      if (!token.expires_at) {
        token.expires_at = Date.now() + 60 * 60 * 24 * 10 * 1000; // Default 10 days
      }

      // 3. Update expired flag
      token.expired = Date.now() > token.expires_at;

      return token;
    },
    async session({ session, token }) {
      // 4. Explicitly pass expiresAt to the session
      session.expiresAt = token.expires_at as number;
      session.user = {
        ...session.user,
        id: token.userId as string,
        token: token.accessToken as string,
        role: token.role as string,
      };
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
