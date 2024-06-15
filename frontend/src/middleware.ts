import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AppConfig } from '@/utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix as any,
  defaultLocale: AppConfig.defaultLocale,
});

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const token = request.cookies.get('auth-token');

  const publicPaths = [
    '/user/login',
    '/user/register',
    '/user/register/verify',
    '/agent/login',
    '/agent/register',
    '/api/auth/*',
    '/rooms',
  ];

  const isPublicPath =
    publicPaths.some((path) => request?.nextUrl?.pathname?.startsWith(path)) ||
    request.nextUrl.pathname === '/';

  if (!isPublicPath && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api/auth|_next|favicon.ico).*)'],
};
