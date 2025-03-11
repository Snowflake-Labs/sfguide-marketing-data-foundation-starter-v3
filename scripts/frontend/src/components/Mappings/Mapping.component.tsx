import styles from './Mapping.module.scss';
import Sidebar from './Sidebar/Sidebar';
import { Box, Stack } from '@mui/material';
import MappingTable from './MappingTable/MappingTable';
import { Body2, Subtitle2 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import TargetTableDrawer from 'components/Diagrams/Drawers/TargetTableDrawer/TargetTableDrawer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';
import Tooltip from 'components/Tooltip/Tooltip';

interface Props {
  onEdit?: () => void;
}

export default function MappingComponent(props: Props) {
  const { t } = useTranslation('common');
  const { model, sources, targetDatabaseSchema, sourceDatabaseSchema, sourceLoading, modelLoading, targetTables } =
    useMappingContext();
  const navigate = useNavigate();

  const [targetTableDrawerStatus, setTargetTableDrawerStatus] = useState(false);

  const handleCreateSet = () => {
    if (targetTables.length === 0) {
      handleAddTable();
    }
    else setTargetTableDrawerStatus(true);
  };

  const handleAddTable = () => {
    navigate(`${PathConstants.EDIT}/${PathConstants.NEWTABLE}`);
  };

  return (
    <Stack spacing={3} className={styles.container}>
      <Box className={styles.headerContainer}>
        <Tooltip title={sourceDatabaseSchema} placement="right">
          <Box className={styles.header}>
            <Subtitle2 className={styles.label}>{t('SourceDatabaseAndSchema')}</Subtitle2>{' '}
            <Body2 className={styles.headerDbSch}>{sourceDatabaseSchema}</Body2>
          </Box>
        </Tooltip>
        <Tooltip title={targetDatabaseSchema} placement="right">
          <Box className={styles.header}>
            <Subtitle2 className={styles.label}>{t('TargetDatabaseAndSchema')}</Subtitle2>{' '}
            <Body2 className={styles.headerDbSch}>{targetDatabaseSchema}</Body2>
          </Box>
        </Tooltip>
      </Box>

      {/* Mapping component */}
      <Box className={styles.mappingContainer}>
        <Sidebar
          orientation={'left'}
          label={t('MappingSidebarSource')}
          elements={sources}
          isLoading={sourceLoading}
          disableMappings={true}
        />
        <TargetTableDrawer
          setStatus={setTargetTableDrawerStatus}
          open={targetTableDrawerStatus}
          label="SelectTargetTable"
          tables={targetTables}
        />
        <MappingTable onClickCreateSet={handleCreateSet} />
        <Sidebar
          orientation={'right'}
          label={t('MappingSidebarTarget')}
          elements={targetTables}
          onAddTable={handleAddTable}
          isLoading={modelLoading}
        />
      </Box>
    </Stack>
  );
}
