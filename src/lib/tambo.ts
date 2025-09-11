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
  getDatabaseSchemaForTool,
  analyzeSchemaForTool,
  generateMigrationForTool,
  validateSchemaForTool,
  optimizeSchemaForTool,
} from '@/lib/schema-tools';
import type { TamboComponent } from '@tambo-ai/react';
import { TamboTool } from '@tambo-ai/react';
import { z } from 'zod';

/**
 * tools
 *
 * This array contains all the database analysis and generation tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically analyze schemas, generate migrations, and provide optimization insights.
 */

export const tools: TamboTool[] = [
  {
    name: 'getDatabaseSchema',
    description:
      'Generate a database schema from a natural language description. Provide a description of what the database should handle and it will create tables, columns, relationships, and constraints.',
    tool: getDatabaseSchemaForTool,
    toolSchema: z
      .function()
      .args(
        z.object({
          description: z
            .string()
            .describe('Description of the database requirements'),
          currentSchema: z
            .string()
            .optional()
            .describe('Current schema to modify/extend (JSON format)'),
        }),
      )
      .returns(
        z.array(
          z.object({
            name: z.string(),
            columns: z.array(
              z.object({
                name: z.string(),
                type: z.string(),
                nullable: z.boolean(),
                defaultValue: z.string().optional(),
                isPrimaryKey: z.boolean(),
                isUnique: z.boolean(),
                foreignKey: z
                  .object({
                    table: z.string(),
                    column: z.string(),
                  })
                  .optional(),
              }),
            ),
          }),
        ),
      ),
  },
  {
    name: 'analyzeSchema',
    description:
      'Analyze an existing database schema for potential issues, optimization opportunities, and best practices. Takes the current schema and provides an improved version.',
    tool: analyzeSchemaForTool,
    toolSchema: z
      .function()
      .args(
        z.object({
          tables: z
            .array(
              z.object({
                name: z.string(),
                columns: z.array(
                  z.object({
                    name: z.string(),
                    type: z.string(),
                    nullable: z.boolean(),
                    defaultValue: z.string().optional(),
                    isPrimaryKey: z.boolean(),
                    isUnique: z.boolean(),
                    foreignKey: z
                      .object({
                        table: z.string(),
                        column: z.string(),
                      })
                      .optional(),
                  }),
                ),
              }),
            )
            .describe('Current schema tables to analyze'),
        }),
      )
      .returns(
        z.array(
          z.object({
            name: z.string(),
            columns: z.array(
              z.object({
                name: z.string(),
                type: z.string(),
                nullable: z.boolean(),
                defaultValue: z.string().optional(),
                isPrimaryKey: z.boolean(),
                isUnique: z.boolean(),
                foreignKey: z
                  .object({
                    table: z.string(),
                    column: z.string(),
                  })
                  .optional(),
              }),
            ),
          }),
        ),
      ),
  },
  {
    name: 'generateMigration',
    description:
      'Generate database migration by modifying an existing schema based on new requirements. Takes current tables and a description of changes needed.',
    tool: generateMigrationForTool,
    toolSchema: z
      .function()
      .args(
        z.object({
          currentTables: z
            .array(
              z.object({
                name: z.string(),
                columns: z.array(
                  z.object({
                    name: z.string(),
                    type: z.string(),
                    nullable: z.boolean(),
                    defaultValue: z.string().optional(),
                    isPrimaryKey: z.boolean(),
                    isUnique: z.boolean(),
                    foreignKey: z
                      .object({
                        table: z.string(),
                        column: z.string(),
                      })
                      .optional(),
                  }),
                ),
              }),
            )
            .describe('Current schema tables'),
          description: z.string().describe('Description of the changes needed'),
        }),
      )
      .returns(
        z.array(
          z.object({
            name: z.string(),
            columns: z.array(
              z.object({
                name: z.string(),
                type: z.string(),
                nullable: z.boolean(),
                defaultValue: z.string().optional(),
                isPrimaryKey: z.boolean(),
                isUnique: z.boolean(),
                foreignKey: z
                  .object({
                    table: z.string(),
                    column: z.string(),
                  })
                  .optional(),
              }),
            ),
          }),
        ),
      ),
  },
  {
    name: 'validateSchema',
    description:
      'Validate and fix issues in a database schema for consistency, referential integrity, and design best practices.',
    tool: validateSchemaForTool,
    toolSchema: z
      .function()
      .args(
        z.object({
          tables: z
            .array(
              z.object({
                name: z.string(),
                columns: z.array(
                  z.object({
                    name: z.string(),
                    type: z.string(),
                    nullable: z.boolean(),
                    defaultValue: z.string().optional(),
                    isPrimaryKey: z.boolean(),
                    isUnique: z.boolean(),
                    foreignKey: z
                      .object({
                        table: z.string(),
                        column: z.string(),
                      })
                      .optional(),
                  }),
                ),
              }),
            )
            .describe('Schema tables to validate'),
        }),
      )
      .returns(
        z.array(
          z.object({
            name: z.string(),
            columns: z.array(
              z.object({
                name: z.string(),
                type: z.string(),
                nullable: z.boolean(),
                defaultValue: z.string().optional(),
                isPrimaryKey: z.boolean(),
                isUnique: z.boolean(),
                foreignKey: z
                  .object({
                    table: z.string(),
                    column: z.string(),
                  })
                  .optional(),
              }),
            ),
          }),
        ),
      ),
  },
  {
    name: 'optimizeSchema',
    description:
      'Optimize a database schema for better performance, normalization, and maintainability.',
    tool: optimizeSchemaForTool,
    toolSchema: z
      .function()
      .args(
        z.object({
          tables: z
            .array(
              z.object({
                name: z.string(),
                columns: z.array(
                  z.object({
                    name: z.string(),
                    type: z.string(),
                    nullable: z.boolean(),
                    defaultValue: z.string().optional(),
                    isPrimaryKey: z.boolean(),
                    isUnique: z.boolean(),
                    foreignKey: z
                      .object({
                        table: z.string(),
                        column: z.string(),
                      })
                      .optional(),
                  }),
                ),
              }),
            )
            .describe('Schema tables to optimize'),
        }),
      )
      .returns(
        z.array(
          z.object({
            name: z.string(),
            columns: z.array(
              z.object({
                name: z.string(),
                type: z.string(),
                nullable: z.boolean(),
                defaultValue: z.string().optional(),
                isPrimaryKey: z.boolean(),
                isUnique: z.boolean(),
                foreignKey: z
                  .object({
                    table: z.string(),
                    column: z.string(),
                  })
                  .optional(),
              }),
            ),
          }),
        ),
      ),
  },
];

/**
 * components
 *
 * This array contains all the database design and visualization components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render database schemas, ERDs, and analysis visualizations based on user interactions.
 */
export const components: TamboComponent[] = [
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
  // TODO: Add more database-specific components:
  // - TableSchema component for detailed table visualization
  // - SQLDisplay component for generated SQL code
  // - SchemaComparison component for before/after comparisons
];
