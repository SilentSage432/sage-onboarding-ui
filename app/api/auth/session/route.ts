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
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({ authenticated: true, userId }, { status: 200 });
  } catch (error) {
    console.error('Session status error:', error);
    // Always return JSON, even on error
    return NextResponse.json(
      { 
        authenticated: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
