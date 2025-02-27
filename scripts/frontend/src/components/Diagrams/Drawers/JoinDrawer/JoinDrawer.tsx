import styles from '../Drawer.module.scss';
import { Box, Stack, Table } from '@mui/material';
import CustomDrawer from 'components/CustomDrawer/CustomDrawer';
import CustomSelect, { IMenuItem } from 'components/CustomSelect/CustomSelect';
import { JoinTypes } from 'dtos/JoinDefinition';
import { useTranslation } from 'locales/i18n';
import { useEffect, useState } from 'react';
import JoinClause from './JoinClause';
import { Body1, Subtitle1 } from 'components/common/Text/TextComponents';
import { Button } from 'components/common/Button/Button';
import AddIcon from '@mui/icons-material/Add';
import CustomCodeEditor from 'components/CustomCodeEditor/CustomCodeEditor';
import { ColumnModel, TableModel } from 'dtos/ModelUI';
import { buildSqlQuery } from './Helpers';
import { JoinClauseQuery, JoinQuery } from 'dtos/JoinQuery';
import { DrawerProps } from 'components/CustomDrawer/Drawer';
import JoinDrawerFooter from './JoinDrawerFooter';
import { EventData } from 'dtos/EventData';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { addAliasToTable } from 'pages/DataSources/CustomizeMapings/EditMappingModel/Helpers';
import TableModelsExtraSection from '../TableModelsExtraSection/TableModelsExtraSection';

interface Props extends DrawerProps {
  tablesOptions: TableModel[];
  defaultToTable?: TableModel;
  defaultFromTable?: TableModel;
}

export default function JoinDrawer({ tablesOptions, defaultToTable, defaultFromTable, ...props }: Props) {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();

  const [code, setCode] = useState('');
  const [clauses, setClauses] = useState<JoinClauseQuery[]>([JoinClauseQuery]);
  const [sourceOptions, setSourceOptions] = useState<IMenuItem[]>([]);
  const [targetOptions, setTargetOptions] = useState<IMenuItem[]>([]);
  const [sourceColumnOptions, setSourceColumnOptions] = useState<ColumnModel[]>([]);
  const [targetColumnOptions, setTargetColumnOptions] = useState<ColumnModel[]>([]);
  const [joinQuery, setJoinQuery] = useState<JoinQuery>(JoinQuery);

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const handleOnAddCondition = () => {
    setClauses((prev) => prev.concat(JoinClauseQuery));
  };

  const handleOnRemoveCondition = (index: number) => {
    const newClauses = clauses.toSpliced(index, 1);
    newClauses[0].condition = '';
    setClauses(newClauses);
    setJoinQuery((prev) => ({ ...prev, clauses: newClauses }));
  };

  const handleOnSourceChange = (item: IMenuItem) => {
    let table = defaultToTable ?? tablesOptions.find((table) => table.object == item.value);
    if (!table) return;
    table = addAliasToTable(model, table);
    setSourceColumnOptions(table.columns);
    setJoinQuery((prev) => ({ ...prev, source: table }));
  };

  const handleOnTargetChange = (item: IMenuItem) => {
    let table = defaultFromTable ?? tablesOptions.find((table) => table.object == item.value);
    if (!table) return;
    table = addAliasToTable(model, table);
    setTargetColumnOptions(table.columns);
    setJoinQuery((prev) => ({ ...prev, target: table }));
  };

  const handleOnJoinTypeChange = (item: IMenuItem) => {
    setJoinQuery((prev) => ({ ...prev, type: item.value as JoinTypes }));
  };

  const handleOnJoinClauseChange = (clause: JoinClauseQuery, index: number) => {
    clauses[index] = clause;
    setJoinQuery((prev) => ({ ...prev, clauses: clauses }));
  };

  const handleOnCloseAndCancel = () => {
    handleOnClose();
    pubSubService.emitEvent(EventData.Drawer.Join.Cancel);
  };

  const handleOnClose = () => {
    setCode('');
    setClauses([JoinClauseQuery]);
    setJoinQuery(JoinQuery);
    props.setOpen?.(false);
    props.onClose?.();
  };

  const handleOnChangeEditor = (value: string | undefined) => {
    setCode(value as string);
  };

  useEffect(() => {
    if (!props.open) return;
    const options = getOptions(tablesOptions, defaultToTable);
    setSourceOptions(options);
    handleOnSourceChange(options[0]);
  }, [tablesOptions, defaultToTable, props.open]);

  useEffect(() => {
    if (!props.open) return;
    const options = getOptions(tablesOptions, defaultFromTable);
    setTargetOptions(options);
    handleOnTargetChange(options[0]);
  }, [tablesOptions, defaultFromTable, props.open]);

  useEffect(() => {
    if (!joinQuery) return;
    const query = buildSqlQuery(joinQuery);
    setCode(query);
  }, [joinQuery]);

  const getTableModels = () => {
    if (defaultFromTable) return [defaultFromTable, ...tablesOptions];
    return tablesOptions;
  };

  const onClickElement = (_element: string, item?: string, alias?: string) => {
    if (!item && !alias) return;
    setCode((prev) => `${prev}${alias ?? ''}.${item ?? ''}`);
  };

  return (
    <CustomDrawer
      {...props}
      open={props.open}
      label={t('DefineJOINHeader')}
      shouldOpenExtraSection
      extraSection={<TableModelsExtraSection tableModels={getTableModels()} onClickElement={onClickElement} />}
      footer={<JoinDrawerFooter {...props} code={code} joinQuery={joinQuery} onClose={handleOnClose} />}
      onClose={handleOnCloseAndCancel}
    >
      <Box className={styles.container}>
        <Box className={styles.scrollContainer}>
          {/* Select tables to JOIN */}
          <Stack spacing={1.5}>
            <CustomSelect
              label={t('JoinTypeSelector')}
              menuItems={JoinTypesOptions}
              onChangeItem={handleOnJoinTypeChange}
              value={joinQuery.type}
            />
            <Box className={styles.sourceContainer}>
              <CustomSelect
                label={`${t('JoinTableSelector')} 1`}
                value={defaultToTable?.object ?? joinQuery.source?.object}
                menuItems={sourceOptions}
                onChangeItem={handleOnSourceChange}
                disabled={!!defaultToTable}
              />
              <Body1>{joinQuery.source?.alias}</Body1>
              <CustomSelect
                label={`${t('JoinTableSelector')} 2`}
                menuItems={targetOptions}
                onChangeItem={handleOnTargetChange}
                value={defaultFromTable?.object ?? joinQuery.target?.object}
                disabled={!!defaultFromTable}
              />
              <Body1>{joinQuery.target?.alias}</Body1>
            </Box>
          </Stack>

          {/* Select columns to JOIN */}
          <Stack gap={1.5}>
            <Subtitle1>ON</Subtitle1>
            {clauses.map((_, index) => (
              <JoinClause
                key={`jc-${index}`}
                sourceColumnOptions={sourceColumnOptions}
                targetColumnOptions={targetColumnOptions}
                disableCondition={index == 0}
                hiddeDelete={clauses.length == 1}
                onChange={(clause) => handleOnJoinClauseChange(clause, index)}
                onDelete={() => handleOnRemoveCondition(index)}
              />
            ))}
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOnAddCondition}>
              {t('JoinAddConditionBtn')}
            </Button>
          </Stack>
        </Box>

        {/* Code Block component */}
        <Box className={styles.codeBlock}>
          <CustomCodeEditor code={code} onChange={handleOnChangeEditor} readOnly={false} />
        </Box>
      </Box>
    </CustomDrawer>
  );
}

const JoinTypesOptions: IMenuItem[] = Object.keys(JoinTypes).map((key) => ({
  value: key,
  label: JoinTypes[key as keyof typeof JoinTypes],
}));

const getOptions = (tables: TableModel[], defaultTable?: TableModel): IMenuItem[] => {
  const options = defaultTable
    ? [{ value: defaultTable.object, label: defaultTable.tableName }]
    : tables.map((table) => ({
        value: table.object,
        label: table.tableName,
      }));
  return options;
};
