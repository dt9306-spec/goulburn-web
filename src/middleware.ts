import { NextRequest, NextResponse } from 'next/server';

// --- Maintenance Mode ------------------------------------------------
// Set to true to block public access. Bypass with ?bypass=goulburn-admin
// or once bypassed, the cookie persists for the session.
const MAINTENANCE_MODE = true;
const MAINTENANCE_BYPASS_SECRET = 'goulburn-admin';
// ---------------------------------------------------------------------

const PROTECTED_PATHS = ['/dashboard'];
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.goulburn.ai';

function maintenanceResponse() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>goulburn.ai - Maintenance</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      background: #fafafa;
      color: #1a1a1a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      max-width: 440px;
      padding: 40px 24px;
    }
    .logo {
      width: 48px; height: 48px;
      background: linear-gradient(135deg, #E98300, #F5A623);
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    h1 span { color: #E98300; }
    p {
      font-size: 15px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    .status {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 16px;
      background: #E9830015;
      border: 1px solid #E9830033;
      border-radius: 8px;
      font-size: 13px;
      color: #E98300;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">&#x2B21;</div>
    <h1>goulburn<span>.ai</span></h1>
    <p>We're performing scheduled maintenance and improvements. The platform will be back online shortly.</p>
    <div class="status">Under Maintenance</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '3600',
    },
  });
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // --- Maintenance gate ----------------------------------------------
  if (MAINTENANCE_MODE) {
    // Allow Next.js internals, static assets, and API routes through
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/favicon') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.webmanifest')
    ) {
      return NextResponse.next();
    }

    // Check bypass: query param sets a cookie, cookie persists access
    const bypassParam = searchParams.get('bypass');
    const bypassCookie = req.cookies.get('maintenance_bypass')?.value;

    if (bypassParam === MAINTENANCE_BYPASS_SECRET) {
      // Set bypass cookie and redirect to clean URL (strip query param)
      const cleanUrl = new URL(pathname, req.url);
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set('maintenance_bypass', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60, // 24 hours
      });
      return response;
    }

    if (bypassCookie !== 'true') {
      return maintenanceResponse();
    }
  }

  // --- Auth protection for dashboard ---------------------------------
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const accessToken = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  // No tokens at all - redirect to login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If access token exists, let the request through
  if (accessToken) {
    return NextResponse.next();
  }

  // Access token expired but refresh token exists - try to refresh
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

        // Set new access token
        response.cookies.set('access_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 15 * 60,
        });

        // Set rotated refresh token
        if (data.refresh_token) {
          response.cookies.set('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
          });
        }

        return response;
      }
    } catch {
      // Refresh failed - fall through to redirect
    }
  }

  // All auth failed - redirect to login
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
