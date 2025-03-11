import { ColumnRelation, ColumnType, MappingType, ModelUI } from 'dtos/ModelUI';
import styles from './MappingTable.module.scss';
import { Box } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { Body1 } from 'components/common/Text/TextComponents';
import { container } from 'ioc/inversify.config';
import { IPubSubService } from 'interfaces/IPubSubService';
import { TYPES } from 'ioc/types';
import { EventData } from 'dtos/EventData';
import ColumnTypeIcon from 'components/ColumnTypeIcon/ColumnTypeIcon';
import { useMemo } from 'react';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { findColumnModelInModelUI } from 'utils/MappingModel/ModelUIHelpers';
import { NullType } from 'dtos/NullType';
import FormulaTypeIcon from 'components/ColumnTypeIcon/FormulaTypeIcon';
import Tooltip from 'components/Tooltip/Tooltip';
import { useTranslation } from 'locales/i18n';

interface IMappingRowProps {
  map: ColumnRelation;
  isActive: boolean;
  selectItemHandler: (map: ColumnRelation) => void;
}

export default function MappingRow({ map, isActive, selectItemHandler }: IMappingRowProps) {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const [targetColumnType, sourceTypeName, sourceIconComponent] = useMemo(() => {
    const targetType = findColumnModelInModelUI(model, map.target)?.type;
    let sourceTypeName = '';
    let sourceIconComponent: JSX.Element | undefined;

    switch (map.type) {
      case MappingType.Column:
        const sourceType = findColumnModelInModelUI(model, map.sources[0])?.type;
        if (!sourceType) break;
        sourceTypeName = sourceType.toLocaleLowerCase();
        sourceIconComponent = <ColumnTypeIcon type={sourceType} />;
        break;
      case MappingType.Static:
        if (map.mapping !== NullType) break;
        sourceTypeName = 'null';
        sourceIconComponent = <ColumnTypeIcon type={ColumnType.NULL} />;
        break;
      case MappingType.Formula:
        sourceTypeName = 'formula';
        sourceIconComponent = <FormulaTypeIcon />;
        break;
    }

    return [targetType, sourceTypeName, sourceIconComponent];
  }, [map]);

  const selectMapping = () => {
    selectItemHandler(map);
    pubSubService.emitEvent(EventData.Model.Select, { selected: map });
  };

  return (
    <Box className={isActive ? `${styles.selectedMap} ${styles.row}` : styles.row} onClick={selectMapping}>
      <Box className={styles.columnContainer}>
        <Tooltip title={map.mapping} placement="right">
          <Box className={`${styles.column} ${styles[sourceTypeName]}`}>
            {sourceIconComponent}
            <Body1 className={styles.overflow}>{map.mapping}</Body1>
          </Box>
        </Tooltip>
      </Box>
      <Tooltip title={t('TransformationTypeTooltip', { type: map.type })} placement="right">
        <EastIcon className={styles.icon} />
      </Tooltip>
      <Box className={styles.columnContainer}>
        <Tooltip title={map.mapping} placement="right">
          <Box className={`${styles.column} ${targetColumnType ? styles[targetColumnType.toLocaleLowerCase()] : ''}`}>
            {targetColumnType && <ColumnTypeIcon type={targetColumnType} />}
            <Body1 className={styles.overflow}>{map.target.columnName.toLocaleUpperCase()}</Body1>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}
