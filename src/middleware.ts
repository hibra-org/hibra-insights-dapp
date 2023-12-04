/* eslint-disable import/no-unused-modules */
import { NextResponse } from 'next/server';

async function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|common|avatars|top-page).*)',
  ],
};

export default middleware;
