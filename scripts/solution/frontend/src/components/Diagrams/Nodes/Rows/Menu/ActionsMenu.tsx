import styles from './ActionsMenu.module.scss';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Body1 } from 'components/common/Text/TextComponents';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'locales/i18n';
import { IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useEffect, useRef, useState } from 'react';
import { IMenu } from '../../../../../interfaces/IMenu';

interface Props extends IMenu {
  onClickDelete?: () => void;
  onClickChangeType?: () => void;
}

export default function ActionsMenu({ open, onClose, ...props }: Props) {
  const { t } = useTranslation('common');

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOnClose = () => {
    onClose?.();
  };

  useEffect(() => {
    const anchor = open ? buttonRef.current : null;
    setAnchorEl(anchor);
  }, [open]);

  return (
    <>
      <IconButton
        ref={buttonRef}
        aria-controls="simple-menu"
        aria-haspopup="true"
        className={styles.iconButton}
        onClick={props.onClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        keepMounted
        id="simple-menu"
        open={open}
        anchorEl={anchorEl}
        sx={{ '& .MuiMenu-list': { padding: 0 } }}
        onClose={handleOnClose}
      >
        <MenuItem
          data-testid="change-type-button"
          value={'edit'}
          className={styles.item}
          onClick={props.onClickChangeType}
        >
          <EditIcon />
          <Body1>{t('ChangeColumnType')}</Body1>
        </MenuItem>
        <MenuItem data-testid="delete-button" value={'delete'} className={styles.item} onClick={props.onClickDelete}>
          <DeleteIcon color="error" />
          <Body1 color="error">{t('Delete')}</Body1>
        </MenuItem>
      </Menu>
    </>
  );
}
