/**
 * Architect Bootstrap Endpoint
 * 
 * Server-side endpoint that checks session and returns architect status.
 * Called by console layout on boot to set systemPerspective.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getArchitectSession } from '@/lib/auth/authorization';

export async function GET(request: NextRequest) {
  try {
    const userId = await getArchitectSession();

    if (!userId) {
      return NextResponse.json({ isArchitect: false });
    }

    return NextResponse.json({ isArchitect: true, userId });
  } catch (error) {
    console.error('Architect bootstrap error:', error);
    return NextResponse.json({ isArchitect: false }, { status: 500 });
  }
}
