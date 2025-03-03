import { HTMLAttributes } from 'react';
import Accordion from './Accordion';
import styles from './List.module.scss';
import { Box, List as MuiList } from '@mui/material';
import { ColumnMetadata, TableModel } from 'dtos/ModelUI';

interface Props extends HTMLAttributes<HTMLElement> {
  elements: TableModel[];
  listname?: string;
  filter?: string;
  subHeaderStickyTop?: number;
  disableMappings?: boolean;
  onClickAccordion?: (header: string, item?: string, alias?: string) => void;
  selectedElement?: ColumnMetadata | undefined;
}

export default function List(props: Props) {
  const handleOnClickAccordion = (header: string, item?: string, alias?: string) => {
    props.onClickAccordion?.(header, item, alias);
  };

  return (
    <Box className={`${styles.container} ${props.className ?? ''}`}>
      <MuiList className={styles.list} subheader={<li />}>
        {props.elements.map((item, index) => (
          <li key={`section-${index}`} className={styles.accordionContainer}>
            <ul className={styles.accordion}>
              <Accordion
                listname={props.listname?.replace(' ', '-')}
                index={index}
                table={item}
                filter={props.filter}
                selectedMap={props.selectedElement}
                subHeaderStickyTop={props.subHeaderStickyTop}
                disableMappings={props.disableMappings}
                draggable={props.draggable}
                onDragStart={props.onDragStart}
                onClickHeader={handleOnClickAccordion}
                onClickItem={handleOnClickAccordion}
              />
            </ul>
          </li>
        ))}
      </MuiList>
    </Box>
  );
}
