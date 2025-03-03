import styles from './DeleteColumnModal.module.scss';
import { Button } from 'components/common/Button/Button';
import { Caption, Subtitle1 } from 'components/common/Text/TextComponents';
import ModalComponent, { ModalProps } from 'components/Modal/ModalComponent';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { EventData } from 'dtos/EventData';
import { ColumnMetadata } from 'dtos/ModelUI';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useTranslation } from 'locales/i18n';
import { useState } from 'react';
import { removeColumnFromModelUI } from 'utils/MappingModel/ModelUpdates';

interface Props extends ModalProps {
  column: ColumnMetadata;
}

export function DeleteColumnModal({ column, ...props }: Props) {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();

  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const handleOnDelete = () => {
    setIsDeleting(true);
    setErrorMessage(undefined);
    const newModel = removeColumnFromModelUI(model, column);
    pubSubService.emitEvent(EventData.Model.Save, newModel);
    pubSubService.subscribeToEvent(EventData.Model.AfterSave, 'delete-column-modal', handleSaveResponse);
  };

  const handleOnClose = () => {
    props.onClose?.();
  };

  const handleSaveResponse = ({ success }: { success: boolean }) => {
    setIsDeleting(false);
    if (success) handleOnClose();
    else setErrorMessage(t('ErrorDeletingColumn'));
  };

  return (
    <ModalComponent {...props} open={props.open} onClose={handleOnClose}>
      <Subtitle1>{t('DeleteColumnConfirmation', { column: `'${column.columnName}'` })}</Subtitle1>
      <div className={styles.actionsContainer}>
        <Caption color="error">{errorMessage}</Caption>
        <Button variant="outlined" className={styles.cancelButton} onClick={handleOnClose}>
          {t('BtnCancel')}
        </Button>
        <Button
          className={styles.deleteButton}
          variant="contained"
          color="error"
          isLoading={isDeleting}
          onClick={handleOnDelete}
        >
          {t('Delete')}
        </Button>
      </div>
    </ModalComponent>
  );
}
