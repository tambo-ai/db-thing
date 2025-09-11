import { Table } from '../types';

export const generateSqlCode = (tables: Table[]): string => {
  return tables
    .map((table) => {
      const columnDefinitions = table.columns
        .map((col) => {
          let definition = `  ${col.name} ${col.type}`;

          if (!col.nullable) {
            definition += ' NOT NULL';
          }

          if (col.defaultValue) {
            definition += ` DEFAULT ${col.defaultValue}`;
          }

          if (col.isPrimaryKey) {
            definition += ' PRIMARY KEY';
          }

          if (col.isUnique && !col.isPrimaryKey) {
            definition += ' UNIQUE';
          }

          return definition;
        })
        .join(',\n');

      let tableDef = `CREATE TABLE ${table.name} (\n${columnDefinitions}`;

      const foreignKeys = table.columns
        .filter((col) => col.foreignKey)
        .map(
          (col) =>
            `  FOREIGN KEY (${col.name}) REFERENCES ${col.foreignKey?.table}(${col.foreignKey?.column})`,
        )
        .join(',\n');

      if (foreignKeys) {
        tableDef += ',\n' + foreignKeys;
      }

      tableDef += '\n);';
      return tableDef;
    })
    .join('\n\n');
};
