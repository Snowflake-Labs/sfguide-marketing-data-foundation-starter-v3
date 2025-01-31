import { Body2 } from 'components/common/Text/TextComponents';
import styles from './ExistingAssistant.module.scss';
import Image from 'components/common/Image/Image';
import { AssistantInfo } from '../../../dtos/AssistantInfo';
import { useAIAssistantContext } from 'contexts/AIAssistantContext/AIAssistantContext';
import { useTheme } from '@mui/material';
import { useState } from 'react';
import SidebarLoading from 'components/common/Spinner/SidebarLoading';
import { useTranslation } from 'locales/i18n';
import DeleteModal from '../ChatSection/Subsections/MessageArea/DeleteModal';

interface Props {
  assistant: AssistantInfo;
}

export default function ExistingAssistant({ assistant }: Props) {
  const { t } = useTranslation('common');
  const [assistantName, setAssistantName] = useState(assistant.name);
  const handleAssistantNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssistantName(event.target.value);
  };

  function renameSelectedAssistant() {
    if (assistantName != assistant.name) {
      if (assistantName != "") {
        renameAssistant(assistant.id, assistantName);
      } 
      else {
        setAssistantName(assistant.name);
      }
    }
  }

  const {
    selectedAssistant,
    setSelectedAssistant,
    deleteAssistant,
    renameAssistant,
    sidebarLoading,
    setAssistantLoading,
    setShouldReload,
  } = useAIAssistantContext();
  const isSelected = assistant == selectedAssistant;

  function updateCurrentAssistant() {
    if (selectedAssistant != assistant) {
      setSelectedAssistant(assistant);
      setAssistantLoading(t('LoadingAssistant'));
    }
  }

  function deleteSelectedAssistant() {
    setShouldReload(false);
    setSelectedAssistant(assistant);
    handleOpenDelete();
  }

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <div className={styles.container}>
      <div
        className={isSelected ? `${styles.spacing} ${styles.background}` : styles.spacing}
        onClick={updateCurrentAssistant}
      >
        <Image image_name={assistant.type.toLowerCase()} image_height={24} image_width={24}></Image>
        <input
          className={styles.truncate}
          value={assistantName}
          onChange={handleAssistantNameChange}
          onBlur={renameSelectedAssistant}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur();
            }
          }}
        />
        {sidebarLoading && isSelected ? (
          <SidebarLoading />
        ) : (
          <div
            className={styles.icon}
            onClick={(event) => {
              event.stopPropagation();
              deleteSelectedAssistant();
            }}
          >
            <Image image_name="delete" image_height={20} image_width={20}></Image>
          </div>
        )}
      </div>
      <DeleteModal openDelete={openDelete} handleCloseDelete={handleCloseDelete} assistantName={assistantName}/>
    </div>
  );
}
