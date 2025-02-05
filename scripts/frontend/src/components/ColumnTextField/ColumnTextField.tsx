import styles from './ColumnTextField.module.scss';
import { ColumnType } from 'dtos/ModelUI';
import { TextField, TextFieldProps } from '@mui/material';
import ColumnTypeIcon from 'components/ColumnTypeIcon/ColumnTypeIcon';

type Props = TextFieldProps & {
  type?: ColumnType;
};

export default function ColumnTextField({ type, ...props }: Props) {
  return (
    <TextField
      {...props}
      InputProps={{
        className: styles.inputContainer,
        readOnly: true,
        endAdornment: type && <ColumnTypeIcon type={type} />,
      }}
    />
  );
}
