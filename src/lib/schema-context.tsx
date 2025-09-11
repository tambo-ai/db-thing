'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Table } from './types';
import { getDatabaseSchema } from '@/services/database-design';

interface SchemaContextType {
  schemaData: Table[];
  isLoading: boolean;
  updateSchema: (description: string, currentSchema?: Table[]) => Promise<void>;
  setSchemaData: (tables: Table[]) => void;
}

const SchemaContext = createContext<SchemaContextType | undefined>(undefined);

export function useSchema() {
  const context = useContext(SchemaContext);
  if (context === undefined) {
    throw new Error('useSchema must be used within a SchemaProvider');
  }
  return context;
}

interface SchemaProviderProps {
  children: React.ReactNode;
  initialSchema?: Table[];
}

export function SchemaProvider({
  children,
  initialSchema = [],
}: SchemaProviderProps) {
  const [schemaData, setSchemaData] = useState<Table[]>(initialSchema);
  const [isLoading, setIsLoading] = useState(false);

  const updateSchema = useCallback(
    async (description: string, currentSchema?: Table[]) => {
      setIsLoading(true);
      try {
        const newSchema = await getDatabaseSchema(
          description,
          JSON.stringify(currentSchema || schemaData),
        );
        setSchemaData(newSchema);
      } catch (error) {
        console.error('Failed to update schema:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [schemaData],
  );

  const value = {
    schemaData,
    isLoading,
    updateSchema,
    setSchemaData,
  };

  return (
    <SchemaContext.Provider value={value}>{children}</SchemaContext.Provider>
  );
}
