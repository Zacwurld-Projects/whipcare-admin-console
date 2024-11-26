import { NextRequest, NextResponse } from 'next/server';
const PHONE_REDIRECT_PATH = '/phone-only';
// const AUTH_REDIRECT_PATH = '/auth';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isPhone = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  // check if user is signed in via a cookie
  //   const isAuthenticated = request.cookies.get("auth-token") !== undefined;

  const { pathname } = request.nextUrl;

  // handle unauthenticated users
  //   if (!isAuthenticated && pathname !== AUTH_REDIRECT_PATH) {
  //     return NextResponse.redirect(new URL(AUTH_REDIRECT_PATH, request.url));
  //   }

  // handle phone users trying to access non-phone pages

  if (isPhone && !pathname.startsWith(PHONE_REDIRECT_PATH)) {
    return NextResponse.redirect(new URL('/phone-only', request.url));
  }

  // handle non-phone users trying to access the phone-only page
  if (!isPhone && pathname.startsWith(PHONE_REDIRECT_PATH)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
