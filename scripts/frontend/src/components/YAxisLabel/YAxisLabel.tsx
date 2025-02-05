import { Body2 } from 'components/common/Text/TextComponents';
import styles from './YAxisLabel.module.scss';

export default function YAxisLabel({ label }: { label: string }) {
  return <Body2 className={styles.container}> {label}</Body2>;
}
