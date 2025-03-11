import styles from '../Drawer.module.scss';
import { Box } from '@mui/material';
import { DrawerProps } from 'components/CustomDrawer/Drawer';
import { Button } from 'components/common/Button/Button';
import { Body1 } from 'components/common/Text/TextComponents';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';
import { EventData } from 'dtos/EventData';
import { JoinQuery } from 'dtos/JoinQuery';
import { IMappingService } from 'interfaces/IMappingService';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useTranslation } from 'locales/i18n';
import { useState } from 'react';
import { fromJoinQueryToJoinModel, fromJoinQueryToProcessDefinition } from 'utils/MappingModel/ModelUIHelpers';

interface Props extends DrawerProps {
  code: string;
  joinQuery: JoinQuery;
}

export default function JoinDrawerFooter(props: Props) {
  const { t } = useTranslation('common');
  const { target } = useEditMappingContext();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>();

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);
  const mappingService = container.get<IMappingService>(TYPES.IMappingService);

  const handleOnSave = () => {
    const queryClause = props.code.replaceAll('\n', ' ').trim();
    const definition = fromJoinQueryToProcessDefinition(props.joinQuery, queryClause);
    setIsLoading(true);
    mappingService
      .validateSql(definition)
      .then(() => {
        const joinModel = fromJoinQueryToJoinModel(props.joinQuery, queryClause, target);
        pubSubService.emitEvent(EventData.Drawer.Join.Save, { joinModel: joinModel, from: props.joinQuery.target });
        props.setOpen?.(false);
        props.onClose?.();
      })
      .catch((e: { message: string }) => {
        setMessage(e.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleOnCancel = () => {
    props.onClose?.();
    pubSubService.emitEvent(EventData.Drawer.Join.Cancel);
  };

  return (
    <Box className={styles.actions}>
      {message && <Body1 color="error">{message}</Body1>}
      <Button variant="outlined" onClick={handleOnCancel}>
        {t('BtnCancel')}
      </Button>
      <Button variant="contained" onClick={handleOnSave} isLoading={isLoading}>
        {t('BtnSave')}
      </Button>
    </Box>
  );
}
