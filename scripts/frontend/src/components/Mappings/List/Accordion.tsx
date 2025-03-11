import styles from './List.module.scss';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, ListSubheader, ListItemButton, Collapse } from '@mui/material';
import { Subtitle2 } from 'components/common/Text/TextComponents';
import { EventData } from 'dtos/EventData';
import { DragEvent, HTMLAttributes, useEffect, useState } from 'react';
import DragGhost from '../DragGhost/DragGhost';
import { ColumnMetadata, ColumnModel, ColumnRelation, TableModel } from 'dtos/ModelUI';
import { container } from 'ioc/inversify.config';
import { IPubSubService } from 'interfaces/IPubSubService';
import { TYPES } from 'ioc/types';
import { IconButton } from 'components/common/Button/IconButton';
import AccordionItem from './AccordionItem';

interface Props extends HTMLAttributes<HTMLElement> {
  index: number;
  table: TableModel;
  filter?: string;
  listname?: string;
  subHeaderStickyTop?: number;
  selectedMap?: ColumnMetadata;
  disableMappings?: boolean;
  onClickHeader?: (header: string) => void;
  onClickItem?: (header: string, item: string, alias?: string) => void;
}

export default function Accordion(props: Props) {
  const [open, setOpen] = useState(true);
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const handleOnClickHeader = () => {
    props.onClickHeader?.(props.table.object);
  };

  const handleOnClickCollapse = () => {
    setOpen(!open);
  };

  const handleOnClickItem = (item: string) => {
    const selectedMap = { selected: { object: props.table.object, columnName: item, sidebar: props.listname } };
    pubSubService.emitEvent(EventData.Sidebar.Select, selectedMap);
    props.onClickItem?.(props.table.object, item, props.table.alias);
  };

  const handleOnDragStart = (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.setData(EventData.Sidebar.Table, props.table.object);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setDragImage(DragGhost(props.table.object, props.table.type), 0, 0);
    props.onDragStart?.(event);
  };

  const filterColumns = (column: ColumnModel) => {
    if (props.filter) {
      return (
        column.columnName.toLowerCase().includes(props.filter.toLowerCase()) ||
        column.type.toLowerCase().includes(props.filter.toLowerCase())
      );
    }
    return true;
  };

  useEffect(() => {
    pubSubService.subscribeToEvent(EventData.Model.Select, 'map-row', handleSelectedMap);
    return () => {
      pubSubService.unsubscribeFromEvent(EventData.Model.Select, 'map-row');
    };
  }, []);

  const handleSelectedMap = (data: { selected: ColumnRelation }) => {
    const selected = document.getElementsByClassName(styles.selectedListItem);
    Array.from(selected).forEach((element) => {
      element.scrollIntoView();
    });
  };

  return (
    <Box onDragStart={handleOnDragStart} draggable={props.draggable}>
      <ListSubheader className={styles.subheader} sx={{ paddingLeft: 0, top: props.subHeaderStickyTop }}>
        <ListItemButton className={styles.collapsableContainer}>
          <Box className={styles.label} data-testid="label" onClick={handleOnClickHeader}>
            <Subtitle2 className={styles.tableName}>{props.table.tableName}</Subtitle2>
            {props.table.alias && <Subtitle2 className={styles.tableAlias}>- {props.table.alias}</Subtitle2>}
          </Box>
          <IconButton className={styles.collapseIcon} onClick={handleOnClickCollapse}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItemButton>
      </ListSubheader>
      <Box className={styles.columnOptions}>
        <Collapse in={open} timeout="auto" unmountOnExit className={styles.collapseContainer}>
          {props.table.columns
            .filter((column) => filterColumns(column))
            .map((item, i) => (
              <AccordionItem
                key={`${props.table.object}-${item.columnName}`}
                index={i}
                parentIndex={props.index}
                table={props.table}
                item={item}
                listname={props.listname}
                selectedMap={props.selectedMap}
                disableMappings={props.disableMappings}
                onClickItem={handleOnClickItem}
              />
            ))}
        </Collapse>
      </Box>
    </Box>
  );
}
