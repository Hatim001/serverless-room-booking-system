import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server';

import { getSession } from './lib/session';

const PUBLIC_PATHS = [
  '/user/login',
  '/user/register',
  '/user/register/verify',
  '/agent/login',
  '/agent/register',
  '/agent/register/verify',
  '/rooms',
  '/user/login/mfa-verify',
  '/user/register/mfa-setup',
  '/agent/login/mfa-verify',
  '/agent/register/mfa-setup',
];

const isPublicPath = (pathname: string) => {
  return (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) || pathname === '/'
  );
};

const redirectToRooms = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = '/rooms';
  return NextResponse.redirect(url);
};

const redirectToMfaSetup = (request: NextRequest, role: string, user: any) => {
  const url = request.nextUrl.clone();
  url.pathname = `/${role}/register/mfa-setup`;
  url.searchParams.set('email', user.email);
  return NextResponse.redirect(url);
};

const redirectToMfaVerify = (request: NextRequest, role: string) => {
  const url = request.nextUrl.clone();
  url.pathname = `/${role}/login/mfa-verify`;
  return NextResponse.redirect(url);
};

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // const session: any = await getSession();
  // const { user = {}, role = '', mfa_1 = {}, mfa_2 = {} } = session || {};
  // const isAuthenticated = user && (role === 'agent' || role === 'user');

  // // If the user is authenticated
  // if (isAuthenticated) {
  //   // Redirect to /rooms if accessing a public path
  //   if (isPublicPath(request.nextUrl.pathname)) {
  //     return redirectToRooms(request);
  //   }

  //   // Handle MFA configuration and verification
  //   if (!mfa_1.configured || !mfa_2.configured) {
  //     return redirectToMfaSetup(request, role, user);
  //   } else if (!mfa_1.verified || !mfa_2.verified) {
  //     return redirectToMfaVerify(request, role);
  //   }
  // } else {
  //   // If the user is not authenticated, check if accessing a public path
  //   if (!isPublicPath(request.nextUrl.pathname)) {
  //     return NextResponse.redirect('/');
  //   }
  // }

  // Let the request continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next|favicon.ico).*)'],
};
