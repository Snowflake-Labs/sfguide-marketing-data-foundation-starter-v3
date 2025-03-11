import styles from './ColumnTypeIcon.module.scss';
import { ColumnType } from 'dtos/ModelUI';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, SvgIcon } from '@mui/material';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import TagIcon from '@mui/icons-material/Tag';
import DataArrayIcon from '@mui/icons-material/DataArray';
import { ReactComponent as BooleanIcon } from 'assets/icons/BooleanIcon.svg';

interface Props extends React.HTMLAttributes<HTMLElement> {
  type: ColumnType;
}

export default function ColumnTypeIcon(props: Props) {
  return (
    <Box className={`${styles.container} ${props.className ?? ''} ${styles[props.type.toLocaleLowerCase()]}`}>
      <TypeIcon {...props} />
    </Box>
  );
}

function TypeIcon(props: Props) {
  switch (props.type) {
    default:
    case ColumnType.VARCHAR:
      return <TextFormatIcon />;
    case ColumnType.NUMBER:
      return <TagIcon />;
    case ColumnType.BOOLEAN:
      return <SvgIcon component={BooleanIcon} />;
    case ColumnType.DATE:
      return <AccessTimeIcon />;
    case ColumnType.VARIANT:
      return <DataArrayIcon />;
    case ColumnType.NULL:
      return <DoNotDisturbIcon />;
  }
}
