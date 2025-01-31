import { EdgeProps, getBezierPath, BaseEdge, EdgeLabelRenderer } from 'reactflow';
import { styles as colors } from 'styles/styles';
import EdgeChip from '../EdgeChip';

export function JoinEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps): JSX.Element {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const join_style = {
    ...style,
    stroke: colors.diagram.edge.join.primary,
    strokeWidth: 1,
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={join_style} />
      {data.label && (
        <EdgeLabelRenderer>
          <EdgeChip chipX={labelX} chipY={labelY}>
            <div
              style={{
                padding: '0px 2px',
              }}
            >
              {data.label}
            </div>
          </EdgeChip>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
