import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify magic link token with backend
    const apiRes = await fetch(
      `${API_URL}/api/v1/owners/verify-magic-link`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }
    );

    if (!apiRes.ok) {
      const errorData = await apiRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Invalid or expired link' },
        { status: apiRes.status }
      );
    }

    const data = await apiRes.json();
    const { access_token, refresh_token } = data;

    if (!access_token || typeof access_token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid server response' },
        { status: 502 }
      );
    }

    // Set httpOnly cookies
    const response = NextResponse.json({ success: true });

    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    });

    if (refresh_token) {
      response.cookies.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (err) {
    console.error('Verify route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
