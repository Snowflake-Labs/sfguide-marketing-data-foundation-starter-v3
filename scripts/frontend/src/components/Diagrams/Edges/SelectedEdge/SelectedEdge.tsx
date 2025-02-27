import styles from '../Edge.module.scss';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import { styles as colors } from 'styles/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EdgeChip from '../EdgeChip';
import { useSelectedEdge } from './useSelectedEdge';

export function SelectedEdge(props: EdgeProps): JSX.Element {
  const { style, markerEnd, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
  const { onClickDelete, onClickEdit, shouldRenderIcons } = useSelectedEdge(props);

  const edge_style = {
    ...style,
    stroke: colors.diagram.edge.mapping.primary,
    strokeWidth: 1,
  };

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edge_style} />
      {shouldRenderIcons && (
        <>
          <EdgeLabelRenderer>
            <EdgeChip
              className={styles.iconButton}
              chipX={sourceX + 25}
              chipY={sourceY}
              onClick={onClickDelete}
              data-testid="delete-icon"
            >
              <DeleteIcon className={styles.deleteIcon} color="error" fontSize="small" />
            </EdgeChip>
          </EdgeLabelRenderer>
          <EdgeLabelRenderer>
            <EdgeChip
              className={styles.iconButton}
              chipX={targetX - 25}
              chipY={targetY}
              onClick={onClickEdit}
              data-testid="edit-icon"
            >
              <EditIcon className={styles.editIcon} fontSize="small" />
            </EdgeChip>
          </EdgeLabelRenderer>
        </>
      )}
    </>
  );
}
