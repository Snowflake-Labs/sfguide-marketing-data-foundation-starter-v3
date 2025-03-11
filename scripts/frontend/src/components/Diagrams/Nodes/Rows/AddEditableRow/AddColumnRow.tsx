import styles from './AddColumnRow.module.scss';
import AddIcon from '@mui/icons-material/Add';
import { Subtitle2 } from 'components/common/Text/TextComponents';
import { TableModel } from 'dtos/ModelUI';
import { useTranslation } from 'locales/i18n';
import EditActions from './EditActions';
import { Box } from '@mui/material';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';

interface Props {
  table: TableModel;
}

export default function AddColumnRow(props: Props) {
  const { t } = useTranslation('common');
  const { columnToEdit, setSelectedColumn, setColumnToEdit, addColumnDefault } = useEditMappingContext();
  const handleEnterEditMode = () => {
    setSelectedColumn(undefined);
    setColumnToEdit(addColumnDefault);
  };
  const isEditingCurrentColumn = columnToEdit?.object === addColumnDefault.object;
  return (
    <Box className={styles.row} onClick={handleEnterEditMode}>
      {isEditingCurrentColumn ? (
        <EditActions isNewColumn column={addColumnDefault} id={''} handlerType={'target'} table={props.table} />
      ) : (
        <Box className={styles.addContainer}>
          <AddIcon className={styles.add_icon} />
          <Subtitle2>{t('AddColumn')}</Subtitle2>
        </Box>
      )}
    </Box>
  );
}
