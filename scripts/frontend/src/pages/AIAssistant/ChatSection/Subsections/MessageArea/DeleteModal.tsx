import { Subtitle1 } from 'components/common/Text/TextComponents';
import { useAIAssistantContext } from 'contexts/AIAssistantContext/AIAssistantContext';
import { useTranslation } from 'locales/i18n';
import styles from './TitleActions.module.scss';
import { Button } from 'components/common/Button/Button';
import ModalComponent from 'components/Modal/ModalComponent';

interface Props {
  openDelete: boolean;
  handleCloseDelete: () => void;
  assistantName: string;
}

export default function DeleteModal({ openDelete, handleCloseDelete, assistantName }: Props) {
  const { t } = useTranslation('common');
  const { selectedAssistant, deleteAssistant } = useAIAssistantContext();

  function deleteSelectedAssistant() {
    if (selectedAssistant) {
      deleteAssistant(selectedAssistant.id);
    }
    handleCloseDelete();
  }

  return (
    <ModalComponent open={openDelete} onClose={handleCloseDelete}>
      <Subtitle1>{t('DeleteAssistantConfirmation', { assistantName: assistantName })}</Subtitle1>
      <div className={styles.actionsContainer}>
        <Button className={styles.cancelButton} onClick={handleCloseDelete}>
          {t('BtnCancel')}
        </Button>
        <Button className={styles.deleteButton} onClick={deleteSelectedAssistant}>
          {t('Delete')}
        </Button>
      </div>
    </ModalComponent>
  );
}
