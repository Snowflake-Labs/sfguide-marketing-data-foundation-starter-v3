import { TypographyProps } from '@mui/material';
import { TextType } from './TextType';
import { ReactNode } from 'react';

export interface TextProps extends TypographyProps {
  children: ReactNode;
  variant?: TextType;
}
