import { Table } from './lib/types';

export const schemaData: Table[] = [
  // Multi-tenancy
  {
    name: 'organizations',
    columns: [
      {
        name: 'id',
        type: 'SERIAL',
        nullable: false,
        isPrimaryKey: true,
        isUnique: true,
        foreignKey: undefined,
      },
      {
        name: 'name',
        type: 'VARCHAR(255)',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: true,
        defaultValue: 'CURRENT_TIMESTAMP',
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
    ],
  },
  {
    name: 'users',
    columns: [
      {
        name: 'id',
        type: 'SERIAL',
        nullable: false,
        isPrimaryKey: true,
        isUnique: true,
        foreignKey: undefined,
      },
      {
        name: 'organization_id',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: { table: 'organizations', column: 'id' },
      },
      {
        name: 'email',
        type: 'VARCHAR(255)',
        nullable: false,
        isPrimaryKey: false,
        isUnique: true,
        foreignKey: undefined,
      },
      {
        name: 'password_hash',
        type: 'VARCHAR(255)',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
      {
        name: 'role',
        type: 'VARCHAR(50)',
        nullable: true,
        defaultValue: "'member'",
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      }, // e.g., 'admin', 'member'
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: true,
        defaultValue: 'CURRENT_TIMESTAMP',
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
    ],
  },

  // Product Catalog
  {
    name: 'products',
    columns: [
      {
        name: 'id',
        type: 'SERIAL',
        nullable: false,
        isPrimaryKey: true,
        isUnique: true,
        foreignKey: undefined,
      },
      {
        name: 'organization_id',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: { table: 'organizations', column: 'id' },
      },
      {
        name: 'name',
        type: 'VARCHAR(255)',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
      {
        name: 'description',
        type: 'TEXT',
        nullable: true,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
      {
        name: 'status',
        type: 'VARCHAR(50)',
        nullable: true,
        defaultValue: "'draft'",
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      }, // e.g., 'draft', 'active', 'archived'
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: true,
        defaultValue: 'CURRENT_TIMESTAMP',
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
    ],
  },
  {
    name: 'product_variants',
    columns: [
      {
        name: 'id',
        type: 'SERIAL',
        nullable: false,
        isPrimaryKey: true,
        isUnique: true,
        foreignKey: undefined,
      },
      {
        name: 'product_id',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: { table: 'products', column: 'id' },
      },
      {
        name: 'sku',
        type: 'VARCHAR(100)',
        nullable: true,
        isPrimaryKey: false,
        isUnique: true,
        foreignKey: undefined,
      },
      {
        name: 'price',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      }, // in cents
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: true,
        defaultValue: 'CURRENT_TIMESTAMP',
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
    ],
  },
  {
    name: 'variant_attributes',
    columns: [
      {
        name: 'variant_id',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: true,
        isUnique: false,
        foreignKey: { table: 'product_variants', column: 'id' },
      },
      {
        name: 'attribute',
        type: 'VARCHAR(100)',
        nullable: false,
        isPrimaryKey: true,
        isUnique: false,
        foreignKey: undefined,
      }, // e.g., 'Color', 'Size'
      {
        name: 'value',
        type: 'VARCHAR(100)',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      }, // e.g., 'Red', 'Large'
    ],
  },

  // Inventory
  {
    name: 'inventory',
    columns: [
      {
        name: 'variant_id',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: true,
        isUnique: false,
        foreignKey: { table: 'product_variants', column: 'id' },
      },
      {
        name: 'quantity',
        type: 'INTEGER',
        nullable: false,
        defaultValue: '0',
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
      {
        name: 'updated_at',
        type: 'TIMESTAMP',
        nullable: true,
        defaultValue: 'CURRENT_TIMESTAMP',
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
    ],
  },

  // Customers
  {
    name: 'customers',
    columns: [
      {
        name: 'id',
        type: 'SERIAL',
        nullable: false,
        isPrimaryKey: true,
        isUnique: true,
        foreignKey: undefined,
      },
      {
        name: 'organization_id',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: { table: 'organizations', column: 'id' },
      },
      {
        name: 'email',
        type: 'VARCHAR(255)',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
      {
        name: 'first_name',
        type: 'VARCHAR(255)',
        nullable: true,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
      {
        name: 'last_name',
        type: 'VARCHAR(255)',
        nullable: true,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: true,
        defaultValue: 'CURRENT_TIMESTAMP',
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
    ],
  },

  // Orders
  {
    name: 'orders',
    columns: [
      {
        name: 'id',
        type: 'SERIAL',
        nullable: false,
        isPrimaryKey: true,
        isUnique: true,
        foreignKey: undefined,
      },
      {
        name: 'customer_id',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: { table: 'customers', column: 'id' },
      },
      {
        name: 'status',
        type: 'VARCHAR(50)',
        nullable: false,
        defaultValue: "'pending'",
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      }, // e.g., 'pending', 'paid', 'shipped', 'cancelled'
      {
        name: 'total_amount',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      }, // in cents
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: true,
        defaultValue: 'CURRENT_TIMESTAMP',
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
    ],
  },
  {
    name: 'order_items',
    columns: [
      {
        name: 'id',
        type: 'SERIAL',
        nullable: false,
        isPrimaryKey: true,
        isUnique: true,
        foreignKey: undefined,
      },
      {
        name: 'order_id',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: { table: 'orders', column: 'id' },
      },
      {
        name: 'variant_id',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: { table: 'product_variants', column: 'id' },
      },
      {
        name: 'quantity',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      },
      {
        name: 'unit_price',
        type: 'INTEGER',
        nullable: false,
        isPrimaryKey: false,
        isUnique: false,
        foreignKey: undefined,
      }, // in cents, at time of purchase
    ],
  },
];
