/**
 * Database Client for SAGE OS
 * 
 * Production-grade Postgres client with connection pooling.
 * All queries use the public schema (search_path = public).
 */

import { Pool, type PoolClient, type QueryResult } from 'pg';

let pool: Pool | null = null;

/**
 * Get or create the database connection pool
 * Lazy initialization to allow for missing DATABASE_URL during development
 */
function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is required. ' +
      'Set it in .env.local: DATABASE_URL=postgresql://user:password@localhost:5432/sage_os'
    );
  }

  if (!pool) {
    // Create connection pool
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Production settings
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return error if connection not established within 2 seconds
    });

    // Ensure search_path is set to public for all connections
    pool.on('connect', async (client: PoolClient) => {
      await client.query('SET search_path TO public');
    });
  }

  return pool;
}

/**
 * Execute a query with automatic search_path enforcement
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const poolInstance = getPool();
  const client = await poolInstance.connect();
  try {
    await client.query('SET search_path TO public');
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  const poolInstance = getPool();
  const client = await poolInstance.connect();
  await client.query('SET search_path TO public');
  return client;
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const poolInstance = getPool();
  const client = await poolInstance.connect();
  try {
    await client.query('BEGIN');
    await client.query('SET search_path TO public');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close the connection pool (for graceful shutdown)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

// Export pool getter for advanced use cases
export { getPool as pool };
