import { NextRequest, NextResponse } from 'next/server';

// Force dynamic — never cache this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const API_URL = process.env.API_URL || 'https://api.goulburn.ai';

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

    const backendUrl = `${API_URL}/api/v1/owners/magic-link`;
    console.log('[magic-link] Forwarding to backend:', backendUrl);

    // Forward to backend — cache: no-store prevents Next.js fetch caching
    const apiRes = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });

    console.log('[magic-link] Backend response status:', apiRes.status);

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[magic-link] Route error:', err);
    // Still return success to prevent email enumeration
    return NextResponse.json({ success: true });
  }
      }
