/**
 * Protected Architect Route Example
 * 
 * This is a sample protected route that requires architect authentication.
 * Use this pattern for any architect-only API endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireArchitectSession } from '@/lib/auth/authorization';

export async function GET(request: NextRequest) {
  try {
    // This will redirect to login if not authenticated
    const userId = await requireArchitectSession();

    // Only reached if authenticated
    return NextResponse.json({
      message: 'This is a protected architect route',
      userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
