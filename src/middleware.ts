import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/services/jwt';

// Pages that do not require authentication
const PUBLIC_PAGE_PATHS = ['/login', '/signup'];

// API routes accessible without a token
const PUBLIC_API_PATHS = [
    '/api/login',
    '/api/signup',
    '/api/search',
    '/api/search/suggestion',
];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isApiRoute = path.startsWith('/api');

    if (PUBLIC_PAGE_PATHS.includes(path)) {
        return NextResponse.next();
    }

    if (PUBLIC_API_PATHS.some(p => path === p || path.startsWith(p + '/'))) {
        return NextResponse.next();
    }

    const rawToken = request.cookies.get('token')?.value;
    const token = rawToken ? decodeURIComponent(rawToken) : null;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
        if (isApiRoute) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)',],
};
