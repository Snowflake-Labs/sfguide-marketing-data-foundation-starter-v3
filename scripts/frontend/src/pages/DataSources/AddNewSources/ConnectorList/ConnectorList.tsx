import ListWithSection from 'components/ListWithSection/ListWithSection';
import connectorCardModels from '../../../../data/connectorCardModels.json';
import AddNewSourceFooter from 'components/AddNewSourceFooter/AddNewSourceFooter';
import { Button } from 'components/common/Button/Button';
import { useTranslation } from 'locales/i18n';
import { useNavigate, useParams } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';
import { useEffect } from 'react';

export interface IConnectorListProps {}

export default function ConnectorList(props: IConnectorListProps) {
  const { t } = useTranslation('common');
  const { providerId } = useParams();
  const { setSteps } = useStepsContext();
  const navigate = useNavigate();

  useEffect(() => {
    setSteps(0, 2);
  }, []);

  const onClickBack = () => {
    setSteps(0, 1);
    navigate(`/${PathConstants.DATASOURCES}/${PathConstants.PROVIDERS}/${providerId}`);
  };
  return (
    <>
      <ListWithSection sectionSource={connectorCardModels} />
      <AddNewSourceFooter>
        <Button variant="outlined" onClick={onClickBack}>
          {t('Back')}
        </Button>
      </AddNewSourceFooter>
    </>
  );
}
