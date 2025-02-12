import NextAuth, { Session } from 'next-auth';
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
      if (account?.type === 'credentials' && user) {
        token.userId = user.id; // associate userId with token
        token.accessToken = user.token;
        token.expires_at = Date.now() + 60 * 60 * 24 * 7; // 7 days
        token.role = user.role;
        token.expired = false;
      }

      if (Date.now() > (token.expires_at || 0)) {
        token.expired = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.expired || Date.now() > (token.expires_at || 0)) {
        return { user: {}, expiresAt: 0 } as Session;
      }

      session.user = {
        ...session.user,
        id: token.userId as string,
        token: token.accessToken as string,
        role: token.role as string,
      };

      session.expiresAt = token.expires_at as number; // pass expiration to session
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
