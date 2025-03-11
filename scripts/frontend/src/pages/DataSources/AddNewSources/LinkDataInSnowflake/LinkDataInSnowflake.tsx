import { Box, Link, Stack } from '@mui/material';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import { Body2, H6 } from 'components/common/Text/TextComponents';
import useLinkDataInSnowflake, { ConnectionState } from './useLinkDataInSnowflake';
import { useTranslation } from 'locales/i18n';
import { Button } from 'components/common/Button/Button';
import styles from './LinkDataInSnowflake.module.scss';
import CustomDrawer from 'components/CustomDrawer/CustomDrawer';
import AddNewSourceFooter from 'components/AddNewSourceFooter/AddNewSourceFooter';
import RenderConnectionState from './RenderConnectionState';
import CustomCodeEditor from 'components/CustomCodeEditor/CustomCodeEditor';

const sqlCode = `USE ROLE <ACCOUNTADMIN>;
GRANT USAGE ON DATABASE <DATABASE_NAME> TO APPLICATION placeholder name;
GRANT USAGE ON SCHEMA <DATABASE_NAME>.<SCHEMA_NAME> TO APPLICATION placeholder name;
GRANT SELECT ON ALL TABLES IN SCHEMA <DATABASE_NAME>.<SCHEMA_NAME> TO APPLICATION placeholder name;`;

export default function LinkDataInSnowflake() {
  const { t } = useTranslation('comun');

  const {
    databases,
    databaseSelected,
    schemas,
    schemaSelected,
    connectorUsedSelected,
    open,
    connectionState,
    customTableProps,
    memoConnectorsByProvider,
    linkDataLoading,
    onChangeDataBase,
    onChangeSchema,
    onChangeConnectorUsed,
    toggleDrawer,
    onClickBack,
    onClickContinue,
    onClickConnect,
  } = useLinkDataInSnowflake();

  return (
    <>
    <Box>
    <Stack direction="column" spacing={6}>
        <H6>{t('LinkDataAlreadyInSnowflake')}</H6>
        <Stack direction="row" spacing={2}>
          <CustomSelect
            isLoading={linkDataLoading.isLoadingDataBase}
            value={databaseSelected}
            menuItems={databases}
            label={t('SelectDatabase')}
            onChange={onChangeDataBase}
            disabled={linkDataLoading.isLoadingSchema || linkDataLoading.isLoadingData}
          />
          <CustomSelect
            isLoading={linkDataLoading.isLoadingSchema}
            disabled={databaseSelected.length === 0 || linkDataLoading.isLoadingData}
            value={schemaSelected}
            menuItems={schemas}
            label={t('SelectSchema')}
            onChange={onChangeSchema}
          />
          <CustomSelect
            value={connectorUsedSelected}
            disabled={linkDataLoading.isLoadingData}
            menuItems={memoConnectorsByProvider}
            label={t('ConnectorUsed')}
            onChange={onChangeConnectorUsed}/>
        </Stack>
        <Link className={styles.noData} component="button" textAlign="left" variant="body2" onClick={toggleDrawer}>
          {t('DontSeeYourData')}
        </Link>
        <RenderConnectionState connectionState={connectionState} customTableProps={customTableProps} />
      </Stack>
      <CustomDrawer label={t('DontSeeYourData')} open={open} toggleDrawer={toggleDrawer}>
        <Stack direction="column" spacing={4} height="240px">
          <Body2>{t('RunTheFollowingCommands')}</Body2>
          <CustomCodeEditor code={sqlCode} readOnly={true} />
          <Button variant="outlined" className={styles.ok_button} onClick={toggleDrawer}>
            Ok
          </Button>
        </Stack>
      </CustomDrawer>
    </Box>
    <Box>
    <AddNewSourceFooter>
        <Box>
          {connectionState === ConnectionState.isConnected ? (
            <Button variant="contained" onClick={onClickContinue}>
              {t('Continue')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={onClickConnect}
              disabled={
                databaseSelected.length === 0 ||
                schemaSelected.length === 0 ||
                connectorUsedSelected.length === 0 ||
                linkDataLoading.isLoadingData
              }
              isLoading={linkDataLoading.isLoadingData}
            >
              {t('Connect')}
            </Button>
          )}
          <Button variant="outlined" onClick={onClickBack}>
            {t('Back')}
          </Button>
        </Box>
      </AddNewSourceFooter>
    </Box>
   
    </>
  );
}
