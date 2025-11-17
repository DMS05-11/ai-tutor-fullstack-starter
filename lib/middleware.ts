import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './auth-utils';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export async function authenticateToken(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const payload = verifyJWT(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Add user info to request for later use
  (request as any).user = payload;

  return null; // No error, authentication successful
}

export function getAuthUser(request: NextRequest): { userId: string; email: string } | null {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  return verifyJWT(token);
}