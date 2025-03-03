import styles from './VariableMappingsNode.module.scss';
import nodeStyles from '../Node.module.scss';
import { NodeProps } from 'reactflow';
import { BaseNodeProps } from '../BaseNode';
import Rows from '../Rows/Rows';

export default function MappingNode(props: NodeProps<BaseNodeProps>) {
  return (
    <>
      <div className={`${nodeStyles.container} ${styles.mapping}`}>
        <Rows table={props.data.table} headerClasses={[styles.header]} type={'source'} />
      </div>
    </>
  );
}
