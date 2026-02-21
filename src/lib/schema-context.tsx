'use client';

import React, { createContext, useContext, useState } from 'react';
import { Table } from './types';

interface SchemaContextType {
  schemaData: Table[];
  isStreaming: boolean;
  setSchemaData: (tables: Table[]) => void;
  setIsStreaming: (streaming: boolean) => void;
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
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <SchemaContext.Provider value={{ schemaData, isStreaming, setSchemaData, setIsStreaming }}>
      {children}
    </SchemaContext.Provider>
  );
}
