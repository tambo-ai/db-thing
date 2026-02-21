'use client';

import { useEffect, useRef } from 'react';
import { useTamboStreamStatus } from '@tambo-ai/react';
import { useSchema } from '@/lib/schema-context';
import { Table } from '@/lib/types';
import { z } from 'zod';

interface SchemaCanvasProps {
  tables?: Table[];
  mode?: 'full' | 'update';
}

/**
 * Merges incoming tables with the existing schema.
 * - Tables with matching names are replaced (updated).
 * - New tables are appended.
 * - Existing tables not in the incoming set are kept as-is.
 */
function mergeTables(existing: Table[], incoming: Table[]): Table[] {
  const merged = new Map<string, Table>();

  // Start with all existing tables
  for (const table of existing) {
    merged.set(table.name, table);
  }

  // Upsert incoming tables
  for (const table of incoming) {
    if (table.name) {
      merged.set(table.name, table);
    }
  }

  return Array.from(merged.values());
}

export function SchemaCanvas({ tables, mode = 'full' }: SchemaCanvasProps) {
  const { streamStatus } = useTamboStreamStatus<SchemaCanvasProps>();
  const { schemaData, setSchemaData, setIsStreaming } = useSchema();
  // Capture the existing schema at mount time so merges are stable
  const existingAtMount = useRef<Table[]>(schemaData);

  // Sync streaming tables to schema context
  useEffect(() => {
    if (!tables || tables.length === 0) return;

    if (mode === 'update') {
      // Merge: keep existing tables, upsert incoming ones
      const merged = mergeTables(existingAtMount.current, tables);
      setSchemaData(merged);
    } else {
      // Full replace
      setSchemaData(tables);
    }
  }, [tables, mode, setSchemaData]);

  // Sync streaming state
  useEffect(() => {
    setIsStreaming(streamStatus.isStreaming || streamStatus.isPending);
  }, [streamStatus.isStreaming, streamStatus.isPending, setIsStreaming]);

  if (streamStatus.isPending) {
    return (
      <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700'>
        <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
        {mode === 'update'
          ? 'Updating schema...'
          : 'Designing database schema...'}
      </div>
    );
  }

  if (streamStatus.isStreaming) {
    const tableCount = tables?.length ?? 0;
    return (
      <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700'>
        <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
        {mode === 'update' ? (
          <>
            Adding {tableCount} {tableCount === 1 ? 'table' : 'tables'}...
          </>
        ) : (
          <>
            Streaming schema... {tableCount}{' '}
            {tableCount === 1 ? 'table' : 'tables'} so far
          </>
        )}
      </div>
    );
  }

  const tableCount = tables?.length ?? 0;
  return (
    <div className='flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg text-sm text-green-700'>
      <svg
        className='w-4 h-4'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 13l4 4L19 7'
        />
      </svg>
      {mode === 'update' ? (
        <>
          Added {tableCount} {tableCount === 1 ? 'table' : 'tables'} to canvas
        </>
      ) : (
        <>
          Schema ready — {tableCount}{' '}
          {tableCount === 1 ? 'table' : 'tables'} in canvas
        </>
      )}
    </div>
  );
}

export const schemaCanvasSchema = z.object({
  mode: z
    .enum(['full', 'update'])
    .optional()
    .describe(
      'Set to "full" when creating a brand new schema from scratch. Set to "update" when adding, modifying, or removing tables from an existing schema — this preserves all existing tables and only applies the changes.',
    ),
  tables: z
    .array(
      z.object({
        name: z.string().describe('The name of the database table'),
        columns: z
          .array(
            z.object({
              name: z.string().describe('Column name'),
              type: z
                .string()
                .describe(
                  'Column data type (e.g. VARCHAR, INT, TIMESTAMP, UUID, TEXT, BOOLEAN)',
                ),
              nullable: z
                .boolean()
                .describe('Whether the column allows NULL values'),
              defaultValue: z
                .string()
                .optional()
                .describe('Default value for the column'),
              isPrimaryKey: z
                .boolean()
                .describe('Whether this column is a primary key'),
              isUnique: z
                .boolean()
                .describe('Whether this column has a unique constraint'),
              foreignKey: z
                .object({
                  table: z.string().describe('Referenced table name'),
                  column: z.string().describe('Referenced column name'),
                })
                .optional()
                .describe('Foreign key reference, if any'),
            }),
          )
          .optional()
          .describe('The columns in this table'),
      }),
    )
    .optional()
    .describe(
      'The tables to render. In "full" mode, provide ALL tables for the complete schema. In "update" mode, provide ONLY the new or modified tables — existing unchanged tables are preserved automatically.',
    ),
});
