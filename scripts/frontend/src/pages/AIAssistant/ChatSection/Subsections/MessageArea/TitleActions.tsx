import { Subtitle1 } from 'components/common/Text/TextComponents';
import { useAIAssistantContext } from 'contexts/AIAssistantContext/AIAssistantContext';
import { useTranslation } from 'locales/i18n';
import styles from './TitleActions.module.scss';
import { Button } from 'components/common/Button/Button';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import { useEffect, useState } from 'react';
import { SelectChangeEvent, TextField } from '@mui/material';
import ModalComponent from 'components/Modal/ModalComponent';
import DeleteModal from './DeleteModal';

export default function MessageArea() {
  const { t } = useTranslation('common');
  const { selectedAssistant, renameAssistant, setAssistantContextFile } = useAIAssistantContext();
  const title =
    selectedAssistant?.type == 'DataEngineering'
      ? t('MarketingDataEngineeringAssistant')
      : t('MarketingCampaignManagementAssistant');
  const dataModels = [
    { label: 'UnifiedMarketingModel_CAMPAIGN_PERF.yaml', value: 'UnifiedMarketingModel_CAMPAIGN_PERF.yaml' },
  ]; // Temporary data
  const [selectedDataModel, setSelectedDataModel] = useState(dataModels[0].value);

  useEffect(() => {
    setAssistantContextFile(dataModels[0].value);
    setAssistantName(selectedAssistant?.name || '');
  }, [selectedAssistant]);

  const onChangeSelect = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as string;
    setSelectedDataModel(value);
    setAssistantContextFile(value);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const [openRename, setOpenRename] = useState(false);
  const handleOpenRename = () => setOpenRename(true);
  const handleCloseRename = () => setOpenRename(false);
  const [assistantName, setAssistantName] = useState(selectedAssistant?.name || '');
  const handleAssistantNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssistantName(event.target.value);
  };
  function renameSelectedAssistant() {
    if (selectedAssistant) {
      renameAssistant(selectedAssistant.id, assistantName);
    }
    handleCloseRename();
  }

  return (
    <div className={styles.spacing}>
      <Subtitle1>{title}</Subtitle1>
      <div className={styles.actionsContainer}>
        <div className={styles.modelSelector}>
          <CustomSelect
            label={t('DataModel')}
            menuItems={dataModels}
            value={selectedDataModel}
            onChange={onChangeSelect}
          />
        </div>
        <Button className={styles.renameButton} onClick={handleOpenRename}>
          {t('Rename')}
        </Button>
        <Button className={styles.deleteButton} onClick={handleOpenDelete}>
          {t('Delete')}
        </Button>
      </div>
      <DeleteModal assistantName={assistantName} handleCloseDelete={handleCloseDelete} openDelete={openDelete} />
      <ModalComponent open={openRename} onClose={handleCloseRename}>
        <Subtitle1>{t('RenameYourAssistant')}</Subtitle1>
        <TextField
          className={styles.textField}
          label={t('Name')}
          value={assistantName}
          onChange={handleAssistantNameChange}
          size="small"
        />
        <div className={styles.actionsContainer}>
          <Button className={styles.cancelButton} onClick={handleCloseRename}>
            {t('BtnCancel')}
          </Button>
          <Button
            disabled={selectedAssistant?.name === assistantName}
            className={styles.saveButton}
            onClick={renameSelectedAssistant}
          >
            {t('Save')}
          </Button>
        </div>
      </ModalComponent>
    </div>
  );
}
