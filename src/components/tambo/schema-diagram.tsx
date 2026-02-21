'use client';

import { useEffect, useState } from 'react';
import ReactFlow, {
  Edge,
  NodeProps,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Table, TableColumn } from '@/lib/types';

interface SchemaDiagramProps {
  tables?: Table[];
}

const TableNode = ({ data }: NodeProps) => {
  return (
    <div className='border border-gray-200 bg-white rounded-xl p-0 min-w-[180px] overflow-hidden'>
      <div className='border-b border-gray-200 py-2 px-3 bg-gray-50'>
        <div className='font-medium text-sm text-gray-800'>{data.label}</div>
      </div>

      <div className='p-0'>
        {(data.columns ?? []).map((column: TableColumn, index: number) => {
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

              {column.isPrimaryKey && (
                <Handle
                  id={targetHandleId}
                  type='target'
                  position={Position.Left}
                  className='!bg-blue-500 !rounded-full !border-2 !border-white !w-3 !h-3'
                  style={{
                    top: '50%',
                    left: -5,
                    opacity: 1,
                    zIndex: 10,
                  }}
                  isConnectable={false}
                  data-column={column.name}
                />
              )}

              {column.foreignKey && (
                <Handle
                  id={sourceHandleId}
                  type='source'
                  position={Position.Right}
                  className='!bg-blue-500 !rounded-full !border-2 !border-white !w-3 !h-3'
                  style={{
                    top: '50%',
                    right: -5,
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

const nodeTypes = {
  tableNode: TableNode,
};

function SchemaDiagramInner({ tables = [] }: SchemaDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!tables || tables.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const calculatePositions = () => {
      const nodeWidth = 200;
      const padding = 120;
      const containerWidth = 1400;
      const containerHeight = 1000;

      const cols = Math.ceil(Math.sqrt(tables.length));
      const cellWidth = containerWidth / cols;
      const cellHeight = containerHeight / Math.ceil(tables.length / cols);

      return tables
        .filter((table) => table.name)
        .map((table, index) => {
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
              columns: table.columns ?? [],
            },
          };
        });
    };

    const generateRelationEdges = () => {
      const relationEdges: Edge[] = [];

      tables.forEach((table) => {
        (table.columns ?? []).forEach((column) => {
          if (column.foreignKey) {
            const sourceTableId = table.name;
            const targetTableId = column.foreignKey.table;

            if (tables.some((t) => t.name === targetTableId)) {
              const edgeId = `${sourceTableId}-${column.name}-${targetTableId}`;

              relationEdges.push({
                id: edgeId,
                source: sourceTableId,
                target: targetTableId,
                sourceHandle: `${sourceTableId}-${column.name}-source`,
                targetHandle: `${targetTableId}-${column.foreignKey.column}-target`,
                type: 'default',
                animated: true,
                style: {
                  stroke: '#3b82f6',
                  strokeWidth: 1,
                  strokeDasharray: '4 3',
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: '#3b82f6',
                  width: 8,
                  height: 8,
                },
                label: `${column.name} → ${column.foreignKey.column}`,
                labelStyle: {
                  fill: '#3b82f6',
                  fontSize: 10,
                  fontFamily: 'monospace',
                  fontWeight: 600,
                },
                labelBgPadding: [4, 2],
                labelBgBorderRadius: 4,
                labelBgStyle: {
                  fill: '#f0f7ff',
                  fillOpacity: 0.8,
                },
                labelShowBg: true,
              });
            }
          }
        });
      });

      return relationEdges;
    };

    const tableNodes = calculatePositions();
    const relationEdges = generateRelationEdges();

    setNodes(tableNodes);
    setEdges(relationEdges);
  }, [tables, setNodes, setEdges]);

  if (!isMounted) {
    return (
      <div className='h-full w-full border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center'>
        <div className='text-center text-gray-500'>
          <div className='text-lg font-medium mb-2'>Loading Diagram...</div>
        </div>
      </div>
    );
  }

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
            strokeWidth: 1,
            strokeDasharray: '4 3',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
            width: 8,
            height: 8,
          },
        }}
        connectionLineStyle={{
          stroke: '#3b82f6',
          strokeWidth: 1,
          strokeDasharray: '4 3',
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

        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 z-10'>
          <div className='text-sm text-gray-600'>
            Tables: {tables.length} | Relationships: {edges.length}
          </div>
        </div>
      </ReactFlow>
    </div>
  );
}

export function SchemaDiagram(props: SchemaDiagramProps) {
  return (
    <ReactFlowProvider>
      <SchemaDiagramInner {...props} />
    </ReactFlowProvider>
  );
}

