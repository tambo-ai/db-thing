import { createClient, Client } from '@libsql/client';

let tursoClient: Client | null = null;

export function getTurso(): Client {
  if (!tursoClient) {
    if (!process.env.TURSO_DATABASE_URL) {
      throw new Error('TURSO_DATABASE_URL environment variable is not set');
    }
    tursoClient = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return tursoClient;
}
