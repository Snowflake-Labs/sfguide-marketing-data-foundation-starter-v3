import { Stack } from '@mui/material';
import MappingComponent from 'components/Mappings/Mapping.component';
import { H6 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import { useNavigate } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';
import ActionsFooter from './ActionsFooter';
import { useEffect } from 'react';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';

export default function CustomizedMappings() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { setSteps } = useStepsContext();

  const handleOnEdit = () => {
    navigate(PathConstants.EDIT);
  };

  useEffect(() => {
    setSteps(1, 1);
  }, []);

  return (
    <Stack spacing={3}>
      <H6>{t('CustomizedMappings')}</H6>
      <MappingComponent onEdit={handleOnEdit} />
      <ActionsFooter />
    </Stack>
  );
}
