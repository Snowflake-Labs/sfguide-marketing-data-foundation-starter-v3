import styles from './SelectTargetModelPage.module.scss';
import { Box, Stack, TextField } from '@mui/material';
import TargetModelSelect from 'components/TargetModelSelect/TargetModelSelect';
import { Button } from 'components/common/Button/Button';
import Spinner from 'components/common/Spinner/Spinner';
import { H6 } from 'components/common/Text/TextComponents';
import AddIcon from '@mui/icons-material/Add';
import CustomDrawer from 'components/CustomDrawer/CustomDrawer';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import { useTranslation } from 'locales/i18n';
import useSelectTargetModelPage from './useSelectTargetModelPage';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';
import { useEffect, useMemo } from 'react';
import { useExistingSourcesContext } from 'contexts/ExistingSourcesContext/ExistingSourcesContext';
import { useParams } from 'react-router-dom';

interface ISelectTargetModelPageProps {}

export default function SelectTargetModelPage(props: ISelectTargetModelPageProps) {
  const { t } = useTranslation('common');
  const { setSteps } = useStepsContext();
  const {
    model,
    database,
    schema,
    customDrawer,
    onCreateClick,
    handleModelApply,
    handleModelShow,
    toogleCustomDrawer,
    onSelectFieldChange,
    onTextFildChange,
    validateTextFields,
  } = useSelectTargetModelPage();
  const { existingSources } = useExistingSourcesContext();
  const { sourceId } = useParams();

  const source = useMemo(
    () => existingSources.find((source) => source.SOURCE_ID == sourceId),
    [sourceId, existingSources]
  );

  // Run on first render
  useEffect(() => {
    setSteps(1, 0);
  }, []);

  return (
    <>
      <Box className={styles.container}>
        <Stack direction="row">
          <H6 mb={6}>{t('SelectTargetModelPage')}</H6>
          <Button
            variant="contained"
            data-testid="test-id-button-new-target"
            className={styles.button_new_target}
            startIcon={<AddIcon />}
            onClick={toogleCustomDrawer}
            disabled={!!source?.MODEL_ID}
          >
            {t('NewTargetModel')}
          </Button>
        </Stack>
        <Box className={styles.content}>
          <Spinner loading={model.isLoadingModels} label={t('SpinnerLoadingModels')}>
            {model.models.map((model) => (
              <TargetModelSelect
                id={model.MODEL_ID!}
                key={`models-${model.MODEL_ID}`}
                label={model.MODEL_NAME}
                onSelect={handleModelShow}
                onContinue={handleModelApply}
              />
            ))}
          </Spinner>
        </Box>
      </Box>
      <CustomDrawer label={t('NewTargetModel')} open={customDrawer.isOpen} toggleDrawer={toogleCustomDrawer}>
        <Stack direction="column" spacing={2} className={styles.add_target_container}>
          <TextField
            required
            id="text-field-target-model"
            data-testid="text-field-target-model"
            label={t('TargetModelName')}
            onChange={onTextFildChange}
          />
          <CustomSelect
            label={t('Database')}
            menuItems={database.databases}
            value={database.databaseValue}
            isLoading={database.isDatabaseLoading}
            onChange={onSelectFieldChange('Database')}
          />
          <CustomSelect
            label={t('Schema')}
            menuItems={schema.schemas}
            value={schema.schemaValue}
            disabled={!database.databaseValue || database.isDatabaseLoading}
            isLoading={schema.isSchemaLoading}
            onChange={onSelectFieldChange('Schema')}
          />
          <Stack direction="row-reverse" spacing={2} className={styles.container_buttons_drawer}>
            <Button
              variant="contained"
              onClick={onCreateClick}
              disabled={validateTextFields()}
              isLoading={customDrawer.isLoading}
            >
              {t('Create')}
            </Button>
            <Button variant="outlined" onClick={toogleCustomDrawer}>
              {t('Cancel')}
            </Button>
          </Stack>
        </Stack>
      </CustomDrawer>
    </>
  );
}
