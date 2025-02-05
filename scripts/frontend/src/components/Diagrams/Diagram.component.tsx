import styles from './Diagram.module.scss';
import { Box, Button, MenuItem, SvgIcon, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import 'reactflow/dist/style.css';
import { MappingNode, NodeTypes } from './Nodes/NodeTypes';
import { getTableModelFromDropEvent } from './Helpers';
import { useDiagramContext } from './DiagramContext';
import { ReactComponent as DiagramHelp } from 'assets/icons/DiagramHelp.svg';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  ReactFlowInstance,
  addEdge,
} from 'reactflow';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { EventData } from 'dtos/EventData';
import { IPubSubService } from 'interfaces/IPubSubService';
import { EdgeTypes, MappingEdge } from './Edges/EdgeTypes';
import MappingTableDeleteDialog from 'components/Mappings/MappingTable/MappingTableDeleteDialog';
import { removeTableFromMappingModel } from 'utils/MappingModel/ModelUIHelpers';
import { TableModel } from 'dtos/ModelUI';
import { useNavigate } from 'react-router-dom';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';
import { DeleteTransformationModal } from './Modals/DeleteTransformationModal/DeleteTransformationModal';
import { saveNodePosition } from './Layout';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Subtitle2 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Spinner from 'components/common/Spinner/Spinner';
import { DiagramClickEvent, DiagramEdgeClickEvent, DiagramNodeClickEvent } from 'dtos/DiagramEvent';

interface Props {
  onDrop?: (node: MappingNode, event: DropEvent) => void;
  onEdgeDoubleClick?: (event: React.MouseEvent, edge: MappingEdge) => void;
}

export enum DropEvent {
  None,
  Join,
  Transformation,
}
let targetTableObjectToDelete = '';

export default function DiagramComponent(props: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { model, sources, saving, sourceLoading } = useMappingContext();
  const { target, setSelectedColumn, setColumnToEdit } = useEditMappingContext();
  const { nodes, edges, setNodes, onNodesChange, setEdges, onEdgesChange, setGhostNode } = useDiagramContext();

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const [openDelete, setOpenDelete] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const popupOpen = Boolean(anchor);
  const id = popupOpen ? 'simple-popper' : undefined;

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onInit = (rfi: ReactFlowInstance) => setReactFlowInstance(rfi);
  const nodeClassName = (node: MappingNode) => styles[`mini-map-${node.type}`];

  const handleOnDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  };

  const handleOnDrop = (event: React.DragEvent) => {
    event.preventDefault();
    document.getElementById('drag-ghost')?.remove();
    const { table, nodeType } = getTableModelFromDropEvent(event, sources, model);

    if (!table || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const isAlreadyAdded = nodes.find((node) => node.id === table.object);
    const isFirstSourceNode = !nodes.some((node) => node.type === 'source');
    const isGhostNode = !isAlreadyAdded;
    const newNode: MappingNode = {
      id: table.object,
      type: isGhostNode ? `ghost-${nodeType}` : nodeType,
      position: position,
      data: { table: table },
    };

    setNodes((nds) => nds.concat(newNode));
    saveNodePosition(table.object, target?.object ?? '', position);

    if (isGhostNode) {
      setGhostNode(newNode);
      pubSubService.emitEvent(EventData.Diagram.TemporaryNode.Add, { table: table, node: newNode });
    }

    let eventType = DropEvent.None;
    if (isFirstSourceNode) {
      eventType = DropEvent.Transformation;
      pubSubService.subscribeToEvent(EventData.Drawer.Mapping.Cancel, 'diagram', () => handleTempNodeCancel(newNode));
      pubSubService.subscribeToEvent(EventData.Drawer.Mapping.Save, 'diagram', () => handleTempNodeSave(newNode));
    } else if (!isAlreadyAdded) {
      eventType = DropEvent.Join;
      pubSubService.subscribeToEvent(EventData.Drawer.Join.Cancel, 'diagram', () => handleTempNodeCancel(newNode));
      pubSubService.subscribeToEvent(EventData.Drawer.Join.Save, 'diagram', () => handleTempNodeSave(newNode));
    }
    props.onDrop?.(newNode, eventType);
  };

  const toggleDeleteModel = () => setOpenDelete((prev) => !prev);

  const handleTempNodeSave = (ghostNode: MappingNode) => {
    const newNode: MappingNode = { ...ghostNode, type: ghostNode.type?.replace('ghost-', '') };
    pubSubService.emitEvent(EventData.Diagram.Node.Add, { table: newNode.data.table });
    setGhostNode(undefined);
    cleanDrawerEvents();
  };

  const handleTempNodeCancel = (ghostNode: MappingNode) => {
    pubSubService.emitEvent(EventData.Diagram.TemporaryNode.Remove, { tableId: ghostNode.id });
    setGhostNode(undefined);
    cleanDrawerEvents();
  };

  const cleanDrawerEvents = () => {
    pubSubService.unsubscribeFromEvent(EventData.Drawer.Mapping.Save, 'diagram');
    pubSubService.unsubscribeFromEvent(EventData.Drawer.Join.Save, 'diagram');
    pubSubService.unsubscribeFromEvent(EventData.Drawer.Mapping.Cancel, 'diagram');
    pubSubService.unsubscribeFromEvent(EventData.Drawer.Join.Cancel, 'diagram');
  };

  const handleDiagramClick = (object: string) => {
    const event: DiagramClickEvent = { object: object };
    pubSubService.emitEvent(EventData.Diagram.Click, event);
    setAnchor(null);
  };

  const handleOnEdgeClick = (_: React.MouseEvent, edge: MappingEdge) => {
    const event: DiagramEdgeClickEvent = { edge: edge };
    pubSubService.emitEvent(EventData.Diagram.Edge.Click, event);
    setSelectedColumn(undefined);
    setColumnToEdit(undefined);
    handleDiagramClick(edge.id);
  };

  const handleOnPanelClick = (_: React.MouseEvent) => {
    pubSubService.emitEvent(EventData.Diagram.Panel.Click);
    handleDiagramClick('');
  };

  const handleOnNodeClick = (_: React.MouseEvent, node: MappingNode) => {
    const event: DiagramNodeClickEvent = { node: node };
    pubSubService.emitEvent(EventData.Diagram.Click, event);
    handleDiagramClick(node.id);
  };

  const handleOnEdgeDoubleClick = (e: React.MouseEvent, edge: MappingEdge) => {
    props.onEdgeDoubleClick?.(e, edge);
  };

  const handleNodeMoved = (_: React.MouseEvent, node: MappingNode) => {
    saveNodePosition(node.id, target?.object ?? '', node.position);
  };

  const openDeleteModel = (tableName: string) => async (): Promise<void> => {
    targetTableObjectToDelete = tableName;
    toggleDeleteModel();
  };

  const onClickDelete = async (): Promise<void> => {
    pubSubService.emitEvent(EventData.Model.Save, removeTableFromMappingModel(model, targetTableObjectToDelete));
    pubSubService.subscribeToEvent(EventData.Model.AfterSave, 'delete-target-table-modal', handleSaveResponse);
  };

  const handleSaveResponse = ({ success }: { success: boolean }) => {
    if (success) {
      toggleDeleteModel();
      navigate('..');
    }
  };

  const onButtonHelpClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : e.currentTarget);
  };

  const fitViewOnTargetChange = () => {
    if (!reactFlowInstance) return;
    reactFlowInstance.fitView();
    const minZoom = 0.7;
    const zoom = reactFlowInstance.getZoom();
    if (zoom > minZoom) reactFlowInstance.zoomTo(minZoom);
    pubSubService.unsubscribeFromEvent(EventData.Diagram.Panel.FitView, 'diagram');
  };

  useEffect(() => {
    pubSubService.subscribeToEvent(EventData.Diagram.Panel.FitView, 'diagram', fitViewOnTargetChange);
  }, [target]);

  useEffect(() => {
    setTimeout(() => pubSubService.emitEvent(EventData.Diagram.Panel.FitView), 100);
  }, [nodes]);

  useEffect(() => {
    pubSubService.subscribeToEvent(EventData.Diagram.Node.DeleteTarget, 'diagram', (targetTable: TableModel) =>
      openDeleteModel(targetTable.object)
    );
  }, [model]);

  return (
    <Box className={styles.container}>
      {
        <Spinner loading={sourceLoading}>
          <ReactFlow
            disableKeyboardA11y
            minZoom={-1}
            nodeTypes={NodeTypes}
            edgeTypes={EdgeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={handleOnDrop}
            onDragOver={handleOnDragOver}
            onNodeDragStop={handleNodeMoved}
            onPaneClick={handleOnPanelClick}
            onEdgeClick={handleOnEdgeClick}
            onEdgeDoubleClick={handleOnEdgeDoubleClick}
            onNodeClick={handleOnNodeClick}
          >
            <MiniMap zoomable pannable nodeClassName={nodeClassName} />
            <Controls />
            <Background color={theme.palette.secondary.main} variant={BackgroundVariant.Dots} />
            <Button className={styles.buttonHelp} onClick={onButtonHelpClick}>
              <SvgIcon viewBox="0 0 20 20" component={DiagramHelp} fontSize="small" />
            </Button>
            <BasePopup id={id} open={popupOpen} anchor={anchor} placement="top-start">
              <Box className={styles.popupBox}>
                <Subtitle2>{t('Legend')}</Subtitle2>
                <MenuItem className={styles.SourceTablesLegend}>{t('SourceTables')}</MenuItem>
                <MenuItem className={styles.TargetTablesLegend}>{t('TargetTables')}</MenuItem>
                <MenuItem className={styles.VariableValuesLegend}>{t('VariableValues')}</MenuItem>
                <MenuItem className={styles.StaticValuesLegend}>{t('StaticValues')}</MenuItem>
                <MenuItem className={styles.FormulaNodesLegend}>
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$fx$ ${t('FormulaNodes')}`}
                  </Markdown>
                </MenuItem>
              </Box>
            </BasePopup>
          </ReactFlow>

          <MappingTableDeleteDialog
            openDelete={openDelete}
            toggleDeleteModel={toggleDeleteModel}
            targetTableObjectToDelete={targetTableObjectToDelete}
            saving={saving}
            onClickDelete={onClickDelete}
          />
          <DeleteTransformationModal open={false} />
        </Spinner>
      }
    </Box>
  );
}
