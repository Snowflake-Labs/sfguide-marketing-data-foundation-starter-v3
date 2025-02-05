import { ListItem } from '@mui/material';
import styles from './Conversation.module.scss';
import Image from 'components/common/Image/Image';
import { Body2 } from 'components/common/Text/TextComponents';
import List from '@mui/material/List';
import { Button } from 'components/common/Button/Button';
import { useAIAssistantContext } from 'contexts/AIAssistantContext/AIAssistantContext';
import { useTranslation } from 'locales/i18n';
import CustomCodeEditor from 'components/CustomCodeEditor/CustomCodeEditor';
import WaitDots from 'components/common/Spinner/WaitDots';
import CustomMarkdown from 'components/CustomMarkdown/CustomMarkdown';

export default function Conversation() {

    const { chat, selectedAssistant, conversationLoading } = useAIAssistantContext();
    const { t } = useTranslation('comun');
    const image = selectedAssistant?.type.toLowerCase() || "";
    const { updateChat } = useAIAssistantContext();

    function onClick() {
        updateChat(t('RecommendedQuestions'));
    }

    return (
        <List className={styles.list}>
            {chat.map((c, i) => (
                <div key={i} className={c.role === 'user' ? styles.userContainer : styles.aiContainer}>
                    <ListItem className={styles.listItem}>
                        <Image image_name={c.role === 'user' ? c.role : image} image_height={32} image_width={32} />
                        <div>
                            { c.error ? (
                                <div className={styles.text}>
                                    <CustomMarkdown>
                                        {t('CouldNotGetResponse')}
                                    </CustomMarkdown>
                                </div>
                            ) : 
                            ( conversationLoading && i === chat.length - 1) ? 
                            ( <WaitDots loading={conversationLoading}></WaitDots> ) : 
                            ( <div>
                                {c.content.text && (
                                  <div className={styles.text}>
                                    <CustomMarkdown>{c.content.text}</CustomMarkdown>
                                  </div> )}
                                {c.content.sql && (
                                  <div className={styles.sql}>
                                    <CustomCodeEditor code={c.content.sql} readOnly={true} />
                                  </div> )}
                                {c.content.suggestions?.map((suggestion, index) => (
                                  <div key={index} className={styles.text}>
                                    <CustomMarkdown>{`${index + 1}. ${suggestion}`}</CustomMarkdown>
                                  </div> ))}
                                {c.result && (
                                  <div className={styles.text}>
                                    <CustomMarkdown>{c.result}</CustomMarkdown>
                                  </div> )}
                              </div>)}
                        </div>
                    </ListItem>
                </div>
            ))}
            {chat.length <= 1 && (
                <Button className={styles.questions} onClick={onClick}>
                    {t('RecommendedQuestions')}
                </Button>
            )}
        </List>
    );
}
