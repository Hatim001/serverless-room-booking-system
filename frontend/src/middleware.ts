import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server';

import { getSession } from './lib/session';

import createMiddleware from 'next-intl/middleware';

import { AppConfig } from '@/utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix as any,
  defaultLocale: AppConfig.defaultLocale,
});

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const { user, role, mfa1, mfa2 } = await getSession();

  const publicPaths = [
    '/user/login',
    '/user/register',
    '/user/register/verify',
    '/agent/login',
    '/agent/register',
    '/agent/register/verify',
    '/rooms',
  ];

  const isPublicPath =
    publicPaths.some((path) => request.nextUrl.pathname.startsWith(path)) ||
    request.nextUrl.pathname === '/';

  if (!isPublicPath) {
    if (['user', 'agent'].includes(role)) {
      const url = request.nextUrl.clone();
      if (!mfa1.configured || !mfa2.configured) {
        console.log('triggered');
        url.pathname = `/${role}/register/mfa-setup?email=${user?.email}`;
      } else if (!mfa1.verified || !mfa2.verified) {
        url.pathname = `/${role}/login/mfa/verify`;
      }
      return NextResponse.redirect(url);
    }
    return NextResponse.redirect('/');
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api/auth|_next|favicon.ico).*)'],
};
