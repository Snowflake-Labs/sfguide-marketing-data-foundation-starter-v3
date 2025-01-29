import { useTranslation } from 'locales/i18n';
import styles from './FiltersDrawer.module.scss';
import { Box } from '@mui/material';
import CustomDrawer from 'components/CustomDrawer/CustomDrawer';
import { useEffect, useState } from 'react';
import { DrawerProps } from 'components/CustomDrawer/Drawer';
import FiltersDrawerFooter from './FiltersDrawerFooter';
import { ConditionType, TableModel } from 'dtos/ModelUI';
import CustomCodeEditor from 'components/CustomCodeEditor/CustomCodeEditor';
import TableModelsExtraSection from '../TableModelsExtraSection/TableModelsExtraSection';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';
import { findQualifyOfTargetInTable, findWhereOfTargetInTable } from 'utils/MappingModel/ModelUIHelpers';

export interface IFilterDrawerProps extends DrawerProps {
  type: ConditionType;
  table: TableModel;
}

export default function FiltersDrawer(props: IFilterDrawerProps) {
  const { t } = useTranslation('common');
  const { target } = useEditMappingContext();

  const [condition, setCondition] = useState<string>('');

  const handleOnChange = (value: string | undefined) => {
    setCondition(value ?? '');
  };

  const onSourceElementClick = (_element: string, item?: string, alias?: string) => {
    if (!item && !alias) return;
    setCondition((prev) => `${prev}${alias ?? ''}.${item ?? ''}`);
  };

  useEffect(() => {
    switch (props.type) {
      case 'Qualify':
        setCondition(findQualifyOfTargetInTable(props.table, target)?.value ?? '');
        break;
      case 'Where':
        setCondition(findWhereOfTargetInTable(props.table, target)?.value ?? '');
        break;
    }
  }, [props.table, target]);

  return (
    <CustomDrawer
      {...props}
      label={t(props.type)}
      shouldOpenExtraSection
      extraSection={<TableModelsExtraSection tableModels={[props.table]} onClickElement={onSourceElementClick} />}
      footer={<FiltersDrawerFooter {...props} condition={condition} table={props.table} type={props.type} />}
    >
      <Box className={styles.container}>
        <CustomCodeEditor code={condition} readOnly={false} onChange={handleOnChange} />
      </Box>
    </CustomDrawer>
  );
}
