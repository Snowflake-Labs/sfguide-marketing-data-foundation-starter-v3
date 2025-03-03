import { Subtitle1 } from 'components/common/Text/TextComponents';
import styles from './AddAssistant.module.scss';
import Stack from '@mui/material/Stack/Stack';
import SelectAssistant from './SelectAssistant';

export default function AddAssistant() {

  return (
    <Stack direction="column" className={styles.spacing}>
      <Subtitle1 color='primary'>Select an assistant</Subtitle1>
      <SelectAssistant></SelectAssistant>
    </Stack>
  );
}
