import { Table } from '../types';

const prismaTypeMap: Record<string, string> = {
  SERIAL: 'Int',
  INTEGER: 'Int',
  VARCHAR: 'String',
  TEXT: 'String',
  TIMESTAMP: 'DateTime',
  UUID: 'String',
};

const toPascalCase = (str: string) => {
  return str
    .replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    .replace(/^[a-z]/, (g) => g.toUpperCase());
};

const toCamelCase = (str: string) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

export const generatePrismaSchema = (tables: Table[]): string => {
  if (!tables) return '';
  const models = tables
    .filter((table) => table.name && table.columns)
    .map((table) => {
      const modelName = toPascalCase(table.name);

      const columnsCode = table.columns
        .map((col) => {
          let prismaType = prismaTypeMap[col.type.split('(')[0]] || 'String';
          if (!col.nullable) {
            prismaType = `${prismaType}`;
          } else {
            prismaType = `${prismaType}?`;
          }

          let fieldLine = `  ${toCamelCase(col.name)} ${prismaType}`;

          if (col.isPrimaryKey) {
            fieldLine += ' @id';
          }
          if (col.isUnique) {
            fieldLine += ' @unique';
          }
          if (col.defaultValue === 'CURRENT_TIMESTAMP') {
            fieldLine += ' @default(now())';
          } else if (col.defaultValue) {
            fieldLine += ` @default(${col.defaultValue})`;
          }
          if (toCamelCase(col.name) !== col.name) {
            fieldLine += ` @map("${col.name}")`;
          }

          if (col.foreignKey) {
            const targetModel = toPascalCase(col.foreignKey.table);
            const relationName = toCamelCase(col.foreignKey.table);
            const targetField = toCamelCase(col.foreignKey.column);

            fieldLine += `\n  ${relationName} ${targetModel} @relation(fields: [${toCamelCase(
              col.name,
            )}], references: [${targetField}])`;
          }

          return fieldLine;
        })
        .join('\n');

      const compositeId =
        table.columns.filter((c) => c.isPrimaryKey).length > 1
          ? `\n  @@id([${table.columns
              .filter((c) => c.isPrimaryKey)
              .map((c) => toCamelCase(c.name))
              .join(', ')}])`
          : '';

      const tableNameMapping =
        toCamelCase(table.name) !== table.name
          ? `\n  @@map("${table.name}")`
          : '';

      return `model ${modelName} {\n${columnsCode}${compositeId}${tableNameMapping}\n}`;
    })
    .join('\n\n');

  return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${models}`;
};
