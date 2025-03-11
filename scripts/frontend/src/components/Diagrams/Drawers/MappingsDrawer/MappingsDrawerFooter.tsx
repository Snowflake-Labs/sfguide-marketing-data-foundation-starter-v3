import styles from '../Drawer.module.scss';
import { Box } from '@mui/material';
import { DrawerProps } from 'components/CustomDrawer/Drawer';
import { Button } from 'components/common/Button/Button';
import { Body1 } from 'components/common/Text/TextComponents';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { EventData } from 'dtos/EventData';
import { ColumnRelation, MappingType, ModelUI } from 'dtos/ModelUI';
import { IMappingService } from 'interfaces/IMappingService';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useTranslation } from 'locales/i18n';
import { useMemo, useState } from 'react';
import { columnRelationToStandardMappingModel } from 'utils/MappingModel/ModelValidations';
import getColumnsUsedInFormula from './Helpers';

interface Props extends DrawerProps {
  transformation: ColumnRelation | undefined;
}

export default function MappingsDrawerFooter(props: Props) {
  const { t } = useTranslation('common');
  const { model } = useMappingContext();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);
  const mappingService = container.get<IMappingService>(TYPES.IMappingService);
  const { sourceDatabaseSchema } = useMappingContext();
  const [sourceDatabase, sourceSchema] = useMemo(() => {
    return sourceDatabaseSchema.split('.');
  }, [sourceDatabaseSchema]);

  const handleOnSave = () => {
    if (!props.transformation) return;
    let columnRelationTransformation: ColumnRelation = props.transformation;
    setIsLoading(true);
    if (props.transformation.type === MappingType.Formula) {
      const columnTransformation = getColumnsUsedInFormula(props.transformation.mapping, model);
      columnRelationTransformation.sources = columnTransformation?.columns ?? props.transformation.sources;
    }
    const definition = columnRelationToStandardMappingModel(columnRelationTransformation, model);
    if (!definition) return;
    mappingService
      .validateMapping(definition, sourceDatabase, sourceSchema)
      .then(() => {
        pubSubService.emitEvent(EventData.Drawer.Mapping.Save, { mapModel: columnRelationTransformation });
        props.setOpen?.(false);
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
      <Button variant="contained" onClick={handleOnSave} isLoading={isLoading} disabled={!props.transformation}>
        {t('BtnSave')}
      </Button>
    </Box>
  );
}
