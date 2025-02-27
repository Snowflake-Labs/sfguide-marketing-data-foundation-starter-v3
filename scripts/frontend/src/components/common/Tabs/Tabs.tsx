import React, { useMemo } from 'react';
import { Box, Tabs as MuiTabs, Stack, TabsProps, Typography } from '@mui/material';
import Tab from './Tab';
import TabPanel from './TabPanel';
import styles from './Tabs.module.scss';
import Image from '../Image/Image';
import sourceCardModel from '../../../data/sourceCardModels.json';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'locales/i18n';
import { FullPathConstants } from 'routes/pathConstants';

interface Props extends TabsProps {
  labels: string[];
}

export default function Tabs(props: Props) {
  const { providerId } = useParams();
  const { t } = useTranslation('common');

  const { label, image_name } = useMemo(() => {
    if (providerId) {
      for (const { accordionSections } of sourceCardModel) {
        for (const { accordionCards } of accordionSections) {
          for (const { label, image_name, key_name } of accordionCards) {
            if (key_name === providerId) {
              return { label, image_name };
            }
          }
        }
      }
    }
    return { label: '', image_name: '' };
  }, [providerId]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs {...props} className={styles.tabs} textColor="primary" indicatorColor="primary">
          {props.labels.map((label, index) => (
            <Tab key={`tab-${index}`} label={label} index={index} />
          ))}
          {providerId && (
            <Stack direction="row" spacing={2} className={styles.adding_container}>
              <Typography>{`Adding ${t(label)}`}</Typography>
              <Image image_name={image_name} image_height={24} image_width={24} />
            </Stack>
          )}
        </MuiTabs>
      </Box>
      {props.labels.map((label, index) => (
        <TabPanel key={`tabpanel-${index}`} value={props.value} index={index}>
         <Outlet/>
        </TabPanel>
      ))}
    </Box>
  );
}
