import { HTMLAttributes } from 'react';

export interface IMenu extends HTMLAttributes<HTMLElement> {
  open: boolean;
  onClose?: () => void;
}
