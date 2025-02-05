import { ConnectionState } from './useLinkDataInSnowflake';
import { Alert, Fade, Link, Stack } from '@mui/material';
import { Subtitle1 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import styles from './LinkDataInSnowflake.module.scss';
import CustomTable, { ICustomTableProps } from 'components/CustomTable/CustomTable';

export interface IRenderConnectionStateProps {
  connectionState: ConnectionState;
  customTableProps: ICustomTableProps;
}

const sqlString: string = `ALTER TABLE MARKETING.RAW_LINKEDIN_ADS.TABLE1 SET CHANGE_TRACKING = True; 
ALTER TABLE MARKETING.RAW_LINKEDIN_ADS.TABLE2 SET CHANGE_TRACKING = <BOOLEAN_VALUE>;
ALTER TABLE MARKETING.RAW_LINKEDIN_ADS.TABLE3 SET CHANGE_TRACKING = True; `;

export default function RenderConnectionState({ connectionState, customTableProps }: IRenderConnectionStateProps) {
  const { t } = useTranslation('common');

  const RenderConnectionState = () => {
    switch (connectionState) {
      case ConnectionState.isConnected:
        return (
          <>
            <Alert severity="success">{t('SuccessfullyConnected')}</Alert>
            <Subtitle1>{t('TablesFound')}</Subtitle1>
            <CustomTable {...customTableProps} />
          </>
        );
      case ConnectionState.noGrantAccess:
        return (
          <Alert severity="error">
            {t('EnablingChangeTracking')}
            <Link
              className={styles.link}
              target="_blank"
              href="https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#enable-change-tracking"
            >
              {t('LearnMore')}
            </Link>
          </Alert>
        );
      default:
        return <></>;
    }
  };

  return (
    <Fade in={connectionState != ConnectionState.isNotConnected}>
      <Stack direction="column" spacing={6}>
        {RenderConnectionState()}
      </Stack>
    </Fade>
  );
}
