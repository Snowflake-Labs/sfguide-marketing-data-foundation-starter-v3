import { Button } from 'components/common/Button/Button';
import styles from './TargetModelSelect.module.scss';
import { Box, Card } from '@mui/material';
import { useTranslation } from 'locales/i18n';
import { Subtitle1 } from 'components/common/Text/TextComponents';
import { useState } from 'react';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { ModelUI } from 'dtos/ModelUI';
import { useProcessProgressContext } from 'contexts/MappingContext/ProcessProgressContext';

interface Props {
  id: number;
  label: string;
  onSelect?: (modelId: number) => void;
  onContinue?: (model: ModelUI) => void;
}

export default function TargetModelSelect(props: Props) {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();
  const handleOnSelect = () => props.onSelect?.(props.id);
  const handleOnContinue = () => props.onContinue?.(model);
  const { loading } = useProcessProgressContext();

  return (
    <Box className={styles.container}>
      <Card variant="outlined" className={styles.card}>
        <Subtitle1 className={styles.label}>{props.label}</Subtitle1>
        <Box className={styles.actions}>
          <Button variant="outlined" onClick={handleOnSelect}>
            {t('BtnShowCustomizedMappings')}
          </Button>
          {/* TODO disabled button until SIT-1735 is resolved */}
          <Button variant="contained" onClick={handleOnContinue} isLoading={loading} disabled>
            {t('BtnApplyAndContinue')}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
