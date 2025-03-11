import styles from './AddAssistant.module.scss';
import AddIcon from '@mui/icons-material/Add';
import { Subtitle2 } from 'components/common/Text/TextComponents';
import { Button } from 'components/common/Button/Button';
import { useTranslation } from 'locales/i18n';
import { ButtonProps } from '@mui/material';

interface Props extends ButtonProps {}

export default function AddAssistantButton(props: Props) {
  const { t } = useTranslation('common');
  return (
    <Button {...props} className={styles.mybutton} variant="contained" >
      <AddIcon className={styles.add_icon} />
      <Subtitle2>{t('New Assistant')}</Subtitle2>
    </Button>
  );
}
