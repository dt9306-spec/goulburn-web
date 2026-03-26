import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8000';

/**
 * BFF proxy: forwards authenticated requests to the FastAPI backend.
 * Reads JWT from httpOnly cookie and passes as Bearer token.
 * 
 * Usage: fetch('/api/dashboard/owner/dashboard') 
 *   → proxies to API_URL/api/v1/owner/dashboard with JWT
 */
export async function GET(req: NextRequest) {
  return proxyRequest(req, 'GET');
}

export async function POST(req: NextRequest) {
  return proxyRequest(req, 'POST');
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req, 'PUT');
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req, 'PATCH');
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req, 'DELETE');
}

async function proxyRequest(req: NextRequest, method: string) {
  const accessToken = req.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Extract the path after /api/dashboard/
  const url = new URL(req.url);
  const apiPath = url.pathname.replace('/api/dashboard/', '');
  const queryString = url.search;
  const targetUrl = `${API_URL}/api/v1/${apiPath}${queryString}`;

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Forward body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const body = await req.text();
        if (body) fetchOptions.body = body;
      } catch {
        // No body — fine for empty POSTs
      }
    }

    const apiRes = await fetch(targetUrl, fetchOptions);

    // Handle streaming responses (NDJSON export)
    const contentType = apiRes.headers.get('content-type') || '';
    if (contentType.includes('ndjson')) {
      return new NextResponse(apiRes.body, {
        status: apiRes.status,
        headers: {
          'Content-Type': 'application/x-ndjson',
          'Content-Disposition': apiRes.headers.get('content-disposition') || '',
        },
      });
    }

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err) {
    console.error('Dashboard proxy error:', err);
    return NextResponse.json(
      { error: 'Failed to reach API' },
      { status: 502 }
    );
  }
}
