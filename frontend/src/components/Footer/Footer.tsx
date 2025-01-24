import styles from './Footer.module.scss';
import { Box } from '@mui/material';
import { useFooterContext } from './FooterContext/FooterContext';

interface Props {}

export default function Footer(props: Props) {
  const { children } = useFooterContext();
  return children ? <Box className={styles.container}>{children}</Box> : undefined;
}
