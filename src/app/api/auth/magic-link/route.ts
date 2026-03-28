import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8000';
const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'https://goulburn.ai';

// Rate limit: 5 requests per 15 minutes per IP
const attempts = new Map<string, { count: number; resetTime: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || rec.resetTime < now) {
    attempts.set(ip, { count: 1, resetTime: now + WINDOW });
    return true;
  }
  if (rec.count >= MAX) return false;
  rec.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  attempts.forEach((rec, ip) => {
    if (rec.resetTime < now) attempts.delete(ip);
  });
}, 10 * 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Forward to backend
    const apiRes = await fetch(`${API_URL}/api/v1/owners/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Magic link route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
