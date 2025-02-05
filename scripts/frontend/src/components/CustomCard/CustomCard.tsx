import * as React from 'react';
import styles from './CustomCard.module.scss';
import { Stack } from '@mui/material';

export interface ICustomCardProps {
  selected?: boolean;
  disabled?: boolean;
  onClick?: (event: any) => void;
  children: React.ReactNode;
}

export default function CustomCard({ selected, disabled, onClick, children }: ICustomCardProps) {
  return (
    <Stack
      direction="column"
      className={disabled ? styles.source_card_disabled : selected ? styles.source_card_selected : styles.source_card}
      spacing={2}
      onClick={onClick}
    >
      {children}
    </Stack>
  );
}
