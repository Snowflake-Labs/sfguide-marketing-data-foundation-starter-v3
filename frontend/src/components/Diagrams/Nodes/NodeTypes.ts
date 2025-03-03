import { Node } from 'reactflow';
import SourceNode from './SourceNode/SourceNode';
import TargetNode from './TargetNode/TargetNode';
import SourceGhostNode from './GhostNode/SourceGhostNode';
import { TableModel } from 'dtos/ModelUI';
import StaticMappingsNode from './MappingNodes/StaticMappingsNode';
import VariableMappingsNode from './MappingNodes/VariableMappingsNode';
import FormulaNode from './FormulaNode/FormulaNode';

export type NodeType = 'source' | 'target' | 'mapping' | 'ghost-source' | string;

export const NodeTypes = {
  source: SourceNode,
  target: TargetNode,
  static: StaticMappingsNode,
  variable: VariableMappingsNode,
  'ghost-source': SourceGhostNode,
  formula: FormulaNode,
};

export type MappingNode = Node<{ table: TableModel }, NodeType>;

export type OnChange<ChangesType> = (changes: ChangesType[]) => void;
