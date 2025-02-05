import { ReactNode } from 'react';
import styles from './Spinner.module.scss';
import { Box, CircularProgress, CircularProgressProps } from '@mui/material';
import { Subtitle2 } from '../Text/TextComponents';
import LinearProgress from '@mui/material/LinearProgress';

interface Props extends CircularProgressProps {
  children: ReactNode;
  overlap?: boolean;
  loading: boolean;
  label?: string;
}

export default function Spinner(props: Props) {
  const { children, loading, overlap, ...other } = props;
  return loading ? (
    <>
      {overlap && children}
      <Box className={styles.container}>
        <Box className={styles.overlay}></Box>
        <Box className={styles.spinner}>
          <div></div>
        </Box>
        <Subtitle2>{props.label}</Subtitle2>
      </Box>
    </>
  ) : (
    children
  );
}

export function ProgressBar(props: Props) {
  const { children, loading, overlap, ...other } = props;
  return loading ? (
    <>
      {overlap && children}
      <Box className={styles.container}>
        <Box className={styles.overlay}></Box>
        <Subtitle2>{props.label}</Subtitle2>
        <LinearProgress className={styles.ProgressBar} color="primary" />
      </Box>
    </>
  ) : (
    children
  );
}
