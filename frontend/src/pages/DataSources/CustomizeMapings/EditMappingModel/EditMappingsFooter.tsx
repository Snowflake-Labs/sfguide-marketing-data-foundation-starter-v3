import { Box } from '@mui/material';
import { useFooterContext } from 'components/Footer/FooterContext/FooterContext';
import { Button } from 'components/common/Button/Button';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { useProcessProgressContext } from 'contexts/MappingContext/ProcessProgressContext';
import { useTranslation } from 'locales/i18n';
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';

export default function EditMappingsFooter() {
  const { t } = useTranslation('common');
  const { setChildren } = useFooterContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { model } = useMappingContext();
  const { sourceDatabaseSchema } = useMappingContext();
  const { loading, ApplyAndContinueProcess } = useProcessProgressContext();
  const [sourceDatabase, sourceSchema] = useMemo(() => {
    return sourceDatabaseSchema.split('.');
  }, [sourceDatabaseSchema]);

  const handleApplyModel = () => {
    ApplyAndContinueProcess(model);
  };

  const handleOnBack = () => {
    const pathTo = location.pathname.includes(PathConstants.NEWTABLE) ? '../..' : '..';
    navigate(pathTo);
  };

  const footer = (
    <Box>
      <Button variant="contained" isLoading={loading} onClick={handleApplyModel}>
        {t('BtnApplyAndContinue')}
      </Button>
      <Button variant="outlined" onClick={handleOnBack}>
        {t('BtnBackToMappingsSummary')}
      </Button>
    </Box>
  );

  useEffect(() => {
    setChildren(footer);
  }, [model, loading]);

  return <React.Fragment />;
}
