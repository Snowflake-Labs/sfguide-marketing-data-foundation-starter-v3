import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './Sidebar.module.scss';
import snowflakeLogo from '../../assets/snowflake.svg';
import collapsedLogo from '../../assets/collapsed_snowflake.svg';
import { useNavigate } from 'react-router-dom';
import MainListItems from './listItems';
import { Box, Tooltip } from '@mui/material';
import { useTranslation } from 'locales/i18n';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    'overflow-x': 'hidden',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 80,
    }),
  },
}));

export default function SideBar({ open, setOpen }: Props) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const toolbarClasses = `${styles.toolbar} ${!open && styles.collapsed}`;
  const drawerClasses = `${styles.drawer} ${!open && styles.collapsed}`;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer variant="permanent" open={open} className={drawerClasses}>
      <Toolbar className={toolbarClasses}>
        <Tooltip placement="right" className={styles.tooltip} title={open ? t('SidebarCollapse') : t('SidebarExpand')}>
          <IconButton onClick={toggleDrawer} className={styles.chevron}>
            {open && <ChevronLeftIcon />}
            {!open && <ChevronRightIcon />}
          </IconButton>
        </Tooltip>
        <Box className={styles.logo}>
          {open && <img src={snowflakeLogo} className={styles.AppLogo} alt="App Logo" />}
          {!open && <img src={collapsedLogo} className={styles.AppLogoCollapsed} alt="App Logo" />}
        </Box>
      </Toolbar>
      <List component="nav" className={styles.NavButtons}>
        <MainListItems open={open} navigate={navigate} />
      </List>
    </Drawer>
  );
}
