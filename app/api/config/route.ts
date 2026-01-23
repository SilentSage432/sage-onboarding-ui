/**
 * Configuration Introspection Endpoint
 * 
 * Read-only endpoint that returns configuration metadata for operational introspection.
 * Shows which environment variables are present (not their values), which features are enabled,
 * and basic runtime information.
 * 
 * Used by operators and orchestration systems to verify configuration state.
 * 
 * Always returns HTTP 200 (read-only introspection, not a health check).
 * No authentication required (configuration metadata is non-sensitive).
 */

import { NextResponse } from 'next/server';
import { getConfigMetadata } from '@/lib/infrastructure/configMetadata';

export async function GET() {
  const metadata = getConfigMetadata();
  
  return NextResponse.json(
    {
      ...metadata,
      ts: new Date().toISOString(),
    },
    { status: 200 }
  );
}
