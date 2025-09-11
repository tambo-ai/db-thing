import { Table } from '@/lib/types';
import { getDatabaseSchema as getSchemaFromAPI } from '@/services/database-design';

// Global callback to update schema context from tools
let updateSchemaCallback: ((tables: Table[]) => void) | null = null;

export function setSchemaUpdateCallback(callback: (tables: Table[]) => void) {
  updateSchemaCallback = callback;
}

// These are wrapper functions that will be used by the Tambo tools
// They call the API and can potentially trigger UI updates

export async function getDatabaseSchemaForTool(args: {
  description: string;
  currentSchema?: string;
}): Promise<Table[]> {
  console.log('getDatabaseSchemaForTool called with:', args);
  const { description, currentSchema } = args;
  const result = await getSchemaFromAPI(description, currentSchema);

  // Update the schema context if callback is available
  if (updateSchemaCallback && result) {
    console.log('Updating schema context with:', result);
    updateSchemaCallback(result);
  }

  return result;
}

export async function analyzeSchemaForTool(args: {
  tables: Table[];
}): Promise<Table[]> {
  console.log('analyzeSchemaForTool called with:', args);
  const { tables } = args;
  const description = `Analyze and optimize this existing database schema: ${JSON.stringify(
    tables,
  )}`;
  const result = await getSchemaFromAPI(description);

  // Update the schema context if callback is available
  if (updateSchemaCallback && result) {
    console.log('Updating schema context with:', result);
    updateSchemaCallback(result);
  }

  return result;
}

export async function generateMigrationForTool(args: {
  currentTables: Table[];
  description: string;
}): Promise<Table[]> {
  console.log('generateMigrationForTool called with:', args);
  const { currentTables, description } = args;
  const result = await getSchemaFromAPI(
    description,
    JSON.stringify(currentTables),
  );

  // Update the schema context if callback is available
  if (updateSchemaCallback && result) {
    console.log('Updating schema context with:', result);
    updateSchemaCallback(result);
  }

  return result;
}

export async function validateSchemaForTool(args: {
  tables: Table[];
}): Promise<Table[]> {
  console.log('validateSchemaForTool called with:', args);
  const { tables } = args;
  const description = `Validate and fix any issues in this database schema: ${JSON.stringify(
    tables,
  )}`;
  const result = await getSchemaFromAPI(description);

  // Update the schema context if callback is available
  if (updateSchemaCallback && result) {
    console.log('Updating schema context with:', result);
    updateSchemaCallback(result);
  }

  return result;
}

export async function optimizeSchemaForTool(args: {
  tables: Table[];
}): Promise<Table[]> {
  console.log('optimizeSchemaForTool called with:', args);
  const { tables } = args;
  const description = `Optimize this database schema for better performance and maintainability: ${JSON.stringify(
    tables,
  )}`;
  const result = await getSchemaFromAPI(description);

  // Update the schema context if callback is available
  if (updateSchemaCallback && result) {
    console.log('Updating schema context with:', result);
    updateSchemaCallback(result);
  }

  return result;
}
