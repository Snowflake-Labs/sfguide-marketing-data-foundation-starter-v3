import { Button } from 'components/common/Button/Button';
import AddIcon from '@mui/icons-material/Add';
import { Body2 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import styles from './AddTransformationSetButton.module.scss';

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function AddTransformationSetButton({ onClick }: Props) {
  const { t } = useTranslation('common');

  return (
    <Button sx={{ border: 1 }} variant="outlined" className={styles.button} onClick={onClick}>
      <AddIcon className={styles.add_icon} />
      <Body2 className={styles.text}>{t('AddTransformationSet')}</Body2>
    </Button>
  );
}
