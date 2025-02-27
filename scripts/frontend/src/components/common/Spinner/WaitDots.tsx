import { Body2 } from '../Text/TextComponents';
import styles from './WaitDots.module.scss';

interface Props {
  loading: boolean;
}

export default function WaitDots({ loading }: Props) {
  return (loading && 
    <div className={styles.container}>
      <div className={styles.balls}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    )
}