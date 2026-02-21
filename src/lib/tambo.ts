/**
 * @file tambo.ts
 * @description Central configuration file for Tambo database design components and tools
 *
 * This file serves as the central place to register your database design components and analysis tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from '@/components/tambo/graph';
import { DataCard, dataCardSchema } from '@/components/ui/card-data';
import {
  SchemaCanvas,
  schemaCanvasSchema,
} from '@/components/tambo/schema-canvas';
import type { TamboComponent, TamboTool } from '@tambo-ai/react';

export const tools: TamboTool[] = [];

/**
 * components
 *
 * This array contains all the database design and visualization components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render database schemas, ERDs, and analysis visualizations based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: 'SchemaCanvas',
    description:
      'Renders a database schema as an interactive Entity Relationship Diagram in the canvas. Use this component whenever the user asks to create, design, or modify a database schema. Supports two modes: Use mode="full" when creating a brand new schema — provide ALL tables. Use mode="update" when the user asks to add, modify, or remove tables from an existing schema — provide ONLY the new or changed tables in "tables", existing tables are preserved automatically. To DELETE tables, pass their names in the "removedTables" array (e.g. removedTables: ["users", "posts"]). Always prefer mode="update" when a schema already exists in the canvas.',
    component: SchemaCanvas,
    propsSchema: schemaCanvasSchema,
  },
  {
    name: 'Graph',
    description:
      'A component that renders various types of charts (bar, line, pie) using Recharts. Useful for visualizing database metrics, performance data, and schema statistics.',
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: 'DataCard',
    description:
      'A component that displays database objects (tables, columns, relationships) as clickable cards with detailed information and selection capabilities.',
    component: DataCard,
    propsSchema: dataCardSchema,
  },
];
