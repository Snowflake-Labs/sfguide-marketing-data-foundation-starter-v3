import styles from './MappingTable.module.scss';
import { SelectChangeEvent, Select, MenuItem } from '@mui/material';
import { useState } from 'react';

interface ISelectColumnProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  menuItems: string[];
}

export default function SelectColumn({ value, onChange, menuItems }: ISelectColumnProps) {
  return (
    <Select onChange={onChange} className={styles.column} defaultValue={value}>
      {menuItems.map((option, index) => (
        <MenuItem key={`menu-item-${index}`} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}
