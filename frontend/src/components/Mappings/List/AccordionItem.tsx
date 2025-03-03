import styles from './List.module.scss';
import { ListItem } from '@mui/material';
import ColumnTypeIcon from 'components/ColumnTypeIcon/ColumnTypeIcon';
import { Body2 } from 'components/common/Text/TextComponents';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { ColumnMetadata, ColumnModel, TableModel } from 'dtos/ModelUI';
import { useEffect, useMemo, useRef } from 'react';
import { findTableModelInModelUI } from 'utils/MappingModel/ModelUIHelpers';

interface Props {
  index: number;
  parentIndex: number;
  table: TableModel;
  item: ColumnModel;
  selectedMap?: ColumnMetadata;
  listname?: string;
  disableMappings?: boolean;
  onClickItem?: (item: string) => void;
}

export default function AccordionItem({ index, parentIndex, table, item, ...props }: Props) {
  const { model } = useMappingContext();

  const selectedItem = useRef(null);
  const selectedId = `${props.listname}-item-${parentIndex}-${index}`;

  const isSelected = useMemo(
    () =>
      props.selectedMap &&
      props.selectedMap.columnName === item.columnName &&
      props.selectedMap.object === table.object,

    [table, item, props.selectedMap]
  );

  const isEnabled = useMemo(
    () =>
      !props.disableMappings ||
      findTableModelInModelUI(table, model)?.mappings?.some(
        (m) =>
          (table.type === 'source' && m.sources?.some((s) => s.columnName === item.columnName)) ||
          (table.type === 'target' && m.target.columnName === item.columnName)
      ),
    [table, item]
  );

  const handleOnClick = () => {
    props.onClickItem?.(item.columnName);
  };

  useEffect(() => {
    if (!isSelected) return;
    const element = document.getElementById(selectedId);
    if (element) element.scrollIntoView();
  }, [isSelected]);

  return (
    <ListItem
      ref={isSelected ? selectedItem : null}
      id={selectedId}
      key={selectedId}
      className={`${styles.listItem} ${isSelected ? styles.selectedListItem : ''} ${isEnabled ? '' : styles.disabled}`}
      onClick={handleOnClick}
    >
      <Body2>{item.columnName}</Body2>
      <ColumnTypeIcon className={styles.icon} type={item.type} />
    </ListItem>
  );
}
