import { Subtitle2 } from 'components/common/Text/TextComponents';
import styles from './DeleteButton.module.scss';
import { useTranslation } from 'locales/i18n';
import { Button } from 'components/common/Button/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { ButtonProps } from '@mui/material/Button/Button';

interface Props extends ButtonProps {}

export default function DeleteButton(props: Props) {
  const { t } = useTranslation('common');
  return (
    <Button {...props} className={styles.button} variant="outlined">
      <DeleteIcon color="primary" className={styles.delete_icon} />
      <Subtitle2>{t('Delete')}</Subtitle2>
    </Button>
  );
}
