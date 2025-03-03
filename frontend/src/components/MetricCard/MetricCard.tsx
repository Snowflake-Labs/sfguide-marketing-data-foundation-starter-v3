import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { MetricsBold, Subtitle2 } from 'components/common/Text/TextComponents';
import styles from './CardContent.module.scss';
import { useTranslation } from 'locales/i18n';

interface Props {
  title: string;
  body: string | number;
}

export default function MetricCard(cardProperties: Props) {
  const { t } = useTranslation('common');
  const formatLargeNumbers = (value: any)=> {
    if(typeof value === 'number' ){
      return Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 0
      }).format(value);
    }
    return value;
  }
  return (
    <Card sx={{ minWidth: 275, boxShadow: 'none' }}>
      <CardContent className={styles.card}>
        <Subtitle2 sx={{ color: '#1E252FDE' }}> {t(cardProperties.title)}
        </Subtitle2>
        <MetricsBold>{formatLargeNumbers(cardProperties.body)}</MetricsBold>
      </CardContent>
    </Card>
  );
}
