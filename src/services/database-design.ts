import { Table } from '../lib/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getDatabaseSchema(
  description?: string,
  currentSchema?: string,
): Promise<Table[]> {
  try {
    if (!description) {
      // Return empty array if no description provided
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/generate-schema`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        currentSchema: currentSchema
          ? JSON.stringify(currentSchema)
          : undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.schema?.tables || [];
  } catch (error) {
    console.error('Error fetching database schema:', error);
    // Return empty array on error to prevent UI breakage
    return [];
  }
}

export async function analyzeSchema(tables: Table[]): Promise<Table[]> {
  try {
    const description = `Analyze and optimize this existing database schema: ${JSON.stringify(
      tables,
    )}`;
    return await getDatabaseSchema(description);
  } catch (error) {
    console.error('Error analyzing schema:', error);
    return tables; // Return original on error
  }
}

export async function generateMigration(
  currentTables: Table[],
  description: string,
): Promise<Table[]> {
  try {
    return await getDatabaseSchema(description, JSON.stringify(currentTables));
  } catch (error) {
    console.error('Error generating migration:', error);
    return currentTables; // Return current on error
  }
}

export async function validateSchema(tables: Table[]): Promise<Table[]> {
  try {
    const description = `Validate and fix any issues in this database schema: ${JSON.stringify(
      tables,
    )}`;
    return await getDatabaseSchema(description);
  } catch (error) {
    console.error('Error validating schema:', error);
    return tables; // Return original on error
  }
}

export async function optimizeSchema(tables: Table[]): Promise<Table[]> {
  try {
    const description = `Optimize this database schema for better performance and maintainability: ${JSON.stringify(
      tables,
    )}`;
    return await getDatabaseSchema(description);
  } catch (error) {
    console.error('Error optimizing schema:', error);
    return tables; // Return original on error
  }
}
