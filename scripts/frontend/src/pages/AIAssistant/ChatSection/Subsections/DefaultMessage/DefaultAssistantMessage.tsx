import { Stack } from '@mui/material';
import styles from './DefaultAssistantMessage.module.scss';
import Image from 'components/common/Image/Image';
import { useTranslation } from 'locales/i18n';
import { Subtitle1 } from 'components/common/Text/TextComponents';

export default function DefaultAssistantMessage() {
  const { t } = useTranslation('common');
  return (
    <Stack direction="column" className={styles.defaultMessage}>
      <div className={styles.messageField}>
        <Image image_name="dataengineering" image_height={22} image_width={22}></Image>
        <Subtitle1>{t('AssistantDefaultMessage')}</Subtitle1>
      </div>
    </Stack>
  );
}
