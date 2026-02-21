import { Edge, MarkerType } from 'reactflow';
import { Table, TableColumn } from '@/lib/types';

/** Default stroke style applied to all relationship edges. */
export const EDGE_STYLE = {
  stroke: '#3b82f6',
  strokeWidth: 1,
  strokeDasharray: '4 3',
};

/** Arrow marker displayed at the target end of each edge. */
export const EDGE_MARKER = {
  type: MarkerType.ArrowClosed as const,
  color: '#3b82f6',
  width: 8,
  height: 8,
};

/**
 * Creates a stable string fingerprint from a column list.
 * Used to detect whether a node's data actually changed between
 * streaming ticks, so unchanged nodes can keep the same object
 * reference and avoid a ReactFlow re-render.
 */
export function fingerprint(columns: TableColumn[]): string {
  return columns
    .map(
      (c) =>
        `${c.name}:${c.type}:${c.nullable}:${c.isPrimaryKey}:${c.isUnique}:${c.defaultValue ?? ''}:${c.foreignKey ? `${c.foreignKey.table}.${c.foreignKey.column}` : ''}`,
    )
    .join('|');
}

/**
 * Computes a grid position for a table node.
 * Arranges nodes in a roughly square grid with consistent spacing.
 *
 * @param index - The table's index in the list
 * @param total - Total number of tables (determines grid dimensions)
 */
export function gridPosition(index: number, total: number) {
  if (total <= 0) return { x: 0, y: 120 };
  const cols = Math.ceil(Math.sqrt(total));
  const cellW = 1400 / cols;
  const cellH = 1000 / Math.ceil(total / cols);
  return {
    x: (index % cols) * cellW + (cellW - 200) / 2,
    y: Math.floor(index / cols) * cellH + 120,
  };
}

/**
 * Creates a stable fingerprint of all foreign key relationships.
 * Used to skip rebuilding edges when relationships haven't changed.
 */
export function edgeFingerprint(tables: Table[]): string {
  const parts: string[] = [];
  for (const table of tables) {
    for (const col of table.columns ?? []) {
      if (col.foreignKey) {
        parts.push(`${table.name}.${col.name}->${col.foreignKey.table}.${col.foreignKey.column}`);
      }
    }
  }
  return parts.sort().join('|');
}

/**
 * Builds ReactFlow edges from foreign key relationships.
 * Only creates edges where both the source and target table exist
 * in the current table list.
 */
export function buildEdges(tables: Table[]): Edge[] {
  const tableNames = new Set(tables.map((t) => t.name));
  const edges: Edge[] = [];

  for (const table of tables) {
    for (const col of table.columns ?? []) {
      if (!col.foreignKey || !tableNames.has(col.foreignKey.table)) continue;

      edges.push({
        id: `${table.name}-${col.name}-${col.foreignKey.table}-${col.foreignKey.column}`,
        source: table.name,
        target: col.foreignKey.table,
        sourceHandle: `${table.name}-${col.name}-source`,
        targetHandle: `${col.foreignKey.table}-${col.foreignKey.column}-target`,
        type: 'default',
        animated: true,
        style: EDGE_STYLE,
        markerEnd: EDGE_MARKER,
        label: `${col.name} → ${col.foreignKey.column}`,
        labelStyle: {
          fill: '#3b82f6',
          fontSize: 10,
          fontFamily: 'monospace',
          fontWeight: 600,
        },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#f0f7ff', fillOpacity: 0.8 },
        labelShowBg: true,
      });
    }
  }

  return edges;
}
