import { useTheme } from '@mui/material';
import { Subtitle2 } from '../Text/TextComponents';
import styles from './Loading.module.scss';

interface Props {
  label: string;
}

export default function Loading({ label }: Props) {
  const theme = useTheme();
  return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}></div>
      <div className={styles.textContainer}>
        <Subtitle2 color={theme.palette.text.secondary}>{label}</Subtitle2>
      </div>
    </div>
  );
}
