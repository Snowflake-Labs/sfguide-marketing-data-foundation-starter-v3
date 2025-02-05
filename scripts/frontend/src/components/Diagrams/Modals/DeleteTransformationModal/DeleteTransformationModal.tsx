import styles from './DeleteTransformationModal.module.scss';
import { Button } from 'components/common/Button/Button';
import { Caption, Subtitle1 } from 'components/common/Text/TextComponents';
import ModalComponent, { ModalProps } from 'components/Modal/ModalComponent';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { EventData } from 'dtos/EventData';
import { ColumnRelation } from 'dtos/ModelUI';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useTranslation } from 'locales/i18n';
import { useEffect, useMemo, useState } from 'react';
import { getTableNameInObject } from 'utils/MappingModel/ModelUIHelpers';
import {
  removeColumnRelationFromModelUI,
  removeColumnRelationFromModelUIByMapping,
} from 'utils/MappingModel/ModelUpdates';

interface IDeleteTransformationModalProps extends ModalProps {}

interface ITransformationData {
  targetHandleIdSplited: string[];
  sourceHandleId: string;
}

const isITransformationData = (obj: any): obj is ITransformationData => {
  return (
    obj &&
    typeof obj.targetHandleIdSplited === 'object' &&
    Array.isArray(obj.targetHandleIdSplited) &&
    typeof obj.sourceHandleId === 'string'
  );
};

export function DeleteTransformationModal(props: IDeleteTransformationModalProps) {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();

  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transformation, setTransformation] = useState<ColumnRelation | ITransformationData | undefined>();

  const [sourceColumnValue, targetColumnValue] = useMemo(() => {
    if (isITransformationData(transformation)) {
      const [, , tableName, columnName] = transformation.sourceHandleId.split('.');
      const source = `${tableName}.${columnName}` ?? '';
      const target = `${transformation?.targetHandleIdSplited[2]}.${transformation?.targetHandleIdSplited[3]}` ?? '';
      return [source, target];
    } else {
      const source = transformation?.mapping ?? '';
      const target =
        `${getTableNameInObject(transformation?.target.object)}.${transformation?.target.columnName}` ?? '';
      return [source, target];
    }
  }, [transformation]);

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const handleOnDelete = () => {
    if (!transformation) return;
    setIsDeleting(true);
    setErrorMessage(undefined);
    const newModel = isITransformationData(transformation)
      ? removeColumnRelationFromModelUIByMapping(model, transformation.targetHandleIdSplited)
      : removeColumnRelationFromModelUI(model, transformation);
    pubSubService.emitEvent(EventData.Model.Save, newModel);
    pubSubService.subscribeToEvent(EventData.Model.AfterSave, 'delete-transformation-modal', handleSaveResponse);
  };

  const handleOnClose = () => {
    props.onClose?.();
    toggleModal();
  };

  const handleSaveResponse = ({ success }: { success: boolean }) => {
    setIsDeleting(false);
    setTransformation(undefined);
    if (success) handleOnClose();
    else setErrorMessage(t('ErrorDeletingTransformation'));
  };

  const toggleModal = (open?: boolean) => {
    setOpen((prev) => (open === undefined ? !prev : open));
  };

  const toggleModalAndSetTranformation = ({ open, transformation }: any) => {
    if (transformation) setTransformation(transformation);
    toggleModal(open);
  };

  useEffect(() => {
    pubSubService.subscribeToEvent(
      EventData.Model.Delete,
      'open-delete-transformation-modal',
      toggleModalAndSetTranformation
    );
    return () => {
      pubSubService.unsubscribeFromEvent(EventData.Model.Delete, 'open-delete-transformation-modal');
    };
  }, []);

  return (
    <ModalComponent {...props} open={open} onClose={handleOnClose}>
      <Subtitle1>
        {t('DeleteTransformationConfirmation', { srcColumn: sourceColumnValue, trgColumn: targetColumnValue })}
      </Subtitle1>
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
