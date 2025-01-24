import styles from './ColumnSelect.module.scss';
import CustomSelect, { IMenuItem } from 'components/CustomSelect/CustomSelect';
import ColumnTypeIcon from 'components/ColumnTypeIcon/ColumnTypeIcon';
import { ColumnModel, ColumnType } from 'dtos/ModelUI';
import { SelectProps } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

type Props = SelectProps & {
  label: string;
  columns: ColumnModel[];
  onChangeColumn: (column: ColumnModel) => void;
};

export default function ColumnSelect({ columns, ...props }: Props) {
  const [type, setType] = useState<ColumnType | undefined>();

  const menuItems = useMemo(
    () =>
      columns.map<IMenuItem>((column) => ({
        value: column.columnName,
        label: column.columnName,
        startAdornment: <ColumnTypeIcon type={column.type} />,
      })),
    [columns]
  );

  const handleItemChange = (item: { value: string }) => {
    const column = columns.find((column) => column.columnName === item.value);
    if (!column) return;
    props.onChangeColumn(column);
  };

  useEffect(() => {
    const columnType = columns.find((column) => column.columnName === props.value)?.type;
    setType(columnType);
  }, [props.value]);

  return (
    <CustomSelect
      {...props}
      menuItems={menuItems}
      sx={{ '.MuiSelect-icon': { opacity: type ? 0 : 1 } }}
      endAdornment={type && <ColumnTypeIcon type={type} />}
      className={styles.container}
      onChangeItem={handleItemChange}
    />
  );
}
