/**
 * Session Status Endpoint
 * 
 * Returns current session status (for client-side checks).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionFromCookie();

    if (!userId) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true, userId });
  } catch (error) {
    console.error('Session status error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
