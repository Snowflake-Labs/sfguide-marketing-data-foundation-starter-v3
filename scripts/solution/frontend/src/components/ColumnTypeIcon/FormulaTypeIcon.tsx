import styles from './ColumnTypeIcon.module.scss';
import { Box, SvgIcon } from '@mui/material';
import { ReactComponent as FormulaIcon } from 'assets/icons/Formula.svg';

interface Props extends React.HTMLAttributes<HTMLElement> {}

export default function FormulaTypeIcon(props: Props) {
  return (
    <Box className={`${styles.container} ${props.className ?? ''} formula`}>
      <SvgIcon component={FormulaIcon} />;
    </Box>
  );
}
