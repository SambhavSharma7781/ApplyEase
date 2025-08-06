import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/services/jwt';

export function middleware(request: NextRequest) {
  var path = request.nextUrl.pathname;
  
  // Allow login page
  if (path === '/login') {
    return NextResponse.next();
  }
  
  // Allow signup page
  if (path === '/signup') {
    return NextResponse.next();
  }
  
  // Allow API routes
  if (path.indexOf('/api') === 0) {
    return NextResponse.next();
  }
  
  // For all other pages, check if user is logged in
  var token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  var tokenValue = token.value;
  
  if (!tokenValue) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Check if token is valid
  try {
    verifyToken(tokenValue);
  } catch (e) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
