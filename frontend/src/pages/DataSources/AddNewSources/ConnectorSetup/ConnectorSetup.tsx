import { Box, Stack } from '@mui/material';
import FivetranFacebookMarkDown from 'assets/markdowns/connectors_md/FivetranFacebookMarkDown';
import OmnataLinkedInMarkDown from 'assets/markdowns/connectors_md/OmnataLinkedInMarkDown';
import demoUseCaseMarkdown from 'assets/markdowns/connectors_md/DemoUseCaseMarkdown';
import GoogleAnalyticsMarkdown from 'assets/markdowns/connectors_md/GoogleAnalyticsMarkdown';
import AddNewSourceFooter from 'components/AddNewSourceFooter/AddNewSourceFooter';
import CustomMarkdown from 'components/CustomMarkdown/CustomMarkdown';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';
import { Button } from 'components/common/Button/Button';
import { H6 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';
import { Link } from 'react-router-dom';
import connectorCardModels from '../../../../data/connectorCardModels.json';
import { IAccordionCardProps } from 'components/ListWithSection/AccordionCard/AccordionCard';
import styles from './ConnectorSetup.module.scss';

export default function ConnectorSetup() {
  const { t } = useTranslation('common');
  const { connectorId, providerId } = useParams();
  const { setSteps } = useStepsContext();
  const navigate = useNavigate();
  const [shouldContinue, setShouldContinue] = useState(false);

  useEffect(() => {
    setSteps(0, 3);
  }, []);

  const { url } = useMemo(() => {
    let connectorMapped!: IAccordionCardProps;
    connectorCardModels.forEach(({ accordionSections }) =>
      accordionSections.forEach(({ accordionCards }) => {
        const connectorFind = accordionCards.find(({ key_name }) => key_name === connectorId);
        if (connectorFind) connectorMapped = connectorFind;
      })
    );
    return connectorMapped;
  }, [connectorId]);

  const selectMarkdown = () => {
    switch (connectorId) {
      case 'Omnata':
        return OmnataLinkedInMarkDown;
      case 'Fivetran':
        return FivetranFacebookMarkDown;
      case 'SalesforceNativeConnector':
        return demoUseCaseMarkdown;
      case 'GoogleAnalyticsNativeConnector':
        return GoogleAnalyticsMarkdown;
      default:
        return '';
    }
  };

  const onClickBack = () => {
    setSteps(0, 2);
    navigate(`/${PathConstants.DATASOURCES}/${PathConstants.PROVIDERS}/${providerId}/${PathConstants.CONNECTORS}`);
  };

  const onClickInstallConnector = () => {
    setShouldContinue(true);
  };

  const onClickContinue = () => {
    navigate(PathConstants.LINK);
  };

  return (
    <>
      <Stack direction="column">
        <H6>{t('ConnectorSetup')}</H6>
        <CustomMarkdown>{selectMarkdown()}</CustomMarkdown>
      </Stack>
      <AddNewSourceFooter>
        <Box>
          {shouldContinue ? (
            <Button variant="contained" onClick={onClickContinue}>
              {t('Continue')}
            </Button>
          ) : (
            <Button variant="contained" onClick={onClickInstallConnector}>
              <Link to={url!} target="_blank" className={styles.link}>
                {t('InstallConnector')}
              </Link>
            </Button>
          )}
          <Button variant="outlined" onClick={onClickBack}>
            {t('Back')}
          </Button>
        </Box>
      </AddNewSourceFooter>
    </>
  );
}
