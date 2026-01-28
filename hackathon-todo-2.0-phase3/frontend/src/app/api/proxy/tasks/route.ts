import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Generic handler for all HTTP methods
async function handleRequest(request: NextRequest, method: string) {
  try {
    // Get the auth token from cookies or headers
    let authToken = null;
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('better-auth.session_token');
    authToken = authCookie?.value;

    // If not in cookies, try to get from headers (for debugging)
    if (!authToken) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7);
      }
    }

    // Extract the resource path from the URL (e.g., if URL is /api/proxy/tasks/123, resourcePath is tasks/123)
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/api/proxy/')[1]?.split('/') || [];
    const resourcePath = pathParts.join('/');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000';
    const fullBackendUrl = `${backendUrl}/api/v1/${resourcePath}`;

    let body = undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.json();
    }

    const response = await fetch(fullBackendUrl, {
      method,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error(`Proxy ${method} error:`, error);
    return Response.json({ error: `Failed to ${method.toLowerCase()} resource` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE');
}