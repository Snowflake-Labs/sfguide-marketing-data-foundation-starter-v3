import { Box } from '@mui/material';
import styles from './TargetTableDrawer.module.scss';
import { Subtitle2 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import SearchBar from 'components/SearchBar/SearchBar';
import SelectableList from './SelectableList';
import { Button } from 'components/common/Button/Button';
import AddIcon from '@mui/icons-material/Add';
import CustomDrawer from 'components/CustomDrawer/CustomDrawer';
import { TableModel } from 'dtos/ModelUI';
import { useNavigate } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';

export interface Props {
  label: string;
  open: boolean;
  setStatus: (status: boolean) => void;
  tables: TableModel[];
}

export default function TargetTableDrawer({ label, open, setStatus, tables }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const closeTargetTableDrawer = () => {
    setStatus(false);
  };
  const onCreateTargetTable = () => {
    navigate(`${PathConstants.EDIT}/${PathConstants.NEWTABLE}`);
    closeTargetTableDrawer();
  };

  const onDrawerSelectTargetTable = (table: TableModel | undefined) => {
    if (table) {
      closeTargetTableDrawer();
      navigate(PathConstants.EDIT, { state: { selectedTableName: table.object } });
    }
  };

  return (
    <CustomDrawer
      label={t(label)}
      open={open}
      toggleDrawer={closeTargetTableDrawer}
      footer={
        <Button sx={{ border: 1, margin: '24px' }} variant="outlined" onClick={closeTargetTableDrawer}>
          <Subtitle2>{t('BtnCancel')}</Subtitle2>
        </Button>
      }
    >
      <Box className={styles.container}>
        <Box className={styles.headerContainer}>
          <SearchBar />
          <Button variant="outlined" className={styles.buttonCreateTable} onClick={onCreateTargetTable}>
            <AddIcon />
            <Subtitle2>{t('btnCreateTargetTable')}</Subtitle2>
          </Button>
        </Box>
        <Box className={styles.contentContainer}>
          <Box className={styles.selectContainer}>
            <SelectableList items={tables} handleClick={onDrawerSelectTargetTable} />
          </Box>
        </Box>
      </Box>
    </CustomDrawer>
  );
}
