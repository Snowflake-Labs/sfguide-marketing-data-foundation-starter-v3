import { ColumnModel } from 'dtos/ModelUI';
import { Edge } from 'reactflow';

/**
 * shortens a string by replacing middle carachters with ellipsis
 * @param string String to shorten
 * @param maxLenght max lenght the shorten String will have
 */
export default function shortenString(string: string, maxLenght: number) {
  if (string.length <= maxLenght) {
    return string;
  }

  const excessLength = string.length - maxLenght + 3;
  const frontLength = Math.ceil((string.length - excessLength) / 2);
  const backLength = string.length - frontLength - excessLength;

  return string.slice(0, frontLength) + '...' + string.slice(string.length - backLength);
}

export function updateColumnMappingsHighlight(edges: Edge[], selectedColumn: ColumnModel) {
  let updatedEdges = edges;
  const selectedEdges = getColumnEdges(updatedEdges, selectedColumn);
  selectedEdges.forEach((edge) => {
    updatedEdges = UpdateEdgesHighlight(updatedEdges, edge);
  });

  return updatedEdges;
}

export function getColumnEdges(edges: Edge[], selectedColumn: ColumnModel) {
  const columnEdges = edges.filter((edge) => {
    const target = edge.targetHandle?.split('.');
    const source = edge.sourceHandle?.split('.');
    const [, , columnTable] = selectedColumn.object.split('.');
    const isTargetMatch = columnTable === target?.[2] && selectedColumn.columnName === target?.[3];
    const isSourceMatch = columnTable === source?.[2] && selectedColumn.columnName === source?.[3];
    return isTargetMatch || isSourceMatch;
  });

  return columnEdges;
}

export function UpdateEdgesHighlight(edges: Edge[], selectedEdge: Edge) {
  const relatedEdges = getRelatedFormulaEdge(edges, selectedEdge);
  const updatedEdges = edges.map((edge) => {
    if (edge.id === selectedEdge.id || relatedEdges.some((relatedEdge) => relatedEdge.id === edge.id)) {
      return { ...edge, selected: true };
    }
    return edge;
  });

  return updatedEdges;
}

export const getRelatedFormulaEdge = (edges: Edge[], edge: Edge) => {
  const relatedEdges = edges
    .filter((e) => e.id != edge.id)
    .filter((e) => e.source === edge.target || e.target === edge.source);
  return relatedEdges;
};
