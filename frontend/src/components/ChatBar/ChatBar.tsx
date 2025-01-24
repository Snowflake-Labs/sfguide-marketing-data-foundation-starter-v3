import InputBase from '@mui/material/InputBase';
import SendIcon from '@mui/icons-material/Send';
import styles from './ChatBar.module.scss';
import { useTranslation } from 'locales/i18n';
import { useState } from 'react';
import { useAIAssistantContext } from 'contexts/AIAssistantContext/AIAssistantContext';

export default function ChatBar() {
  const { t } = useTranslation('common');
  const [question, setQuestion] = useState('');
  const { updateChat, conversationLoading } = useAIAssistantContext();

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(event.target.value);
  }

  function onClick() {
    if (question && !conversationLoading) {
      updateChat(question);
      setQuestion('');
    }
  }

  return (
    <div className={styles.sendMessage}>
      <InputBase
        className={styles.input}
        placeholder={t('MessageAssistant')}
        onChange={onChange}
        value={question}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onClick();
          }
        }}
      />
      <div 
      className={styles.sendIcon} onClick={onClick} >
        <SendIcon/>
      </div>
    </div>
  );
}
