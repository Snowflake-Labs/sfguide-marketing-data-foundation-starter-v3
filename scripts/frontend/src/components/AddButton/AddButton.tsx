import styles from './AddButton.module.scss';
import AddIcon from '@mui/icons-material/Add';
import { Subtitle2 } from 'components/common/Text/TextComponents';
import { Button } from 'components/common/Button/Button';
import { ReactNode } from 'react';
import { ButtonProps } from '@mui/material';

interface Props extends ButtonProps {
  children: ReactNode;
}

export default function AddButton({ children, ...other }: Props) {
  return (
    <Button {...other} className={styles.button}>
      <AddIcon className={styles.add_icon} />
      <Subtitle2>{children}</Subtitle2>
    </Button>
  );
}
