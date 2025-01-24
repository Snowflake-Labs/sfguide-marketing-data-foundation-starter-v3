import styles from './TargetNode.module.scss';
import nodeStyles from '../Node.module.scss';
import { NodeProps } from 'reactflow';
import { BaseNodeProps } from '../BaseNode';
import Rows from '../Rows/Rows';

export default function TargetNode(props: NodeProps<BaseNodeProps>) {
  const table = props.data.table;
  return (
    <>
      <div className={`${nodeStyles.container} ${styles.target}`}>
        <Rows table={table} headerClasses={[styles.header]} type={'target'} />
      </div>
    </>
  );
}
