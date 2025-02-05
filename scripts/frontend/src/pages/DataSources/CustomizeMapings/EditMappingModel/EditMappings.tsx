import styles from './EditMappings.module.scss';
import { Box, Button, IconButton } from '@mui/material';
import DiagramComponent, { DropEvent } from 'components/Diagrams/Diagram.component';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import Sidebar from 'components/Mappings/Sidebar/Sidebar';
import SearchBar from 'components/SearchBar/SearchBar';
import Spinner from 'components/common/Spinner/Spinner';
import { ColumnRelation, MappingType, TableModel } from 'dtos/ModelUI';
import { useTranslation } from 'locales/i18n';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';
import { DiagramContextWrapper } from 'components/Diagrams/DiagramContext';
import { H6 } from 'components/common/Text/TextComponents';
import EditMappingsFooter from './EditMappingsFooter';
import JoinDrawer from 'components/Diagrams/Drawers/JoinDrawer/JoinDrawer';
import { useEffect, useState } from 'react';
import { MappingNode } from 'components/Diagrams/Nodes/NodeTypes';
import AddButton from 'components/AddButton/AddButton';
import MappingsDrawer from 'components/Diagrams/Drawers/MappingsDrawer/MappingsDrawer';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { EventData } from 'dtos/EventData';
import { Connection } from 'reactflow';
import {
  findColumnRelationOfTargetInModelUI,
  findTableObjectInModelUI,
  getTargetTablesInModelUI,
} from 'utils/MappingModel/ModelUIHelpers';
import { MappingEdge } from 'components/Diagrams/Edges/EdgeTypes';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import { PathConstants } from 'routes/pathConstants';
import { useLocation, useNavigate } from 'react-router-dom';
import { addAliasToTable } from './Helpers';
import Tooltip from 'components/Tooltip/Tooltip';

export default function EditMappingsPage() {
  const { t } = useTranslation('common');
  const {
    model,
    modelLoading,
    sourceLoading,
    overlapSpinner,
    sources: allSources,
    setModelLoading,
    setOverlapSpinner,
  } = useMappingContext();
  const { target, selectTargetObject, sources } = useEditMappingContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [openJoinDrawer, setOpenJoinDrawer] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const [openMappingsDrawer, setOpenMappingsDrawer] = useState(false);
  const [selectedTempTable, setSelectedTempTable] = useState<TableModel>();
  const [selectedTargetTable, setSelectedTargetTable] = useState<TableModel>();
  const [newTransformation, setNewTransformation] = useState<ColumnRelation>();
  const [previewColumns, setPreviewColumns] = useState<GridColDef[]>([]);
  const [previewRows, setPreviewRows] = useState<GridRowsProp>([]);
  const targetElements = getTargetTablesInModelUI(model);
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);
  const handleOnChangeTarget = (table: string, column?: string) => {
    const target = targetElements.find((targetTable) => targetTable.object == table);
    selectTargetObject(target?.object ?? '', column ?? '');
  };

  const handleOnDropTable = (node: MappingNode, event: DropEvent) => {
    const sourceTable = addAliasToTable(model, node.data?.table);
    setSelectedTempTable(sourceTable);
    switch (event) {
      case DropEvent.Join:
        handleSetOpenJoinDrawer(true);
        break;
      case DropEvent.Transformation:
        handleSetOpenMappingsDrawer(true);
        break;
    }
  };

  const handleSetOpenJoinDrawer = (value: boolean) => {
    setOpenJoinDrawer(value);
    if (!value) {
      setSelectedTempTable(undefined);
      setSelectedTargetTable(undefined);
    }
  };

  const handleSetOpenMappingsDrawer = (value: boolean) => {
    setOpenMappingsDrawer(value);
    if (!value) setSelectedTempTable(undefined);
  };

  const handleOnDrawEdge = (connection: Connection) => {
    if (!connection.source || !connection.sourceHandle || !connection.target || !connection.targetHandle) return null;
    const alias = findTableObjectInModelUI(connection.source, model)?.alias;
    const sourceColumnName = connection.sourceHandle.split('.')[3];
    const targetColumnName = connection.targetHandle.split('.')[3];
    const transformation: ColumnRelation = {
      sources: [{ columnName: sourceColumnName, object: connection.source }],
      target: { columnName: targetColumnName, object: connection.target },
      type: MappingType.Column,
      mapping: `${alias}.${sourceColumnName}`,
    };
    setNewTransformation(transformation);
    setOpenMappingsDrawer(true);
  };

  const handleOnEdgeDoubleClick = (_: React.MouseEvent, edge: MappingEdge) => {
    const sourceTable = findTableObjectInModelUI(edge.source, model);
    const targetTable = findTableObjectInModelUI(edge.target, model);
    setSelectedTempTable(sourceTable);
    setSelectedTargetTable(targetTable);
    if (edge.type === 'join-edge') {
      handleSetOpenJoinDrawer(true);
    } else {
      openDrawerWithEdgeInfo(edge);
    }
  };

  const openDrawerWithEdgeInfo = (edge: MappingEdge & { sourceHandleId?: string; targetHandleId?: string }) => {
    const sourceHandle = edge.sourceHandleId ?? edge.sourceHandle;
    const targetHandle = edge.targetHandleId ?? edge.targetHandle;

    if (!edge.source || !edge.target || !sourceHandle || !targetHandle) return;
    const targetColumnName = targetHandle.split('.')[3];
    const transformation: ColumnRelation | undefined = findColumnRelationOfTargetInModelUI(model, {
      columnName: targetColumnName,
      object: edge.target,
    });
    if (!transformation) return;
    setNewTransformation({ ...transformation });
    setOpenMappingsDrawer(true);
  };

  const handleOnAddTransformation = () => {
    setOpenMappingsDrawer(true);
  };
  const getSources = () => {
    const allSources = [...sources];
    if (selectedTempTable) allSources.push(selectedTempTable);
    return allSources;
  };

  const HasTargetColumns = () => {
    return target && target.columns.length > 0;
  };

  useEffect(() => {
    pubSubService.subscribeToEvent(EventData.Diagram.Node.ShowPreview, 'show-preview', openPreviewHandler);

    return () => {
      pubSubService.unsubscribeFromEvent(EventData.Diagram.Node.ShowPreview, 'show-preview');
    };
  }, []);

  useEffect(() => {
    pubSubService.subscribeToEvent(EventData.Diagram.Edge.PreAdd, 'edit-mappings-page', handleOnDrawEdge);
    pubSubService.subscribeToEvent(EventData.Diagram.OpenDrawer, 'open-drawer', openDrawerWithEdgeInfo);

    return () => {
      pubSubService.unsubscribeFromEvent(EventData.Diagram.Edge.PreAdd, 'edit-mappings-page');
      pubSubService.unsubscribeFromEvent(EventData.Diagram.OpenDrawer, 'open-drawer');
    };
  }, [model]);

  const openPreviewHandler = (args: any) => {
    let columns = args.table.columns.map((column: any) => ({
      field: column.columnName,
      headerName: column.columnName,
      flex: 1,
      minWidth: 150,
    }));
    setPreviewColumns(columns);
    let rows = args.data.data.map((row: any, rowIndex: number) => {
      const newRow: any = {};
      newRow['id'] = rowIndex;
      columns.forEach((column: any, idx: number) => {
        newRow[column.field] = row[idx];
      });
      return newRow;
    });
    setPreviewRows(rows);
    setOpenPreview(true);
    setModelLoading(false);
    setOverlapSpinner(false);
  };

  const hidePreview = () => {
    setOpenPreview(false);
  };

  const handleAddTable = () => {
    const isAlreadyNew = location.pathname.includes(PathConstants.NEWTABLE);
    const pathTo = isAlreadyNew ? '' : PathConstants.NEWTABLE;
    navigate(pathTo);
  };

  return (
    <Box className={styles.container}>
      <H6>{t('AdvancedEditorHeader')}</H6>
      <Spinner loading={modelLoading} overlap={overlapSpinner}>
        <DiagramContextWrapper>
          <Box className={styles.actionsContainer}>
            <SearchBar />
            <AddButton variant="outlined" onClick={handleOnAddTransformation} disabled={!HasTargetColumns()}>
              {t('AddTransformation')}
            </AddButton>
          </Box>
          <Box className={styles.diagramContainer}>
            <Sidebar
              label={t('MappingSidebarSource')}
              orientation={'left'}
              elements={allSources}
              draggable
              isLoading={sourceLoading}
            />
            <DiagramComponent onDrop={handleOnDropTable} onEdgeDoubleClick={handleOnEdgeDoubleClick} />
            <Sidebar
              label={t('MappingSidebarTarget')}
              orientation={'right'}
              elements={targetElements}
              onClickElement={handleOnChangeTarget}
              onAddTable={handleAddTable}
              isLoading={modelLoading}
            />
          </Box>
        </DiagramContextWrapper>
      </Spinner>
      {openPreview && (
        <Box className={styles.previewBox}>
          <Box className={styles.previewContent}>
            <IconButton className={styles.closePreview} onClick={hidePreview}>
              <Tooltip title={t('CloseDataPreviewTooltip')} children={<CloseIcon />} />
            </IconButton>
            <div className={styles.gridContainer}>
              <DataGrid
                rows={previewRows}
                columns={previewColumns}
                autosizeOptions={{
                  includeHeaders: true,
                  includeOutliers: true,
                  expand: true,
                }}
              />
            </div>
          </Box>
        </Box>
      )}
      <EditMappingsFooter />
      <JoinDrawer
        tablesOptions={sources}
        open={openJoinDrawer}
        setOpen={handleSetOpenJoinDrawer}
        defaultFromTable={selectedTempTable}
        defaultToTable={selectedTargetTable}
      />
      {target && (
        <MappingsDrawer
          sources={getSources()}
          targetTable={target}
          defaultMapping={newTransformation}
          open={openMappingsDrawer}
          setOpen={handleSetOpenMappingsDrawer}
        />
      )}
    </Box>
  );
}
