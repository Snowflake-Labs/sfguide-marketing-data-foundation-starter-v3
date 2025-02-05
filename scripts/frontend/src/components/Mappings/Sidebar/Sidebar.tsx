import styles from './Sidebar.module.scss';
import { Box, Collapse } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import List from '../List/List';
import { HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { Subtitle1, Subtitle2 } from 'components/common/Text/TextComponents';
import { IconButton } from 'components/common/Button/IconButton';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import SearchBar from 'components/SearchBar/SearchBar';
import { EventData } from 'dtos/EventData';
import { ColumnMetadata, ColumnRelation, TableModel } from 'dtos/ModelUI';
import Spinner from 'components/common/Spinner/Spinner';
import { container } from 'ioc/inversify.config';
import { IPubSubService } from 'interfaces/IPubSubService';
import { TYPES } from 'ioc/types';
import { useTranslation } from 'locales/i18n';
import { Button } from 'components/common/Button/Button';

interface Props extends HTMLAttributes<HTMLElement> {
  label: string;
  orientation: 'left' | 'right';
  elements: TableModel[];
  isLoading?: boolean;
  disableMappings?: boolean;
  onAddTable?: () => void;
  onClickElement?: (element: string, item?: string) => void;
}

export default function Sidebar(props: Props) {
  const { t } = useTranslation('common');

  const [isExpanded, setIsExpanded] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const handleChange = () => {
    setIsExpanded((prev) => !prev);
  };

  const [selectedElement, setSelectedElement] = useState<ColumnMetadata | undefined>(undefined);

  useEffect(() => {
    pubSubService.subscribeToEvent(EventData.Model.Select, props.label, handleSelectedMap);
  }, [props.label]);

  const handleSelectedMap = (data: { selected: ColumnRelation }) => {
    if (props.label.includes(t('MappingSidebarSource'))) {
      setSelectedElement(data.selected.sources[0]);
    }
    if (props.label.includes(t('MappingSidebarTarget'))) {
      setSelectedElement(data.selected.target);
    }
    setIsExpanded(true);
  };

  const onChangeSearchBar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value.toLowerCase());
  };

  const handleOnDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData(EventData.Sidebar.Orientation, props.orientation);
  };

  const handleOnClickElement = (element: string, item?: string) => {
    props.onClickElement?.(element, item);
  };

  const memoElements = useMemo(() => {
    const targetTables: TableModel[] = [];
    props.elements.forEach((element) => {
      if (element.object.toLowerCase().includes(filterValue)) {
        targetTables.push(element);
      } else {
        const subElementFiltered = element.columns.filter((subElement) =>
          subElement.columnName.toLowerCase().includes(filterValue)
        );
        if (subElementFiltered?.length > 0) {
          targetTables.push({ ...element, columns: subElementFiltered });
        }
      }
    });
    return targetTables;
  }, [filterValue, props.isLoading, props.elements]);

  return (
    <Box className={`${styles.container} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      <input hidden readOnly checked={isExpanded} />
      {!isExpanded && <Collapsed {...props} onChange={handleChange} />}
      <Collapse orientation="horizontal" in={isExpanded} timeout={150} className={styles.collapse}>
        <Box className={styles.content}>
          <Box className={styles.header}>
            <Box className={styles.headerLabel}>
              <IconButton className={styles.arrow} onClick={handleChange}>
                {props.orientation == 'right' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              </IconButton>
              <Subtitle1 className={styles.label}>{props.label}</Subtitle1>
            </Box>
            <SearchBar onChange={onChangeSearchBar} />
            {props.onAddTable && (
              <Button variant="outlined" className={styles.buttonCreateTable} onClick={props.onAddTable}>
                <AddIcon />
                <Subtitle2>{t('btnAddTable')}</Subtitle2>
              </Button>
            )}
          </Box>
          <Spinner loading={!!props.isLoading}>
            <List
              listname={props.label}
              selectedElement={selectedElement}
              elements={memoElements}
              className={styles.list}
              subHeaderStickyTop={0}
              disableMappings={props.disableMappings}
              onClickAccordion={handleOnClickElement}
              onDragStart={handleOnDragStart}
              draggable={props.draggable}
            />
          </Spinner>
        </Box>
      </Collapse>
    </Box>
  );
}

function Collapsed(props: Props) {
  return (
    <Box className={styles.collapsed}>
      <Box className={styles.header}>
        <IconButton className={styles.arrow} onClick={props.onChange}>
          {props.orientation == 'left' && <KeyboardArrowRight />}
          {props.orientation == 'right' && <KeyboardArrowLeft />}
        </IconButton>
      </Box>
      <Subtitle1 className={styles.label}>{props.label}</Subtitle1>
    </Box>
  );
}
