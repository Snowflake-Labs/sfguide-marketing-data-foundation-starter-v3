import styles from './Rows.module.scss';
import { ListItem } from '@mui/material';
import { useDiagramContext } from 'components/Diagrams/DiagramContext';
import { ColumnModel, TableModel } from 'dtos/ModelUI';
import { EventData } from 'dtos/EventData';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { HtmlHTMLAttributes, useEffect, useMemo, useState } from 'react';
import { HandleType, Handle, Position, Connection } from 'reactflow';
import EditActions from './AddEditableRow/EditActions';
import SimpleRow from './SimpleRow';
import EastIcon from '@mui/icons-material/East';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';

export interface RowProps extends HtmlHTMLAttributes<HTMLElement> {
  id: string;
  handlerType: HandleType;
  table: TableModel;
  column: ColumnModel;
}

export default function Row(props: RowProps) {
  const { id, handlerType } = props;
  const { edges, setEdges } = useDiagramContext();
  const { target, columnToEdit } = useEditMappingContext();

  const [isEditing, setIsEditing] = useState(false);
  const [connection, setConnection] = useState<Connection>();

  const position = { source: Position.Right, target: Position.Left, static: Position.Right, variable: Position.Right }[
    handlerType
  ];

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const isConnectable: boolean = useMemo(() => {
    const isTargetValid = edges.filter((edge) => edge.targetHandle === id).length === 0;
    return handlerType === 'source' || isTargetValid;
  }, [edges]);

  const isConnected: boolean = useMemo(
    () =>
      props.table.mappings?.some(
        (m) => m.target.object === target?.object && m.sources?.some((s) => s.columnName === props.column.columnName)
      ) ?? false,
    [target, props.table, props.column]
  );

  const handleStyles = useMemo(
    () => `${styles.handle} ${styles[props.table.type]} ${isConnected ? styles.connected : ''}`,
    [props.table, isConnected]
  );

  const handleOnConnect = (connection: Connection) => {
    setConnection(connection);
    pubSubService.emitEvent(EventData.Diagram.Edge.PreAdd, connection);
  };

  const handleOnConnectionCancel = () => {
    const filteredEdges = edges.filter(
      (edge) => edge.sourceHandle !== connection?.sourceHandle || edge.targetHandle !== connection?.targetHandle
    );
    setEdges(filteredEdges);
  };

  const handleOnExitEditMode = () => setIsEditing(false);

  useEffect(() => {
    if (!connection) return;
    pubSubService.subscribeToEvent(EventData.Drawer.Mapping.Cancel, 'row', handleOnConnectionCancel);
  }, [connection]);

  useEffect(() => {
    const isEditingCurrentColumn = columnToEdit === props.column && props.table.type === 'target';
    if (!isEditingCurrentColumn) return;
    setIsEditing(true);
  }, [columnToEdit]);

  return (
    <ListItem className={styles.rowContainer}>
      {isEditing ? <EditActions {...props} onExitEditMode={handleOnExitEditMode} /> : <SimpleRow {...props} />}
      <Handle
        id={id}
        type={handlerType}
        position={position}
        className={handleStyles}
        isConnectable={isConnectable}
        onConnect={handleOnConnect}
        children={<EastIcon className={styles.handleIcon} />}
      />
    </ListItem>
  );
}
