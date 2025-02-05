import ListWithSection from 'components/ListWithSection/ListWithSection';
import marketingExecutionModels from '../../data/marketingExecutionModels.json';
import { useEffect } from 'react';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';
import { useTranslation } from 'locales/i18n';
import styles from './MarketingExecution.module.scss';
import Box from '@mui/material/Box';

export interface ISourceListProps {}

export default function MarketingExecution(props: ISourceListProps) {
  const { t } = useTranslation('common');
  return <Box className={styles.marketingSection}>
    <ListWithSection sectionSource={marketingExecutionModels} customTitle={t("SidebarMarketingExecution")} />;
  </Box>
}
