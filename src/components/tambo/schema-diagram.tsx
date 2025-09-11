'use client';

import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Handle,
  MarkerType,
  NodeProps,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Table, TableColumn } from '@/lib/types';
import { z } from 'zod';

interface SchemaDiagramProps {
  tables?: Table[];
  title?: string;
}

// Custom node for database tables
const TableNode = ({ data }: NodeProps) => {
  return (
    <div className='border border-gray-200 bg-white rounded p-0 min-w-[180px] overflow-hidden'>
      {/* Header */}
      <div className='border-b border-gray-200 py-2 px-3 bg-gray-50'>
        <div className='font-medium text-sm text-gray-800'>{data.label}</div>
      </div>

      {/* Columns */}
      <div className='p-0'>
        {data.columns.map((column: TableColumn, index: number) => {
          // Create unique handle IDs that match the table:column pattern
          const sourceHandleId = `${data.label}-${column.name}-source`;
          const targetHandleId = `${data.label}-${column.name}-target`;

          return (
            <div
              key={index}
              className='px-3 py-1.5 text-xs border-b border-gray-100 flex items-center justify-between relative last:border-b-0'
              style={{ minHeight: '28px' }}
            >
              <div className='flex items-center gap-1.5'>
                {column.isPrimaryKey && (
                  <span
                    className='text-yellow-600 flex-shrink-0'
                    title='Primary Key'
                  >
                    🔑
                  </span>
                )}
                {column.foreignKey && (
                  <span
                    className='text-blue-600 flex-shrink-0'
                    title={`Foreign Key to ${column.foreignKey.table}.${column.foreignKey.column}`}
                  >
                    🔗
                  </span>
                )}
                <span className={`${column.isPrimaryKey ? 'font-medium' : ''}`}>
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

              {/* Primary key gets a target handle (for incoming foreign keys) */}
              {column.isPrimaryKey && (
                <Handle
                  id={targetHandleId}
                  type='target'
                  position={Position.Left}
                  className='!bg-blue-500 !rounded-full !border-2 !border-white !w-3 !h-3'
                  style={{
                    top: '50%',
                    left: -6,
                    opacity: 1,
                    zIndex: 10,
                  }}
                  isConnectable={false}
                  data-column={column.name}
                />
              )}

              {/* Foreign keys get source handles (for outgoing relationships) */}
              {column.foreignKey && (
                <Handle
                  id={sourceHandleId}
                  type='source'
                  position={Position.Right}
                  className='!bg-blue-500 !rounded-full !border-2 !border-white !w-3 !h-3'
                  style={{
                    top: '50%',
                    right: -6,
                    opacity: 1,
                    zIndex: 10,
                  }}
                  isConnectable={false}
                  data-column={column.name}
                  data-target-table={column.foreignKey.table}
                  data-target-column={column.foreignKey.column}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Node types definition for ReactFlow
const nodeTypes = {
  tableNode: TableNode,
};

function SchemaDiagramInner({ tables = [] }: SchemaDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Calculate table positions using grid layout
  const calculateNodePositions = useCallback(() => {
    if (!tables || tables.length === 0) return [];

    // Constants for layout
    const nodeWidth = 200;
    const padding = 120;
    const containerWidth = 1400;
    const containerHeight = 1000;

    // Grid layout - arrange tables in a grid pattern
    const cols = Math.ceil(Math.sqrt(tables.length));
    const cellWidth = containerWidth / cols;
    const cellHeight = containerHeight / Math.ceil(tables.length / cols);

    // Create nodes with calculated positions
    const nodes = tables.map((table, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const position = {
        x: col * cellWidth + (cellWidth - nodeWidth) / 2,
        y: row * cellHeight + padding,
      };

      return {
        id: table.name,
        type: 'tableNode',
        position,
        data: {
          label: table.name,
          columns: table.columns,
        },
      };
    });

    return nodes;
  }, [tables]);

  // Generate edges based on foreign key relationships
  const generateEdges = useCallback(() => {
    if (!tables || tables.length === 0) return [];

    const relationEdges: Edge[] = [];

    // Create a map for quick table lookup
    const tableMap = new Map();
    tables.forEach((table) => {
      tableMap.set(table.name, table);
    });

    // Create edges for each foreign key relationship
    tables.forEach((sourceTable) => {
      sourceTable.columns.forEach((sourceColumn) => {
        if (sourceColumn.foreignKey) {
          const targetTableName = sourceColumn.foreignKey.table;
          const targetColumnName = sourceColumn.foreignKey.column;

          if (tableMap.has(targetTableName)) {
            const targetTable = tableMap.get(targetTableName);
            const targetColumn = targetTable.columns.find(
              (c: TableColumn) => c.name === targetColumnName,
            );

            if (targetColumn) {
              // Create a unique ID for this edge
              const edgeId = `${sourceTable.name}:${sourceColumn.name}-to-${targetTableName}:${targetColumnName}`;

              // Use the correct handle IDs that match the pattern in TableNode component
              const sourceHandleId = `${sourceTable.name}-${sourceColumn.name}-source`;
              const targetHandleId = `${targetTableName}-${targetColumnName}-target`;

              relationEdges.push({
                id: edgeId,
                source: sourceTable.name,
                target: targetTableName,
                sourceHandle: sourceHandleId,
                targetHandle: targetHandleId,
                type: 'default',
                animated: false,
                style: {
                  stroke: '#3b82f6',
                  strokeWidth: 2,
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: '#3b82f6',
                  width: 12,
                  height: 12,
                },
                label: `${sourceColumn.name} → ${targetColumnName}`,
                labelStyle: {
                  fill: '#1f2937',
                  fontSize: 10,
                  fontFamily: 'system-ui',
                  fontWeight: 500,
                },
                labelBgPadding: [4, 2],
                labelBgBorderRadius: 4,
                labelBgStyle: {
                  fill: '#f3f4f6',
                  fillOpacity: 0.9,
                  stroke: '#d1d5db',
                  strokeWidth: 1,
                },
                labelShowBg: true,
              });
            }
          }
        }
      });
    });

    return relationEdges;
  }, [tables]);

  useEffect(() => {
    const tableNodes = calculateNodePositions();
    const relationEdges = generateEdges();

    setNodes(tableNodes);
    setEdges(relationEdges);
  }, [calculateNodePositions, generateEdges]); // setNodes and setEdges are stable

  if (!tables || tables.length === 0) {
    return (
      <div className='h-full w-full border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center'>
        <div className='text-center text-gray-500'>
          <div className='text-lg font-medium mb-2'>No Schema Data</div>
          <div className='text-sm'>
            No tables found to display in the diagram.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full w-full border border-gray-200 rounded-lg bg-white overflow-hidden relative'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, includeHiddenNodes: true }}
        defaultEdgeOptions={{
          type: 'default',
          style: {
            stroke: '#3b82f6',
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
            width: 12,
            height: 12,
          },
        }}
        connectionLineStyle={{
          stroke: '#3b82f6',
          strokeWidth: 2,
        }}
        attributionPosition='bottom-right'
        minZoom={0.1}
        maxZoom={1.5}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        proOptions={{ hideAttribution: true }}
        snapToGrid={true}
        snapGrid={[10, 10]}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color='#e5e7eb'
        />
        <Controls showInteractive={false} position='bottom-right' />

        {/* Floating Stats */}
        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 z-10'>
          <div className='text-sm text-gray-600'>
            Tables: {tables.length} | Relationships: {edges.length}
          </div>
        </div>
      </ReactFlow>
    </div>
  );
}

// Main component with ReactFlowProvider
export function SchemaDiagram(props: SchemaDiagramProps) {
  return (
    <ReactFlowProvider>
      <SchemaDiagramInner {...props} />
    </ReactFlowProvider>
  );
}

// Zod schema for the component props
export const schemaDiagramSchema = z.object({
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
    .optional(),
  title: z.string().optional(),
});
