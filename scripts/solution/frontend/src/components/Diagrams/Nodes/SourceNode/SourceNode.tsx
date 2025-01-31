import styles from './Source.module.scss';
import nodeStyles from '../Node.module.scss';
import { NodeProps } from 'reactflow';
import { BaseNodeProps } from '../BaseNode';
import Rows from '../Rows/Rows';
import { Box } from '@mui/material';

export default function SourceNode(props: NodeProps<BaseNodeProps>) {
  return (
    <>
    <Box>
      <div className={`${nodeStyles.container} ${styles.source}`}>
        <Rows table={props.data.table} headerClasses={[styles.header]} type={'source'} />
      </div>
      </Box>
    </>
  );
}
