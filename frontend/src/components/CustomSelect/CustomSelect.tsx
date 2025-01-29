import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';
import styles from './CustomSelect.module.scss';

export interface IMenuItem {
  value: string;
  label: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export type ICustomSelectProps = SelectProps & {
  menuItems: IMenuItem[];
  label: string;
  isLoading?: boolean;
  onChangeItem?: (item: IMenuItem) => void;
};

export const InitialMenuItems: IMenuItem[] = [];

const MyCircularProgress = () => (
  <Box className={styles.spinner_container}>
    <CircularProgress size={'20px'} />
  </Box>
);

export default function CustomSelect({ disabled, menuItems, isLoading, onChangeItem, ...props }: ICustomSelectProps) {
  const [selectLabelId, customSelectId] = useMemo(() => {
    const newLabel = props.label.replaceAll(' ', '-');
    return [`select-label-${newLabel}`, `custom-select-${newLabel}`];
  }, [props.label]);

  const handleOnChange = (event: SelectChangeEvent<unknown>, child: ReactNode) => {
    const value = event.target.value as string;
    const item = menuItems?.find((item) => item.value == value);
    if (item) onChangeItem?.(item);
    props.onChange?.(event, child);
  };

  return (
    <FormControl fullWidth size="small" disabled={disabled || isLoading}>
      <InputLabel id={selectLabelId} htmlFor={customSelectId}>
        {props.label}
      </InputLabel>
      <Select
        {...props}
        labelId={selectLabelId}
        label={props.label}
        id={customSelectId}
        value={props.value ?? ''}
        renderValue={(selected: any) => menuItems.find((item) => item.value === selected)?.label}
        IconComponent={isLoading ? MyCircularProgress : undefined}
        onChange={handleOnChange}
      >
        {menuItems?.map((menuItem, index) => (
          <MenuItem
            id={selectLabelId}
            key={`menuItem-${menuItem.label}-${index}`}
            value={menuItem.value}
            className={styles.menuItem}
          >
            {menuItem.startAdornment}
            {menuItem.label}
            {menuItem.endAdornment}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
