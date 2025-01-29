import { Typography } from '@mui/material';
import { TextProps } from './TextProps';

export const Text = (props: TextProps) => {
  const textComponent = <Typography {...props} />;
  return textComponent;
};
