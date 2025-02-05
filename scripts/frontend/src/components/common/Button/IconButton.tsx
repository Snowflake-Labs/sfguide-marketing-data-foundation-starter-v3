import { ButtonProps } from '@mui/material';
import { IconButton as MuiIconButton } from '@mui/material';

interface Props extends ButtonProps {}

export const IconButton = (props: Props) => {
  return <MuiIconButton aria-label="check" {...props}></MuiIconButton>;
};
