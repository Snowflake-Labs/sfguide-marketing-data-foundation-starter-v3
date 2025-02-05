import styles from '../Drawer.module.scss';
import Grid from '@mui/material/Unstable_Grid2';
import CustomSelect, { IMenuItem } from 'components/CustomSelect/CustomSelect';
import { IconButton } from 'components/common/Button/IconButton';
import { JoinConditions, JoinOperators } from 'dtos/JoinDefinition';
import { useTranslation } from 'locales/i18n';
import DeleteIcon from '@mui/icons-material/Delete';
import { JoinClauseQuery } from 'dtos/JoinQuery';
import { useEffect, useState } from 'react';
import ColumnSelect from 'components/ColumnSelect/ColumnSelect';
import { ColumnModel } from 'dtos/ModelUI';

interface Props {
  disableCondition?: boolean;
  sourceColumnOptions: ColumnModel[];
  targetColumnOptions: ColumnModel[];
  hiddeDelete?: boolean;
  onDelete?: () => void;
  onChange?: (clause: JoinClauseQuery) => void;
}

export default function JoinClause(props: Props) {
  const { t } = useTranslation('common');
  const [joinClauseQuery, setJoinClauseQuery] = useState<JoinClauseQuery>(JoinClauseQuery);

  const selectorSize = props.hiddeDelete ? 4 : 3.8;

  const handleOnDelete = () => {
    props.onDelete?.();
  };

  const handleOnChangeSource = (item: ColumnModel) => {
    setJoinClauseQuery((prev) => ({ ...prev, sourceColumn: item.columnName }));
  };

  const handleOnChangeTarget = (item: ColumnModel) => {
    setJoinClauseQuery((prev) => ({ ...prev, targetColumn: item.columnName }));
  };

  const handleOnChangeRelation = (item: IMenuItem) => {
    setJoinClauseQuery((prev) => ({ ...prev, relation: item.value as JoinOperators }));
  };

  const handleOnChangeCondition = (item: IMenuItem) => {
    setJoinClauseQuery((prev) => ({ ...prev, condition: item.value as JoinConditions }));
  };

  useEffect(() => {
    props.onChange?.(joinClauseQuery);
  }, [joinClauseQuery]);

  useEffect(() => {
    setJoinClauseQuery(
      getDefaultJoinClause(props.sourceColumnOptions, props.targetColumnOptions, !props.disableCondition)
    );
  }, [props.sourceColumnOptions, props.targetColumnOptions]);

  return (
    <Grid container rowSpacing={1.5} className={styles.clause}>
      {!props.disableCondition && (
        <>
          <Grid xs={selectorSize}>
            <CustomSelect
              label={t('JoinConditionSelector')}
              menuItems={ConditionOptions}
              onChangeItem={handleOnChangeCondition}
              value={joinClauseQuery?.condition}
            />
          </Grid>
          <Grid xs={12 - selectorSize} />
        </>
      )}
      <Grid xs={selectorSize}>
        <ColumnSelect
          label={`${t('JoinColumnSelector')} 1`}
          columns={props.sourceColumnOptions}
          onChangeColumn={handleOnChangeSource}
          value={joinClauseQuery?.sourceColumn}
        />
      </Grid>
      <Grid xs={selectorSize} pr={1.5} pl={1.5}>
        <CustomSelect
          label={t('JoinRelationSelector')}
          menuItems={OperatorsOptions}
          onChangeItem={handleOnChangeRelation}
          value={joinClauseQuery?.relation}
        />
      </Grid>
      <Grid xs={selectorSize}>
        <ColumnSelect
          label={`${t('JoinColumnSelector')} 2`}
          columns={props.targetColumnOptions}
          onChangeColumn={handleOnChangeTarget}
          value={joinClauseQuery?.targetColumn}
        />
      </Grid>
      {!props.hiddeDelete && (
        <Grid xs={4 - selectorSize}>
          <IconButton className={styles.icon} onClick={handleOnDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}

const ConditionOptions: IMenuItem[] = Object.values(JoinConditions).map((value) => ({ value: value, label: value }));

const OperatorsOptions: IMenuItem[] = Object.values(JoinOperators).map((value) => ({ value: value, label: value }));

const getDefaultJoinClause = (
  sources: ColumnModel[],
  targets: ColumnModel[],
  isCondition: boolean
): JoinClauseQuery => ({
  condition: isCondition ? (ConditionOptions[0].value as JoinConditions) : '',
  sourceColumn: sources[0]?.columnName ?? '',
  targetColumn: targets[0]?.columnName ?? '',
  relation: JoinOperators.Equal,
});
