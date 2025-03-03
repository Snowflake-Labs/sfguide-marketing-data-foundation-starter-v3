import { styles as colors } from 'styles/styles';
import { Edge, BaseEdge, EdgeProps, getBezierPath, MarkerType } from 'reactflow';
import { SelectedEdge } from './SelectedEdge/SelectedEdge';
import { useDiagramContext } from '../DiagramContext';
import { JoinEdge } from './JoinEdge/JoinEdge';

export function MappingEdge(props: EdgeProps): JSX.Element {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, selected } = props;

  const { isEdgeSelected } = useDiagramContext();
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edge_style = {
    ...style,
    stroke: selected || !isEdgeSelected ? colors.diagram.edge.mapping.primary : colors.diagram.edge.mapping.disabled,
    strokeWidth: 1,
  };

  return selected ? <SelectedEdge {...props} /> : <BaseEdge path={edgePath} markerEnd={markerEnd} style={edge_style} />;
}

export const DefaultBaseEdgeProps = {
  deletable: false,
};

export const DefaultMappingEdgeProps = {
  ...DefaultBaseEdgeProps,
  markerEnd: { type: MarkerType.ArrowClosed, color: colors.diagram.edge.mapping.primary, strokeWidth: 2 },
};

export const DefaultJoinEdgeProps = {
  ...DefaultBaseEdgeProps,
};

export const EdgeTypes = {
  'join-edge': JoinEdge,
  'mapping-edge': MappingEdge,
};

export type MappingEdge = Edge;
