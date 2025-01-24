import { ColumnMetadata, ColumnRelation, MappingType, ModelUI, TableModel } from 'dtos/ModelUI';
import { MappingNode } from './Nodes/NodeTypes';
import { EventData } from 'dtos/EventData';
import { XYPosition } from 'reactflow';
import { DefaultJoinEdgeProps, DefaultMappingEdgeProps, MappingEdge } from './Edges/EdgeTypes';
import { addAliasToTable } from 'pages/DataSources/CustomizeMapings/EditMappingModel/Helpers';
import { getNodePosition } from './Layout';

/**
 * Builds an array of MappingNode objects from an array of TableModel objects and a NodeLayout array.
 * @param tables - An array of TableModel objects representing tables.
 * @param layout - An array of NodeLayout objects representing the layout of nodes.
 * @returns An array of MappingNode objects.
 */
export function buildNodesFromTables(nodes: TableModel[], target?: TableModel): MappingNode[] {
  const defaultRowHeight = 36;
  let defaultSourcesYPos = 50;
  const defaultSourcesXPos = 50;
  let defaultTargetsYPos = 50;
  const defaultTargetsXPos = 750;
  const defaultFormulaXPos = 550;

  const nodesLayout: MappingNode[] = [];

  nodes.forEach((node, i) => {
    const position = getNodePosition(node.object, target?.object ?? '');

    const height = (node.columns.length + 1) * defaultRowHeight;
    let xPos, yPos;
    if (node.type === 'source' || node.type === 'static' || node.type === 'variable') {
      xPos = defaultSourcesXPos;
      yPos = defaultSourcesYPos;
      yPos += height * i;
      defaultSourcesYPos += defaultRowHeight + height;
    } else if (node.type === 'formula') {
      xPos = defaultFormulaXPos;
      yPos = defaultTargetsYPos / 2;
      defaultTargetsYPos += defaultRowHeight + 100;
    } else {
      xPos = defaultTargetsXPos;
      yPos = defaultTargetsYPos;
      defaultTargetsYPos += defaultRowHeight + height;
    }

    nodesLayout.push({
      id: node.object,
      type: node.type,
      position: { x: position?.x ?? xPos, y: position?.y ?? yPos },
      data: { table: node },
    });
  });

  return nodesLayout;
}

/**
 * Builds a mapping node based on the provided table and position.
 * @param table The table model to build the node from.
 * @param position The position of the node in the diagram.
 * @returns The constructed mapping node.
 */
export function buildNode(table: TableModel, position: XYPosition): MappingNode {
  return {
    id: table.object,
    type: table.type,
    position: position,
    data: { table: table },
  };
}

export function getTableModelFromDropEvent(
  event: React.DragEvent,
  sources: TableModel[],
  model: ModelUI
): { table: TableModel | undefined; nodeType: string } {
  const tableObj = event.dataTransfer.getData(EventData.Sidebar.Table);
  const origin = event.dataTransfer.getData(EventData.Sidebar.Orientation);
  const nodeType = { left: 'source', right: 'target' }[origin] ?? 'source';
  let table = sources.find((t) => t.object === tableObj);
  if (table) table = addAliasToTable(model, table);
  return { table: table, nodeType: nodeType };
}

/**
 * Loads the mapping edges based on the given column relations and table models.
 * @param columnsRelation - An array of column relations.
 * @param sources - An array of table models.
 * @returns An array of mapping edges.
 */
export function loadMappingEdges(columnRelations: ColumnRelation[]): MappingEdge[] {
  const edges: MappingEdge[] = [];
  const formulaOutputEdges: Set<string> = new Set();
  columnRelations.forEach((columnRelation) => {
    const targetNodesAndHandlers = generateTargetNodeAndHandle(columnRelation);
    if (columnRelation.type == MappingType.Static || columnRelation.type == MappingType.Variable) {
      const sourceNodesAndHandlers = generateSourceNodeAndHandle(columnRelation);
      edges.push(generateMappingEdge(sourceNodesAndHandlers, targetNodesAndHandlers));
    }
    columnRelation.sources?.forEach((source) => {
      const sourceNodesAndHandlers = generateSourceNodeAndHandle(columnRelation, source);
      if (columnRelation.type === MappingType.Formula && !formulaOutputEdges.has(targetNodesAndHandlers.target)) {
        edges.push(generateFormulaOutputEdge(columnRelation));
        formulaOutputEdges.add(targetNodesAndHandlers.target);
      }
      edges.push(generateMappingEdge(sourceNodesAndHandlers, targetNodesAndHandlers));
    });
  });

  return edges;
}

function generateMappingEdge(
  source: { source: string; sourceHandle: string },
  target: { target: string; targetHandle: string }
): MappingEdge {
  return {
    ...DefaultMappingEdgeProps,
    id: `${source.sourceHandle}-${target.targetHandle}`,
    ...source,
    ...target,
    type: 'mapping-edge',
  };
}

function generateFormulaOutputEdge(columnRelation: ColumnRelation): MappingEdge {
  const source = `..${columnRelation.type}-${columnRelation.mapping}`;
  const sourceHandle = `${source}-source.handler`;

  const target = columnRelation.target.object;
  const targetHandle = `${target}.${columnRelation.target.columnName}`;

  return {
    ...DefaultMappingEdgeProps,
    id: `${sourceHandle}-${targetHandle}`,
    source,
    sourceHandle,
    target,
    targetHandle,
    type: 'mapping-edge',
  };
}

function generateSourceNodeAndHandle(
  columnRelation: ColumnRelation,
  columnMetadata?: ColumnMetadata
): { source: string; sourceHandle: string } {
  let source, sourceHandle;
  if (!columnMetadata) {
    source = `..${columnRelation.type}`;
    sourceHandle = `${source}.${columnRelation.displayValue ?? columnRelation.mapping}`;
  } else {
    source = columnMetadata.object;
    sourceHandle = `${source}.${columnMetadata.columnName}`;
  }

  return { source, sourceHandle };
}

function generateTargetNodeAndHandle(columnRelation: ColumnRelation): { target: string; targetHandle: string } {
  let target, targetHandle;
  if (columnRelation.type == MappingType.Formula) {
    target = `..${columnRelation.type}-${columnRelation.mapping}`;
    targetHandle = `${target}-target.handler`;
  } else {
    target = columnRelation.target.object;
    targetHandle = `${target}.${columnRelation.target.columnName}`;
  }

  return { target, targetHandle };
}

export function loadJoinEdges(sources: TableModel[], target: TableModel): MappingEdge[] {
  const newEdges: MappingEdge[] = [];
  for (let source of sources) {
    const joins = source.joins?.filter((join) => join.target.object === target.object);
    for (let join of joins ?? []) {
      const sourceNode = join.from.object;
      const targetNode = join.to.object;
      const sourceHandle = `${sourceNode}-join`;
      const targetHandle = `${targetNode}-join`;
      const id = `${sourceNode}-${targetNode}`;
      const edge = {
        ...DefaultJoinEdgeProps,
        id: id,
        source: sourceNode,
        sourceHandle: sourceHandle,
        target: targetNode,
        targetHandle: targetHandle,
        type: 'join-edge',
        data: { label: join.type },
      };
      newEdges.push(edge);
    }
  }
  return newEdges;
}

// Helper function to create a lookup structure for sources
function createSourceLookup(sources: TableModel[]): Set<string> {
  // Implementation depends on the structure of TableModel and how it relates to ColumnMetadata
  // Placeholder for actual implementation
  return new Set(sources.map((source) => source.object));
}

/**
 * Checks if the given source exists in the current schema.
 * This function optimizes lookup performance by converting the sources array to a Set.
 *
 * @param columnMetadatas - The array of column metadata to check against the sources.
 * @param tableModels - The array of table models representing the current schema.
 * @returns A boolean indicating whether any of the column metadata objects exist in the current schema.
 */
function checkIfExistInCurrentSchema(columnMetadatas: ColumnMetadata[], sources: Set<string>): boolean {
  if (!columnMetadatas || !sources) {
    return false;
  }

  return columnMetadatas.some((metadata) => sources.has(metadata.object));
}

/**
 * Builds a mapping edge between two column metadata objects.
 * @param source - The source column metadata object.
 * @param target - The target column metadata object.
 * @returns The mapping edge object.
 */
function buildEdge(source: ColumnMetadata, target: ColumnMetadata): MappingEdge {
  const sourceNode = source.object;
  const targetNode = target.object;
  const sourceHandle = `${sourceNode}.${source.columnName}`;
  const targetHandle = `${targetNode}.${target.columnName}`;
  const id = `${sourceHandle}-${targetHandle}`;
  return {
    id: id,
    source: sourceNode,
    sourceHandle: sourceHandle,
    target: targetNode,
    targetHandle: targetHandle,
    type: 'mapping-edge',
  };
}
