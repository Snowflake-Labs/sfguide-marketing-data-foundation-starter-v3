import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from './TypesMenu.module.scss';
import { Body1 } from 'components/common/Text/TextComponents';
import ColumnTypeIcon from 'components/ColumnTypeIcon/ColumnTypeIcon';
import { ColumnModel, ColumnType } from 'dtos/ModelUI';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';
import { IMenu } from '../../../../../interfaces/IMenu';
import Tooltip from 'components/Tooltip/Tooltip';
import { useTranslation } from 'locales/i18n';

interface Props extends IMenu {
  column: ColumnModel;
  onChangeType: (type: ColumnType) => void;
}

export default function TypesMenu({ open, column, onChangeType, onClose, ...props }: Props) {
  const { t } = useTranslation('common');
  const { addColumnDefault } = useEditMappingContext();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOnSelected = (type: ColumnType) => {
    onChangeType(type);
    handleOnClose();
  };

  const handleOnClose = () => {
    onClose?.();
  };

  useEffect(() => {
    const anchor = open ? buttonRef.current : null;
    setAnchorEl(anchor);
  }, [open]);

  const columnType = useMemo(
    () =>
      column.object != addColumnDefault.object ||
      (column.object == addColumnDefault.object && column.type != ColumnType.NULL)
        ? column.type
        : undefined,
    [column]
  );

  return (
    <>
      <IconButton
        ref={buttonRef}
        aria-controls="simple-menu"
        aria-haspopup="true"
        className={styles.iconButton}
        onClick={props.onClick}
      >
        {columnType ? (
          <ColumnTypeIcon type={columnType} />
        ) : (
          <Tooltip title={t('SelectColumnTypeTooltip')} placement="right" children={<ArrowDropDownIcon />} />
        )}
      </IconButton>
      <Menu
        keepMounted
        id="simple-menu"
        anchorEl={anchorEl}
        open={open}
        sx={{ '& .MuiMenu-list': { padding: 0 } }}
        onClose={handleOnClose}
      >
        {Object.values(ColumnType).map((type) => (
          <MenuItem key={type} value={type} className={styles.listItem} onClick={() => handleOnSelected(type)}>
            <div className={styles.menuItem} row-type={type}>
              <ColumnTypeIcon type={type} />
              <Body1>{type}</Body1>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
