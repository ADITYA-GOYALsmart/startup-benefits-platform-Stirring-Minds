import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request: NextRequest) {
  // For now, no global middleware; auth is handled per route
  // This can be expanded if needed for global auth checks
}

export const config = {
  matcher: '/api/:path*',
};
