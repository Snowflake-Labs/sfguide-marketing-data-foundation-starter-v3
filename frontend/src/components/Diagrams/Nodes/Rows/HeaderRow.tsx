import styles from './Rows.module.scss';
import { styles as colors } from 'styles/styles';
import { Box, IconButton, useTheme } from '@mui/material';
import { Subtitle1 } from 'components/common/Text/TextComponents';
import { Handle, Position } from 'reactflow';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SourceSubMenu from 'components/SubMenu/SourceSubMenu';
import { useMemo, useRef, useState } from 'react';
import { TableModel } from 'dtos/ModelUI';
import EditableHeader from './EditableHeader';
import TargetSubMenu from 'components/SubMenu/TargetSubMenu';
import Tooltip from 'components/Tooltip/Tooltip';

export interface Props {
  id: string;
  classNames?: string[];
  table: TableModel;
  collapsed: boolean;
  onCollapsed: () => void;
}

export default function HeaderRows(props: Props) {
  const theme = useTheme();
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [alias, setAlias] = useState(props.table.alias);

  const [joinStyle, disableTooltip, disableMenu] = useMemo(() => {
    const joinStyle =
      props.table.type === 'source'
        ? { background: colors.diagram.edge.join.primary, border: `1px solid ${colors.diagram.edge.join.primary}` }
        : { background: 'transparent', border: 'transparent' };
    const disableTooltip = props.table.type !== 'source' && props.table.type !== 'target';
    const disableMenu = disableTooltip;
    return [joinStyle, disableTooltip, disableMenu];
  }, [props.table]);

  const menuRef = useRef<HTMLButtonElement>(null);

  const handleOnClickSubMenu = () => {
    setOpenSubMenu(!openSubMenu);
  };

  const handleExpand = () => {
    props.onCollapsed();
  };

  const onSubMenuClose = () => {
    setOpenSubMenu(false);
  };

  return (
    <Box key={`node-header`} className={`${styles.row} ${styles.header} ${props.classNames?.join(' ')}`}>
      <Tooltip title={props.table.object} placement="top" disableHoverListener={disableTooltip}>
        <Box className={styles.tooltipContainer}>
          <EditableHeader table={props.table} setAlias={setAlias} alias={alias} />

          {alias && (
            <Subtitle1 className={styles.alias} color={theme.palette.text.secondary}>
              {` - ${alias}`}
            </Subtitle1>
          )}
        </Box>
      </Tooltip>
      <Box className={styles.menu}>
        {!disableMenu && (
          <IconButton ref={menuRef} onClick={handleOnClickSubMenu} className={styles.button}>
            <MoreHorizIcon />
          </IconButton>
        )}
        {props.table.type === 'source' && (
          <SourceSubMenu table={props.table} open={openSubMenu} anchorEl={menuRef.current} onClose={onSubMenuClose} />
        )}
        {props.table.type === 'target' && (
          <TargetSubMenu table={props.table} open={openSubMenu} anchorEl={menuRef.current} onClose={onSubMenuClose} />
        )}
      </Box>
      <IconButton onClick={handleExpand} className={styles.expandButton}>
        {!props.collapsed && <ExpandLessIcon />}
        {props.collapsed && <ExpandMoreIcon />}
      </IconButton>
      <Handle
        position={Position.Left}
        id={`${props.id}-join`}
        isConnectable={false}
        type={'source'}
        style={joinStyle}
      />
      <Handle
        position={Position.Left}
        id={`${props.id}-join`}
        isConnectable={false}
        type={'target'}
        style={joinStyle}
      />
    </Box>
  );
}
