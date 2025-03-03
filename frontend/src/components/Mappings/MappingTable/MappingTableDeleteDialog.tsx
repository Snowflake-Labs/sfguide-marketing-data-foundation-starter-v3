import { Caption, Subtitle1 } from 'components/common/Text/TextComponents';
import styles from './MappingTable.module.scss';
import { Box } from '@mui/material';
import { Button } from 'components/common/Button/Button';
import { useTranslation } from 'locales/i18n';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalComponent from 'components/Modal/ModalComponent';
import { useState } from 'react';
import { EventData } from 'dtos/EventData';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { removeDeepTableFromModelUI } from 'utils/MappingModel/ModelUpdates';
import shortenString from '../Helpers';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';

interface Props {
  openDelete: boolean;
  toggleDeleteModel: () => void;
  targetTableObjectToDelete: string;
  saving: boolean;
  onClickDelete?: () => void;
  onDeleteSucess?: () => void;
}

export default function MappingTableDeleteDialog(props: Props) {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();
  const { target } = useEditMappingContext();

  const [errorMessage, setErrorMessage] = useState<string>();

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const tableNameMaxLenght = 45;
  const targetTableObjectToDelete = shortenString(props.targetTableObjectToDelete, tableNameMaxLenght);

  const handleDelete = () => {
    handleDeleteConfirmation();
    props.onClickDelete?.();
  };

  const handleDeleteConfirmation = () => {
    const newModel = removeDeepTableFromModelUI(model, props.targetTableObjectToDelete, target?.object);
    pubSubService.emitEvent(EventData.Model.SaveAsync, newModel);
    pubSubService.subscribeToEvent(EventData.Model.AfterSave, 'delete-target-table-modal', handleSaveResponse);
  };

  const handleSaveResponse = (response: { success: boolean; error?: string }) => {
    if (response.success) handleDeleteSucess();
    else setErrorMessage(response.error);
    pubSubService.unsubscribeFromEvent(EventData.Model.AfterSave, 'delete-target-table-modal');
  };

  const handleDeleteSucess = () => {
    props.toggleDeleteModel();
    props.onDeleteSucess?.();
  };

  return (
    <ModalComponent open={props.openDelete} onClose={props.toggleDeleteModel}>
      <Subtitle1>{t('DeleteTableTargetConfirmation', { targetTableObjectToDelete })}</Subtitle1>
      <Box className={styles.actionsContainer}>
        <Caption color="error">{errorMessage}</Caption>
        <Button
          variant="outlined"
          className={styles.cancelButton}
          onClick={props.toggleDeleteModel}
          disabled={props.saving}
        >
          {t('BtnCancel')}
        </Button>
        <Button
          isLoading={props.saving}
          disabled={props.saving}
          variant="contained"
          color="error"
          className={styles.deleteButton}
          onClick={handleDelete}
          startIcon={<DeleteIcon />}
        >
          {t('Delete')}
        </Button>
      </Box>
    </ModalComponent>
  );
}
