'use client';

import { NodeProps, Handle, Position } from 'reactflow';
import { TableColumn } from '@/lib/types';

const HANDLE_CLASS =
  '!bg-blue-500 !rounded-full !border-2 !border-white !w-3 !h-3';

/**
 * Renders a single database table as a ReactFlow node.
 * Shows table name, columns with types, and connection handles
 * for primary keys (target) and foreign keys (source).
 */
export const TableNode = ({ data }: NodeProps) => (
  <div className='border border-gray-200 bg-white rounded-xl min-w-[180px] overflow-hidden'>
    <div className='border-b border-gray-200 py-2 px-3 bg-gray-50'>
      <div className='font-medium text-sm text-gray-800'>{data.label}</div>
    </div>

    <div>
      {(data.columns ?? []).map((column: TableColumn) => (
        <div
          key={column.name}
          className='px-3 py-1.5 text-xs border-b border-gray-100 flex items-center justify-between relative last:border-b-0'
          style={{ minHeight: 28 }}
        >
          <div className='flex items-center gap-1.5'>
            {column.isPrimaryKey && (
              <span className='text-yellow-600 flex-shrink-0' title='Primary Key'>
                🔑
              </span>
            )}
            {column.foreignKey && (
              <span
                className='text-blue-600 flex-shrink-0'
                title={`FK → ${column.foreignKey.table}.${column.foreignKey.column}`}
              >
                🔗
              </span>
            )}
            <span className={column.isPrimaryKey ? 'font-medium' : ''}>
              {column.name}
            </span>
            {!column.nullable && (
              <span className='text-red-500' title='Not Null'>
                *
              </span>
            )}
          </div>

          <span className='text-gray-500 text-xs ml-2 flex-shrink-0'>
            {column.type}
          </span>

          {column.isPrimaryKey && (
            <Handle
              id={`${data.label}-${column.name}-target`}
              type='target'
              position={Position.Left}
              className={HANDLE_CLASS}
              style={{ top: '50%', left: -5, opacity: 1, zIndex: 10 }}
              isConnectable={false}
            />
          )}
          {column.foreignKey && (
            <Handle
              id={`${data.label}-${column.name}-source`}
              type='source'
              position={Position.Right}
              className={HANDLE_CLASS}
              style={{ top: '50%', right: -5, opacity: 1, zIndex: 10 }}
              isConnectable={false}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);
