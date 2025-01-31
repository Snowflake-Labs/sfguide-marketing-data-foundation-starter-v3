import {useState } from 'react';
import styles from './ColumnMappings.module.scss';
import { TableModel } from 'dtos/ModelUI';
import { Box } from '@mui/material';
import SearchBar from 'components/SearchBar/SearchBar';
import List from '../List/List';
import { NullType } from 'dtos/NullType';
import { ColumnTransformationMetadata } from 'components/Diagrams/Drawers/MappingsDrawer/ColumnTransformationMetadata';

export interface IColumnMappingsProps extends React.HTMLAttributes<HTMLElement> {
  tableModel: TableModel[];
  onSelectSource: (columnMapping: ColumnTransformationMetadata) => void;
}

export default function ColumnMappings(props: IColumnMappingsProps) {
  const [searchBarValue, setSearchBarValue] = useState('');
  const handleChange = (header: string, item: string | undefined) => {
    if (!header || !item) return;

    const sourceTableModel = props.tableModel.find((model) => model.object === header);
    const sourceTable = sourceTableModel
      ? { alias: sourceTableModel?.alias, object: sourceTableModel?.object }
      : { alias: '', object: '' };
    const sourceColumn = sourceTableModel?.columns.find((column) => column.columnName == item);
    const columnMapping: ColumnTransformationMetadata = {
      transformation: `${sourceTable.alias}.${item}`,
      columnType: sourceColumn?.type,
      columns: [
        {
          columnName: item,
          object: sourceColumn?.object ?? NullType,
        },
      ],
    };
    props.onSelectSource(columnMapping);
  };

  const onChangeSearchBar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value ?? '';
    setSearchBarValue(newValue.toLowerCase());
  };

  return (
    <Box className={styles.container} data-testid="column-mappings">
      <SearchBar onChange={onChangeSearchBar} className={styles.searchMapping}></SearchBar>

      <Box className={styles.listContainer}>
        <List filter={searchBarValue} elements={props.tableModel} onClickAccordion={handleChange}></List>
      </Box>
    </Box>
  );
}
