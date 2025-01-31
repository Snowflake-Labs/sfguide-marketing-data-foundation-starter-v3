import { MappingEdge } from 'components/Diagrams/Edges/EdgeTypes';
import { MappingNode } from 'components/Diagrams/Nodes/NodeTypes';

export interface DiagramClickEvent {
  object: string;
}

export interface DiagramEdgeClickEvent {
  edge: MappingEdge;
}

export interface DiagramNodeClickEvent {
  node: MappingNode;
}
