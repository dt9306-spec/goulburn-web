import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/dashboard'];
const API_URL = process.env.API_URL || 'http://localhost:8000';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect dashboard routes
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const accessToken = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  // No tokens at all — redirect to login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If access token exists, let the request through
  // (the API route handlers will handle token validation)
  if (accessToken) {
    return NextResponse.next();
  }

  // Access token expired but refresh token exists — try to refresh
  if (refreshToken) {
    try {
      const refreshRes = await fetch(`${API_URL}/api/v1/owners/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const response = NextResponse.next();

        response.cookies.set('access_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 15 * 60,
        });

        return response;
      }
    } catch {
      // Refresh failed — fall through to redirect
    }
  }

  // All auth failed — redirect to login
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
