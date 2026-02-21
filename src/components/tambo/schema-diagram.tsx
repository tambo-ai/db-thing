'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Table } from '@/lib/types';
import { TableNode } from './table-node';
import {
  EDGE_STYLE,
  EDGE_MARKER,
  fingerprint,
  gridPosition,
  buildEdges,
} from './diagram-utils';

interface SchemaDiagramProps {
  tables?: Table[];
}

const nodeTypes = { tableNode: TableNode };

/**
 * Inner diagram component that must be wrapped in ReactFlowProvider.
 * Handles node/edge state, streaming-safe updates, and viewport fitting.
 */
function SchemaDiagramInner({ tables = [] }: SchemaDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isMounted, setIsMounted] = useState(false);
  const { fitView } = useReactFlow();

  /** Cached node positions — prevents nodes from jumping when new columns stream in. */
  const positions = useRef(new Map<string, { x: number; y: number }>());

  /** Column fingerprints — when unchanged, we reuse the same node reference so ReactFlow skips re-rendering. */
  const fingerprints = useRef(new Map<string, string>());

  /** Tracks the last-seen table count so fitView only fires when a new table appears. */
  const prevCount = useRef(0);

  /** Stores the pending fitView RAF id so we can cancel it on unmount or re-trigger. */
  const fitViewRaf = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (fitViewRaf.current != null) cancelAnimationFrame(fitViewRaf.current);
    };
  }, []);

  /**
   * Wraps the default onNodesChange to also persist drag positions
   * into the positions ref, so they survive streaming re-renders.
   */
  const handleNodesChange: typeof onNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      for (const c of changes) {
        if (c.type === 'position' && c.position && c.id) {
          positions.current.set(c.id, c.position);
        }
      }
    },
    [onNodesChange],
  );

  /**
   * Main sync effect — runs on every `tables` change (including streaming ticks).
   * Uses fingerprinting to preserve node object references for unchanged tables,
   * which prevents ReactFlow from re-rendering/flashing those nodes.
   */
  useEffect(() => {
    if (!tables || tables.length === 0) {
      setNodes([]);
      setEdges([]);
      positions.current.clear();
      fingerprints.current.clear();
      prevCount.current = 0;
      return;
    }

    const valid = tables.filter((t) => t.name);

    setNodes((current) => {
      const byId = new Map(current.map((n) => [n.id, n]));

      return valid.map((table, i) => {
        const cols = table.columns ?? [];
        const fp = fingerprint(cols);
        const prev = byId.get(table.name);

        if (prev && fingerprints.current.get(table.name) === fp) return prev;

        fingerprints.current.set(table.name, fp);

        return {
          id: table.name,
          type: 'tableNode' as const,
          position:
            prev?.position ??
            positions.current.get(table.name) ??
            gridPosition(i, valid.length),
          data: { label: table.name, columns: cols },
        };
      });
    });

    setEdges(buildEdges(valid));

    if (valid.length !== prevCount.current) {
      prevCount.current = valid.length;
      if (fitViewRaf.current != null) cancelAnimationFrame(fitViewRaf.current);
      fitViewRaf.current = requestAnimationFrame(() => {
        fitViewRaf.current = null;
        fitView({ padding: 0.1, duration: 200 });
      });
    }
  }, [tables, setNodes, setEdges, fitView]);

  if (!isMounted) {
    return (
      <div className='h-full w-full border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center'>
        <div className='text-lg font-medium text-gray-500'>
          Loading Diagram...
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
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          type: 'default',
          style: EDGE_STYLE,
          markerEnd: EDGE_MARKER,
        }}
        connectionLineStyle={EDGE_STYLE}
        minZoom={0.1}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        snapToGrid
        snapGrid={[10, 10]}
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

/**
 * Interactive Entity Relationship Diagram rendered with ReactFlow.
 * Accepts a `tables` array that can be streamed in progressively —
 * only nodes whose columns actually changed will re-render.
 */
export function SchemaDiagram(props: SchemaDiagramProps) {
  return (
    <ReactFlowProvider>
      <SchemaDiagramInner {...props} />
    </ReactFlowProvider>
  );
}
