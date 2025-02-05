import styles from './GhostNode.module.scss';
import { NodeProps } from 'reactflow';
import { BaseNodeProps } from '../BaseNode';
import SourceNode from '../SourceNode/SourceNode';
import { Box } from '@mui/material';

export default function SourceGhostNode(props: NodeProps<BaseNodeProps>) {
  return (
    <Box className={styles.container}>
      <SourceNode {...props} />
    </Box>
  );
}
