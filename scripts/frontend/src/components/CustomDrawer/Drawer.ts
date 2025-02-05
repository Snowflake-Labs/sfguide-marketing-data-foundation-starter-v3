export interface DrawerProps {
  open: boolean;
  setOpen?: (open: boolean) => void;
  onClose?: () => void;
}
