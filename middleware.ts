import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from './auth.config';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/dashboard'];
const signInPath = '/auth';
const phoneRedirectPath = '/phone-only';

export async function middleware(request: NextRequest) {
  // const session = await auth();
  const secret = authConfig.secret;
  const userAgent = request.headers.get('user-agent') || '';
  const isPhone = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request, secret });
  const expiresAt = token?.expires_at ?? 0; // use nullish coalescing
  const isSessionExpired = !expiresAt || Date.now() > expiresAt; // handle missing value
  const isAuthenticated = !!token?.userId;

  console.log('Middleware Session:', {
    expiresAt: token?.expires_at,
    isExpired: isSessionExpired,
    userId: !!token?.userId,
  });

  // Redirect unauthenticated or expired sessions to sign-in
  if (
    (!isAuthenticated || isSessionExpired) &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL(signInPath, request.url));
  }

  // Redirect authenticated users away from the sign-in page
  if (isAuthenticated && !isSessionExpired && pathname === signInPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // User-agent checks: redirect mobile users to phone-only and non-mobile away
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
