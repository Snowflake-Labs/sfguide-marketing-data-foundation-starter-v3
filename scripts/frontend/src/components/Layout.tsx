import styles from './Layout.module.scss';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SideBar from './Sidebar/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer/Footer';
import { useEffect } from 'react';
import Notification from './Notification/Notification';
import { isModelIdPage, PathConstants } from 'routes/pathConstants';

export default function Layout() {
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [layoutClasses, setLayoutClasses] = React.useState('');

  useEffect(() => {
    const isEditPage = location.pathname.includes(PathConstants.EDIT);
    const isModelPage = isModelIdPage(location.pathname);
    const layoutClasses = location.pathname.replaceAll('/', ' ');
    setLayoutClasses(layoutClasses);
    if (isEditPage || isModelPage) setOpen(false);
  }, [location]);

  return (
    <Box className={styles.container}>
      <CssBaseline />
      <Notification className={styles.notification}/>
      <SideBar open={open} setOpen={setOpen}></SideBar>
      <Box component="main" className={styles.main}>
        <Container maxWidth="lg" className={`${styles.content} ${layoutClasses}`}>
          <Outlet />
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}
