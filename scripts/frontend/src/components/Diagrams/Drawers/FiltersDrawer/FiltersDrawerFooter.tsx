import styles from '../Drawer.module.scss';
import { Box } from '@mui/material';
import { Button } from 'components/common/Button/Button';
import { Body1 } from 'components/common/Text/TextComponents';
import { EventData } from 'dtos/EventData';
import { IMappingService } from 'interfaces/IMappingService';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useTranslation } from 'locales/i18n';
import { useState } from 'react';
import { conditionToProcessDefinition, mergeFilterInModelUI } from 'utils/MappingModel/ModelUIHelpers';
import { IFilterDrawerProps } from './FiltersDrawer';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';

interface Props extends IFilterDrawerProps {
  condition: string;
}

export default function WhereDrawerFooter(props: Props) {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();
  const { target } = useEditMappingContext();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);
  const mappingService = container.get<IMappingService>(TYPES.IMappingService);

  const handleOnSave = () => {
    if (!target) return;
    setIsLoading(true);
    const definition = conditionToProcessDefinition(props.table, target, props.condition, props.type);
    const processDefinition = Object.assign(definition.targets[0].definitions[0], { limit: 4 });
    mappingService
      .validateSql(processDefinition)
      .then(() => {
        const newModel = mergeFilterInModelUI(model, definition, target);
        pubSubService.emitEvent(EventData.Model.Save, newModel);

        props.setOpen?.(false);
        props.onClose?.();
      })
      .catch((e: { message: string }) => {
        setErrorMessage(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOnCancel = () => {
    props.onClose?.();
    pubSubService.emitEvent(EventData.Drawer.Mapping.Cancel);
  };

  return (
    <Box className={styles.actions}>
      <Box className={styles.errorContainer}>
        {errorMessage && (
          <Body1 color="error" className={styles.error}>
            {errorMessage}
          </Body1>
        )}
      </Box>
      <Button variant="outlined" onClick={handleOnCancel}>
        {t('BtnCancel')}
      </Button>
      <Button variant="contained" onClick={handleOnSave} isLoading={isLoading}>
        {t('BtnSave')}
      </Button>
    </Box>
  );
}
