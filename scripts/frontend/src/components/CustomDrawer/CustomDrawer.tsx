import { Box, Collapse, Drawer, IconButton } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styles from './CustomDrawer.module.scss';
import { H6 } from 'components/common/Text/TextComponents';
import { DrawerProps } from './Drawer';

export interface ICustomDrawerProps extends DrawerProps {
  label: string;
  toggleDrawer?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  extraSection?: ReactElement;
  shouldOpenExtraSection?: boolean;
}

export default function CustomDrawer({
  label,
  toggleDrawer,
  children,
  footer,
  extraSection,
  shouldOpenExtraSection,
  ...props
}: ICustomDrawerProps) {
  const handleCloseIconClick = () => {
    toggleDrawer?.();
    props.setOpen?.(false);
    props.onClose?.();
  };

  return (
    <Drawer open={props.open} anchor="right">
      <Box className={styles.container}>
        <Collapse
          in={shouldOpenExtraSection}
          className={styles.extraSection}
          orientation="horizontal"
          timeout="auto"
          collapsedSize="0px"
        >
          <div>{extraSection}</div>
        </Collapse>
        <Box className={styles.mainContentContainer}>
          <Box className={styles.header}>
            <H6>{label}</H6>
            <IconButton size="large" onClick={handleCloseIconClick} className={styles.button_close}>
              <CloseIcon className={styles.icon_close} />
            </IconButton>
          </Box>
          <Box className={styles.content}>{children}</Box>
          {footer && <Box className={styles.footer}>{footer}</Box>}
        </Box>
      </Box>
    </Drawer>
  );
}
