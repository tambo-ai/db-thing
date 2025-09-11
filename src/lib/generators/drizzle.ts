import { Table, TableColumn } from '../types';

const drizzleTypeMap: Record<string, (col: TableColumn) => string> = {
  SERIAL: () => 'serial',
  INTEGER: () => 'integer',
  VARCHAR: (col) => `varchar('${col.name}', { length: 255 })`,
  TEXT: () => 'text',
  TIMESTAMP: () => 'timestamp',
  UUID: () => 'uuid',
};

const toCamelCase = (str: string) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

export const generateDrizzleSchema = (tables: Table[]): string => {
  const imports = new Set<string>(['pgTable']);

  const tableCode = tables
    .map((table) => {
      const tableNameCamel = toCamelCase(table.name);
      const columnsCode = table.columns
        .map((col) => {
          const typeFunc =
            drizzleTypeMap[col.type.split('(')[0]] ||
            (() => `custom('${col.type}')`);
          const drizzleType = typeFunc(col);

          if (drizzleType.includes('serial')) imports.add('serial');
          if (drizzleType.includes('varchar')) imports.add('varchar');
          if (drizzleType.includes('timestamp')) imports.add('timestamp');
          if (drizzleType.includes('text')) imports.add('text');
          if (drizzleType.includes('integer')) imports.add('integer');
          if (drizzleType.includes('uuid')) imports.add('uuid');

          let columnChain = `  ${toCamelCase(col.name)}: ${drizzleType}('${
            col.name
          }')`;

          if (
            col.isPrimaryKey &&
            !table.columns.some((c) => c.isPrimaryKey && c.name !== col.name)
          ) {
            columnChain += '.primaryKey()';
          }
          if (!col.nullable) {
            columnChain += '.notNull()';
          }
          if (col.isUnique) {
            columnChain += '.unique()';
          }
          if (col.defaultValue === 'CURRENT_TIMESTAMP') {
            columnChain += '.defaultNow()';
          } else if (col.defaultValue) {
            columnChain += `.default(${col.defaultValue})`;
          }
          if (col.foreignKey) {
            const targetTableCamel = toCamelCase(col.foreignKey.table);
            const targetColumnCamel = toCamelCase(col.foreignKey.column);
            columnChain += `.references(() => ${targetTableCamel}.${targetColumnCamel})`;
          }
          return columnChain;
        })
        .join(',\n');

      let tableExtraConfig = '';
      const compositeKeys = table.columns.filter((c) => c.isPrimaryKey);
      if (compositeKeys.length > 1) {
        imports.add('primaryKey');
        const keyColumns = compositeKeys
          .map((c) => `table.${toCamelCase(c.name)}`)
          .join(', ');
        tableExtraConfig = `\n}, (table) => {
  return {
    pk: primaryKey({ columns: [${keyColumns}] }),
  };
}`;
      }

      return `export const ${tableNameCamel} = pgTable('${table.name}', {\n${columnsCode}\n}${tableExtraConfig});`;
    })
    .join('\n\n');

  const importStatement = `import { ${[...imports]
    .sort()
    .join(', ')} } from 'drizzle-orm/pg-core';`;

  return `${importStatement}\n\n${tableCode}`;
};
