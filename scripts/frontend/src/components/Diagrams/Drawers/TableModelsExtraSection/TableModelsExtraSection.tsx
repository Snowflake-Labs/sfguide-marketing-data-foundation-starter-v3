import { Stack } from '@mui/material';
import styles from './TableModelsExtraSection.module.scss';
import { Subtitle1 } from 'components/common/Text/TextComponents';
import SearchBar from 'components/SearchBar/SearchBar';
import List from 'components/Mappings/List/List';
import { useTranslation } from 'locales/i18n';
import { useMemo, useState } from 'react';
import { TableModel } from 'dtos/ModelUI';

export interface ITableModelsExtraSectionProps {
  draggable?: boolean;
  tableModels: TableModel[];
  onClickElement?: (element: string, item?: string, alias?: string) => void;
  onDragStart?: (event: React.DragEvent) => void;
}

export default function TableModelsExtraSection({
  tableModels,
  draggable,
  onClickElement,
  onDragStart,
}: ITableModelsExtraSectionProps) {
  const { t } = useTranslation('commun');
  const [filterValue, setFilterValue] = useState('');
  const memoElements = useMemo(() => {
    const sourceTables: TableModel[] = [];
    tableModels.forEach((element) => {
      if (element.object.toLowerCase().includes(filterValue)) {
        sourceTables.push(element);
      } else {
        const subElementFiltered = element.columns.filter((subElement) =>
          subElement.columnName.toLowerCase().includes(filterValue)
        );
        if (subElementFiltered?.length > 0) {
          sourceTables.push({ ...element, columns: subElementFiltered });
        }
      }
    });
    return sourceTables;
  }, [filterValue]);

  const handleOnSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value.toLowerCase());
  };

  return (
    <Stack className={styles.container} spacing={2}>
      <Subtitle1 className={styles.label}>{t('MappingSidebarSource')}</Subtitle1>
      <SearchBar onChange={handleOnSearchChange} />
      <List
        elements={memoElements}
        className={styles.list}
        onClickAccordion={onClickElement}
        onDragStart={onDragStart}
        draggable={draggable}
      />
    </Stack>
  );
}
