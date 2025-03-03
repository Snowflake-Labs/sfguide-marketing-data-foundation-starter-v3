import { Box, ButtonProps, CircularProgress, Button as MuiButton } from '@mui/material';
import styles from './Button.module.scss';

interface Props extends ButtonProps {
  isLoading?: boolean;
}

export const Button = ({ isLoading, disabled, ...props }: Props) => {
  return (
    <MuiButton
      {...props}
      className={`${props.className} ${styles.button}`}
      disabled={disabled || isLoading}
      startIcon={isLoading ? <Progress /> : props.startIcon}
    />
  );
};

const Progress = () => (
  <Box className={styles.spinner}>
    <CircularProgress className={styles.icon} size={'20px'} />
  </Box>
);
