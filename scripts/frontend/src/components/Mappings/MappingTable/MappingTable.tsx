import { Subtitle1, Subtitle2 } from 'components/common/Text/TextComponents';
import styles from './MappingTable.module.scss';
import { Box, Stack, SvgIcon } from '@mui/material';
import SearchBar from 'components/SearchBar/SearchBar';
import MappingRow from './MappingRow';
import { useTranslation } from 'locales/i18n';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import AddTransformationSetButton from '../AddTransformationSet/AddTransformationSetButton';
import { Button } from 'components/common/Button/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useMemo, useEffect } from 'react';
import { ColumnRelation, TableModel } from 'dtos/ModelUI';
import { getTargetTablesInModelUI } from 'utils/MappingModel/ModelUIHelpers';
import Spinner from 'components/common/Spinner/Spinner';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useNavigate, useParams } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';
import MappingTableDeleteDialog from './MappingTableDeleteDialog';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { IMappingService } from 'interfaces/IMappingService';
import { ProcessStatus } from 'dtos/ProcessStatus';
import { ReactComponent as DateTime } from 'assets/icons/DateTime.svg';
import TargetLagModal from 'components/TargetLag/TargetLagModal';
import { IPubSubService } from 'interfaces/IPubSubService';
import { EventData } from 'dtos/EventData';
import Tooltip from 'components/Tooltip/Tooltip';

interface IMappingTableProps {
  onClickCreateSet: () => void;
}

let targetTableObjectToDelete = '';
let targetTableToSetLag: TableModel;

export default function MappingTable({ onClickCreateSet }: IMappingTableProps) {
  const { t } = useTranslation('common');
  const { modelId } = useParams();
  const { model, saving, modelLoading, sourceLoading, sourceDatabaseSchema } = useMappingContext();
  const [filterValue, setFilterValue] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [processState, setProcessState] = useState<ProcessStatus[]>([]);
  const [selectedMap, setSelectedMap] = useState<ColumnRelation | undefined>(undefined);
  const [openTargetLag, setOpenTargetLag] = useState(false);
  const navigate = useNavigate();
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);
  const mappingService = container.get<IMappingService>(TYPES.IMappingService);

  useEffect(() => {
    if (modelId) {
      mappingService.getProcessStatus(modelId).then((status) => {
        setProcessState(status);
      });
    }
    return () => {
      pubSubService.unsubscribeFromEvent(EventData.Sidebar.Select, 'sidebar');
    };
  }, []);

  const onChangeSearchBar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value.toLowerCase());
  };

  const onClickEdit = (table: TableModel) => (): void => {
    if (!table) return;
    navigate(PathConstants.EDIT, { state: { selectedTableName: table.object } });
  };

  const toggleDeleteModel = () => setOpenDelete((prev) => !prev);

  const validateDeleteTargetTable = (table: TableModel) => async (): Promise<void> => {
    targetTableObjectToDelete = table.object;
    toggleDeleteModel();
  };

  const mappingStatus = (tableName: string) => {
    if (processState.length > 0) {
      const tableStatus = processState.find((status) => status.PROCESS_NAME === tableName);
      if (tableStatus && tableStatus.STATUS === 'FAILED') {
        return true;
      }
    }
    return false;
  };

  const handleSideBarSelect = (data: any) => {
    memoTargetTables.forEach((table) => {
      table.mappings?.forEach((map) => {
        if (data.selected.sidebar.toLowerCase().includes('source')) {
          map.sources.forEach((source) => {
            if (source.object === data.selected.object && source.columnName === data.selected.columnName) {
              setSelectedMap(map);
              pubSubService.emitEvent(EventData.Model.Select, { selected: map });
            }
          });
        } else {
          if (map.target.object === data.selected.object && map.target.columnName === data.selected.columnName) {
            setSelectedMap(map);
            pubSubService.emitEvent(EventData.Model.Select, { selected: map });
          }
        }
      });
    });
  };

  const memoTargetTables = useMemo(() => {
    if (!model || !sourceDatabaseSchema) return [];
    const targetTables: TableModel[] = [];
    getTargetTablesInModelUI(model).forEach((table) => {
      const mappingsFiltered =
        table.mappings?.filter((map) =>
          map.sources?.some(
            (s) =>
              s.object.startsWith(sourceDatabaseSchema) &&
              (map.target.columnName.toLowerCase().includes(filterValue) ||
                s.columnName.toLowerCase().includes(filterValue))
          )
        ) ?? [];
      const isTableIncluded = table.tableName.toLowerCase().includes(filterValue);
      if (isTableIncluded || mappingsFiltered.length > 0) {
        targetTables.push({
          ...table,
          mappings: mappingsFiltered,
        });
      }
    });
    pubSubService.subscribeToEvent(EventData.Sidebar.Select, 'sidebar', handleSideBarSelect);
    return targetTables;
  }, [filterValue, model, sourceDatabaseSchema, sourceLoading]);

  const onClickTargetLag = (table: TableModel) => (): void => {
    if (!table) return;
    targetTableToSetLag = table;
    setOpenTargetLag(true);
  };

  return (
    <>
      <Spinner loading={modelLoading} label={t('Loading')}>
        <Box className={styles.container}>
          <Box className={styles.header}>
            <Subtitle1 className={styles.title}>{t('MappingsTableHeader')}</Subtitle1>
            <Box className={styles.subHeader}>
              <SearchBar onChange={onChangeSearchBar} />
              <AddTransformationSetButton onClick={onClickCreateSet} />
            </Box>
          </Box>
          <Box className={styles.content}>
            {memoTargetTables.map((table, index) => (
              <Box key={`mt-${index}`} className={styles.tableContainer}>
                <Stack className={styles.targetHeader} direction="row">
                  <Subtitle2>{table.tableName}</Subtitle2>
                  {mappingStatus(table.tableName) && (
                    <Tooltip title={t('TargetTableCreationError')} placement="right">
                      <Box className={styles.errorMessage}>
                        <ErrorOutlineIcon />
                        <Subtitle2 className={styles.text}>{t('TargetTableCreationError')}</Subtitle2>
                      </Box>
                    </Tooltip>
                  )}
                  <Stack direction="row" spacing={2} className={styles.buttonsContainer}>
                    <Button
                      className={styles.deleteButton}
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={validateDeleteTargetTable(table)}
                    >
                      {t('Delete')}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SvgIcon component={DateTime} fontSize="small" />}
                      onClick={onClickTargetLag(table)}
                    >
                      {t('TargetLag')}
                    </Button>
                    <Button
                      className={styles.editButton}
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={onClickEdit(table)}
                    >
                      {t('Edit')}
                    </Button>
                  </Stack>
                </Stack>
                <Box className={styles.subTitlesContainer}>
                  <Subtitle2>{t('MappingsTableSourceHeader')}</Subtitle2>
                  <Box className={styles.filler} />
                  <Subtitle2>{t('MappingsTableTargetHeader')}</Subtitle2>
                </Box>
                {table.mappings?.map((map, index) => (
                  <MappingRow
                    key={`mr-${index}`}
                    isActive={selectedMap === map}
                    map={map}
                    selectItemHandler={setSelectedMap}
                  />
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Spinner>
      <MappingTableDeleteDialog
        openDelete={openDelete}
        toggleDeleteModel={toggleDeleteModel}
        targetTableObjectToDelete={targetTableObjectToDelete}
        saving={saving}
      />
      <TargetLagModal openModal={openTargetLag} table={targetTableToSetLag} setOpen={setOpenTargetLag} />
    </>
  );
}
