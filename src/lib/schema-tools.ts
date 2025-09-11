import { Table } from '@/lib/types';
import { getDatabaseSchema as getSchemaFromAPI } from '@/services/database-design';

// These are wrapper functions that will be used by the Tambo tools
// They call the API and can potentially trigger UI updates

export async function getDatabaseSchemaForTool(
  description: string,
  currentSchema?: string,
): Promise<Table[]> {
  return await getSchemaFromAPI(description, currentSchema);
}

export async function analyzeSchemaForTool(tables: Table[]): Promise<Table[]> {
  const description = `Analyze and optimize this existing database schema: ${JSON.stringify(
    tables,
  )}`;
  return await getSchemaFromAPI(description);
}

export async function generateMigrationForTool(
  currentTables: Table[],
  description: string,
): Promise<Table[]> {
  return await getSchemaFromAPI(description, JSON.stringify(currentTables));
}

export async function validateSchemaForTool(tables: Table[]): Promise<Table[]> {
  const description = `Validate and fix any issues in this database schema: ${JSON.stringify(
    tables,
  )}`;
  return await getSchemaFromAPI(description);
}

export async function optimizeSchemaForTool(tables: Table[]): Promise<Table[]> {
  const description = `Optimize this database schema for better performance and maintainability: ${JSON.stringify(
    tables,
  )}`;
  return await getSchemaFromAPI(description);
}
