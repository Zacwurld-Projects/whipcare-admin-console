import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from './auth.config';
import NextAuth from 'next-auth';

const { auth } = NextAuth(authConfig);
const protectedRoutes = ['/dashboard'];
const signInPath = '/auth';
const phoneRedirectPath = '/phone-only';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userAgent = request.headers.get('user-agent') || '';
  const isPhone = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  const { pathname } = request.nextUrl;

  // authentication: redirect unauthenticated users to sign-in
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(signInPath, request.url));
  }

  // redirect authenticated users away from the sign-in page
  if (isAuthenticated && pathname === signInPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // user-agent checks: redirect mobile users to phone-only and non-mobile away
  if (isPhone && !pathname.startsWith(phoneRedirectPath)) {
    return NextResponse.redirect(new URL(phoneRedirectPath, request.url));
  }
  if (!isPhone && pathname.startsWith(phoneRedirectPath)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
