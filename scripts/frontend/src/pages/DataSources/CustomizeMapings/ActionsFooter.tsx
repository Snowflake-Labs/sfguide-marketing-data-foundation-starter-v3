import { Box } from '@mui/material';
import { useFooterContext } from 'components/Footer/FooterContext/FooterContext';
import { Button } from 'components/common/Button/Button';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { useProcessProgressContext } from 'contexts/MappingContext/ProcessProgressContext';
import { useTranslation } from 'locales/i18n';
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ActionsFooter() {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();
  const { setChildren } = useFooterContext();
  const navigate = useNavigate();
  const { loading, ApplyAndContinueProcess } = useProcessProgressContext();

  const handleApplyModel = () => {
    ApplyAndContinueProcess(model);
  };

  const handleBackToModels = () => navigate('..');

  const render = (
    <Box>
      <Button variant="contained" onClick={handleApplyModel} disabled={!model.id} isLoading={loading}>
        {t('BtnApplyAndContinue')}
      </Button>
      <Button variant="outlined" onClick={handleBackToModels}>
        {t('BtnBackToTargetModels')}
      </Button>
    </Box>
  );

  useEffect(() => {
    setChildren(render);
  }, [model, loading]);

  return <React.Fragment />;
}
