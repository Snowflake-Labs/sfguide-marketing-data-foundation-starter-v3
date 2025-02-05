import styles from './SelectAssistant.module.scss'
import AssistantCard from 'components/AssistantCard/AssistantCard';
import { useTranslation } from 'locales/i18n';

export default function SelectAssistant() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.spacing}>
      <AssistantCard imageName="DataEngineering" title={t('MarketingDataEngineeringAssistant')} body={t('MDEABody')}></AssistantCard>
      <AssistantCard imageName="CortexCopilot" title={t('MarketingCampaignManagementAssistant')} body={t('MCMABody')}></AssistantCard>
    </div>
  );
}
