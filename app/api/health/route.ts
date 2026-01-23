/**
 * Health Check Endpoint (Liveness Probe)
 * 
 * Simple liveness check that indicates the process is running.
 * This endpoint does NOT check dependencies - it only confirms the process is alive.
 * 
 * Used by container orchestration systems (Kubernetes, Docker, etc.) for liveness probes.
 * Always returns HTTP 200 if the process is running.
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'sage-enterprise-ui',
      ts: new Date().toISOString(),
    },
    { status: 200 }
  );
}
