import { MetricsBold, Subtitle2 } from 'components/common/Text/TextComponents';
import styles from './CardContent.module.scss';
import { useTranslation } from 'locales/i18n';
import { Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { container } from 'ioc/inversify.config';
import { IPubSubService } from 'interfaces/IPubSubService';
import { TYPES } from 'ioc/types';
import { EventData } from 'dtos/EventData';
import { CommonProps } from '@mui/material/OverridableComponent';

interface Props extends CommonProps {

}
  
export enum Severity {
    error = 'error',
    warning = 'warning',
    info = 'info',
    success = 'success'
}

export default function Notification (props: Props){
  const NOTIFICATION_TIMEOUT = 4000;
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService); 
  const [severity, setSeverity] = useState<Severity>(Severity.info);
  const [message, setMessage] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false); 

  const showNotification = (data: any) => {
    setSeverity(data.severity);
    setMessage(data.message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, NOTIFICATION_TIMEOUT);
  };

  useEffect(() => {
    pubSubService.subscribeToEvent(EventData.Notification.Show,'notification', showNotification);
  }, []);

  return (
    <>
    { open &&  <Alert className={props.className} severity={severity}>{message}</Alert>}
    </>
  );
}