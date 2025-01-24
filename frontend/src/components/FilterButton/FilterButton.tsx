import FilterListIcon from '@mui/icons-material/FilterList';
import { Subtitle2 } from 'components/common/Text/TextComponents';
import styles from './FilterButton.module.scss';
import { useTranslation } from 'locales/i18n';
import { Button } from 'components/common/Button/Button';

export default function FilterButton() {
  const { t } = useTranslation('common');
  return (
    <Button className={styles.button} variant="outlined">
      <FilterListIcon color="primary" className={styles.filter_icon} />
      <Subtitle2>{t('Filter')}</Subtitle2>
    </Button>
  );
}
