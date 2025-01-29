import styles from './Rows.module.scss';
import { Body1 } from 'components/common/Text/TextComponents';
import theme from 'styles/theme';
import { RowProps } from './Row';
import { Box } from '@mui/material';
import ColumnTypeIcon from 'components/ColumnTypeIcon/ColumnTypeIcon';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';

interface Props extends RowProps {}

export default function SimpleRow(props: Props) {
  const { selectedColumn, setColumnToEdit, setSelectedColumn } = useEditMappingContext();

  const handleEnterEditMode = () => {
    setColumnToEdit(props.column);
  };

  const handleEnterSelectionMode = () => {
    setColumnToEdit(undefined);
    setSelectedColumn(props.column);
  };

  const handleOnClick = () => {
    const isInEditingMode = selectedColumn == props.column;
    if (isInEditingMode) {
      handleEnterEditMode();
    } else {
      handleEnterSelectionMode();
    }
  };

  const handleOnDoubleClick = () => {
    handleEnterEditMode();
  };

  const handleOnIconTypeClick = () => {
    handleEnterEditMode();
  };

  return (
    <Box 
      className={`${styles.row} ${selectedColumn == props.column ? styles.highlighted : ''}`}
      onClick={handleOnClick} 
      onDoubleClick={handleOnDoubleClick}
    >
      <Body1 className={styles.text} color={theme.palette.text.secondary}>
        {props.column.columnName}
      </Body1>

      <div className={styles.iconContainer} row-type={props.column.type} onClick={handleOnIconTypeClick}>
        <ColumnTypeIcon type={props.column.type} />
      </div>
    </Box>
  );
}
