import { useTranslation } from 'locales/i18n';

import styles from './MappingsDrawer.module.scss';
import { Box, IconButton } from '@mui/material';
import CustomDrawer from 'components/CustomDrawer/CustomDrawer';
import { IMenuItem } from 'components/CustomSelect/CustomSelect';
import ColumnSelect from 'components/ColumnSelect/ColumnSelect';

import { useEffect, useMemo, useState } from 'react';
import StaticMappings from 'components/Mappings/StaticMappings/StaticMappings';
import MappingTypeSelector from 'components/Mappings/MappingTypeSelector/MappingTypeSelector';
import VariableMappings from '../../../Mappings/VariableMappings/VariableMappings';
import ColumnMappings from '../../../Mappings/ColumMappings/ColumnMappings';
import FormulaMappings from '../../../Mappings/FormulaMappings/FormulaMappings';
import EastIcon from '@mui/icons-material/East';
import { DrawerProps } from 'components/CustomDrawer/Drawer';
import MappingsDrawerFooter from './MappingsDrawerFooter';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { EventData } from 'dtos/EventData';
import { IPubSubService } from 'interfaces/IPubSubService';
import { TableModel, ColumnMetadata, MappingType, ColumnRelation, ColumnType, ColumnModel } from 'dtos/ModelUI';
import { ColumnTransformationMetadata } from './ColumnTransformationMetadata';
import TableModelsExtraSection from '../TableModelsExtraSection/TableModelsExtraSection';
import { findTableObjectInModelUI } from 'utils/MappingModel/ModelUIHelpers';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { Delete } from '@mui/icons-material';
import ColumnTextField from 'components/ColumnTextField/ColumnTextField';
import getColumnsUsedInFormula from './Helpers';

interface Props extends DrawerProps {
  sources: TableModel[];
  targetTable: TableModel;
  defaultMapping?: ColumnRelation;
}

export default function MappingsDrawer(props: Props) {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();

  const [mapType, setMapType] = useState<MappingType>(props.defaultMapping?.type ?? MappingType.Column);
  const [transformation, setTransformation] = useState<ColumnRelation>();
  const [targetColumn, setTargetColumn] = useState<ColumnMetadata>();
  const [sourceTransformation, setSourceTransformation] = useState<ColumnTransformationMetadata>();
  const { sourceDatabaseSchema } = useMappingContext();

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const targetColumnType: ColumnType | undefined = useMemo(
    () => props.targetTable?.columns.find((column) => column.columnName === targetColumn?.columnName)?.type,
    [targetColumn]
  );

  const handleOnClose = () => {
    props.setOpen?.(false);
    props.onClose?.();
    handleOnClear();
    pubSubService.emitEvent(EventData.Drawer.Mapping.Cancel);
  };

  const handleTargetSelect = (value: ColumnModel) => {
    const target = props.targetTable?.columns.find((column) => column.columnName === value.columnName);
    if (!target) return;
    handleTargetColumnChange({ columnName: target.columnName, object: props.targetTable.object });
  };

  const handleOnClear = () => {
    setMapType(MappingType.Column);
    setSourceTransformation(undefined);
    setTargetColumn(undefined);
    setTransformation(undefined);
  };

  const handleOnSelectMappingType = (value: MappingType) => {
    setMapType(value as MappingType);
  };

  const handleSetSource = (columnMapping: ColumnTransformationMetadata) => {
    setSourceTransformation(columnMapping);
  };

  const handleTargetColumnChange = (targetColumn: ColumnMetadata) => {
    const targetTable = findTableObjectInModelUI(targetColumn.object, model);
    const existingMapping = targetTable?.mappings?.find(
      ({ target, sources }) =>
        target.columnName === targetColumn.columnName &&
        sources?.some((source) => source.object.startsWith(sourceDatabaseSchema))
    );
    setTargetColumn(targetColumn);
    if (!existingMapping) return;
    const sourceColumnMetadata = { columns: existingMapping.sources, transformation: existingMapping.mapping };
    handleSetSource(sourceColumnMetadata);
  };

  const handleSetTransformation = (
    sourceTransformation: ColumnTransformationMetadata,
    targetColumn: ColumnMetadata
  ) => {
    const transformation: ColumnRelation = {
      sources: sourceTransformation.columns!,
      target: targetColumn,
      type: mapType,
      mapping: sourceTransformation.transformation,
      displayValue: sourceTransformation.displayValue,
    };
    setTransformation(transformation);
  };
  const renderMappingComponent = (mapType: MappingType) => {
    switch (mapType) {
      case MappingType.Variable:
        return <VariableMappings onSelectSource={handleSetSource} />;
      case MappingType.Static:
        return <StaticMappings onSelectSource={handleSetSource} />;
      case MappingType.Column:
        return <ColumnMappings tableModel={props.sources} onSelectSource={handleSetSource} />;
      case MappingType.Formula:
        return (
          <FormulaMappings
            code={sourceTransformation?.transformation ?? ''}
            targetTable={props.targetTable}
            onCodeChange={handleSetSource}
            transformation={sourceTransformation}
          />
        );
      default:
        return null;
    }
  };

  const onSourceElementClick = (_element: string, item?: string, alias?: string): void => {
    if (!item && !alias) return;
    const columnTransformation = getColumnsUsedInFormula(
      `${sourceTransformation?.transformation ?? ''}${alias}.${item}`,
      model
    );
    if (!columnTransformation) return;
    handleSetSource(columnTransformation);
  };

  useEffect(() => {
    handleOnClear();
  }, [props.open]);

  useEffect(() => {
    if (!props.defaultMapping) return;
    setSourceTransformation({ columns: props.defaultMapping?.sources, transformation: props.defaultMapping?.mapping });
    handleTargetColumnChange(props.defaultMapping.target);
    setMapType(props.defaultMapping.type);
  }, [props.defaultMapping]);

  useEffect(() => {
    if (!sourceTransformation || !targetColumn) return;
    handleSetTransformation(sourceTransformation, targetColumn);
  }, [targetColumn, sourceTransformation, mapType]);

  return (
    <CustomDrawer
      {...props}
      label={t('CreateTransformation')}
      onClose={handleOnClose}
      extraSection={<TableModelsExtraSection tableModels={props.sources} onClickElement={onSourceElementClick} />}
      shouldOpenExtraSection={mapType === MappingType.Formula}
      footer={<MappingsDrawerFooter {...props} onClose={handleOnClose} transformation={transformation} />}
    >
      <Box className={`${styles.container} ${styles[mapType]}`}>
        <MappingTypeSelector defaultValue={props.defaultMapping?.type} onselect={handleOnSelectMappingType} />
        <div className={styles.line}></div>
        {renderMappingComponent(mapType)}
      </Box>
      <Box className={styles.columnsSelector}>
        <ColumnTextField
          fullWidth
          size="small"
          id="outlined-read-only-input"
          label={t('SourceColumn')}
          defaultValue={''}
          value={sourceTransformation?.displayValue ?? sourceTransformation?.transformation ?? ''}
          type={sourceTransformation?.columnType}
        />
        <EastIcon className={styles.arrowIcon} />
        <ColumnSelect
          label={t('TargetColumn')}
          columns={props.targetTable.columns}
          value={targetColumn?.columnName}
          type={targetColumnType}
          onChangeColumn={handleTargetSelect}
        />

        {/* Delete transformation modal */}
        <IconButton
          disabled={!transformation}
          onClick={() => pubSubService.emitEvent(EventData.Model.Delete, { open: true, transformation })}
        >
          <Delete />
        </IconButton>
      </Box>
    </CustomDrawer>
  );
}
