import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8000';
const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'https://goulburn.ai';

export async function POST(req: NextRequest) {
  try {
    // MEDIUM FIX 11: CSRF origin check (defense-in-depth alongside sameSite: strict)
    const origin = req.headers.get('origin') || '';
    const allowedOrigins = [
      PUBLIC_URL,
      'https://goulburn-web.vercel.app',
      'http://localhost:3000',
    ];
    const isAllowed = allowedOrigins.some((o) => origin.startsWith(o)) ||
      origin.includes('goulburns-projects.vercel.app');

    if (origin && !isAllowed) {
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Forward to FastAPI backend
    const apiRes = await fetch(`${API_URL}/api/v1/owners/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Invalid credentials' },
        { status: apiRes.status }
      );
    }

    const data = await apiRes.json();
    const { access_token, refresh_token } = data;

    // Set httpOnly cookies — never accessible to client JS
    const response = NextResponse.json({ success: true });

    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    if (refresh_token) {
      response.cookies.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return response;
  } catch (err) {
    console.error('Login route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
