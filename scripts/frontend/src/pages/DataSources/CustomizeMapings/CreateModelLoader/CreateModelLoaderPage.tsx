import styles from './CreateModelLoaderPage.module.scss';
import { Box, Button } from '@mui/material';
import CustomTable from 'components/CustomTable/CustomTable';
import { useFooterContext } from 'components/Footer/FooterContext/FooterContext';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';
import { ProgressBar } from 'components/common/Spinner/Spinner';
import { Subtitle1 } from 'components/common/Text/TextComponents';
import { useProcessProgressContext } from 'contexts/MappingContext/ProcessProgressContext';
import { EventData } from 'dtos/EventData';
import { IMappingService } from 'interfaces/IMappingService';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useTranslation } from 'locales/i18n';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';

interface Props {}

export default function CreateModelLoaderPage(props: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { modelId } = useParams();
  const { t } = useTranslation('common');
  const { setChildren } = useFooterContext();
  const { process, createdProcess, deletedProcess, updatedProcess, errorProcess } = useProcessProgressContext();
  const [inProgress, setInProgress] = useState(true);
  const [statusLabel, setStatusLabel] = useState(t('DataModelInProgress'));
  const mappingService = container.get<IMappingService>(TYPES.IMappingService);
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);
  const { setSteps } = useStepsContext();

  const handleContinue = () => navigate(`/${PathConstants.DATAEXPLORER}`);

  const handleBackToModel = () => navigate('..');

  const preventRefreshHandler = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    return (e.returnValue = '');
  };

  const eventCleanup = () => {
    window.removeEventListener('beforeunload', preventRefreshHandler);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', preventRefreshHandler);
    return eventCleanup;
  }, []);

  useEffect(() => {
    setSteps(1, 2);
  }, []);

  const handleGetModelProcess = () => {
    if (!modelId) return;
    mappingService.getModelStatus(modelId).then((response) => {
      const isRunning = response.some((p) => p.STATUS === 'RUNNING');
      setInProgress(isRunning);
    });
  };

  const handleProcessFinish = () => {
    // console.log('inside handleProcessFinish');
    setInProgress(false);
    // console.log('setInProgress set to False');
  };

  const handleProcessUpdate = (args: any) => {
    // console.log('inside handleProcessUpdate');
    setStatusLabel(
      t('ProgressExecutingModel', { tableName: `${args[args.length - 1].name} (${args[args.length - 1].index})` })
    );
    // console.log('after setStatusLabel');
  };

  const footer = (
    <Box>
      <Button variant="contained" onClick={handleContinue}>
        {t('BtnContinue')}
      </Button>
      <Button variant="outlined" onClick={handleBackToModel}>
        {t('BtnBackToTargetModels')}
      </Button>
    </Box>
  );

  useEffect(() => {
    const children = inProgress ? undefined : footer;
    setChildren(children);
  }, [inProgress]);

  useEffect(() => {
    // console.log('location.state?.inProgress before if statement', location.state?.inProgress);
    if (location.state?.inProgress) {
      // console.log('inside if statement');
      setInProgress(true);
      // console.log('setInProgress set to True');
      window.history.replaceState({}, '');
      // console.log('after window.history.replaceState');
    } else {
      // console.log('inside else statement');
      handleGetModelProcess();
      // console.log('after handleGetModelProcess');
    }
  }, [location]);

  useEffect(() => {
    // console.log('inside useEffect, before lines 108 and 109');
    pubSubService.subscribeToEvent(EventData.Process.UpdateProgress, 'loader-page', handleProcessUpdate);
    pubSubService.subscribeToEvent(EventData.Process.Message, 'loader-page', handleProcessFinish);
    // console.log('inside useEffect, after lines 108 and 109');
  }, []);

  return (
    <>
      <ProgressBar label={statusLabel} loading={inProgress} className={styles.spinner}>
        <Box className={styles.container}>
          {process.length <= 0 && (
            <Subtitle1 className={styles.notInProgressLabel}>{t('DataModelNotInProgress')}</Subtitle1>
          )}

          {/* Tables created sucessfully */}
          {createdProcess.length > 0 && (
            <Box className={`${styles.tableContainer} ${styles.createdContainer}`}>
              <Subtitle1>{t('TablesSuccessfullyCreated')}</Subtitle1>
              <CustomTable data={createdProcess} header={'TableNameColumnHeader'} className={styles.table} />
            </Box>
          )}

          {/* Tables updated sucessfully */}
          {updatedProcess.length > 0 && (
            <Box className={`${styles.tableContainer} ${styles.updatedContainer}`}>
              <Subtitle1>{t('TablesSuccessfullyUpdated')}</Subtitle1>
              <CustomTable data={updatedProcess} header={'TableNameColumnHeader'} className={styles.table} />
            </Box>
          )}

          {/* Tables deleted sucessfully */}
          {deletedProcess.length > 0 && (
            <Box className={`${styles.tableContainer} ${styles.deletedContainer}`}>
              <Subtitle1>{t('TablesSuccessfullyDeleted')}</Subtitle1>
              <CustomTable data={deletedProcess} header={'TableNameColumnHeader'} className={styles.table} />
            </Box>
          )}

          {/* Tables with errors */}
          {errorProcess.length > 0 && (
            <Box className={`${styles.tableContainer} ${styles.errorContainer}`}>
              <Subtitle1>{t('TablesWithErrors')}</Subtitle1>
              <CustomTable
                columns={['message']} // TODO format error message
                data={errorProcess}
                header={'TableNameColumnHeader'}
                className={styles.table}
              />
            </Box>
          )}
        </Box>
      </ProgressBar>
    </>
  );
}
