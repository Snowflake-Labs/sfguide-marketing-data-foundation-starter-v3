import { SelectChangeEvent } from '@mui/material';
import { IMenuItem } from 'components/CustomSelect/CustomSelect';
import { IDatabaseService } from 'interfaces/IDatabaseService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import connectorCardModels from '../../../../data/connectorCardModels.json';
import { PathConstants } from 'routes/pathConstants';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';
import { ICustomTableProps } from 'components/CustomTable/CustomTable';
import Source from 'dtos/Source';

export const initCustomSelect: IMenuItem[] = [];

export const initCustomTableProps: ICustomTableProps = {
  columns: [''],
  data: [
    {
      name: '',
    },
  ],
  header: '',
  title: '',
};

export const initLinkDataLoading = {
  isLoadingDataBase: true,
  isLoadingSchema: false,
  isLoadingData: false,
};

export enum ConnectionState {
  isConnected,
  isNotConnected,
  noGrantAccess,
}

let source: Source;

export default function useLinkDataInSnowflake() {
  const { providerId, connectorId } = useParams();
  const { setSteps, activeSubStep } = useStepsContext();
  const navigate = useNavigate();

  const [customTableProps, setCustomTableProps] = useState(initCustomTableProps);

  const [databases, setDatabases] = useState(initCustomSelect);
  const [databaseSelected, setDatabaseSelected] = useState('');

  const [schemas, setSchemas] = useState(initCustomSelect);
  const [schemaSelected, setSchemaSelected] = useState('');

  const [connectorUsedSelected, setConnectorUsedSelected] = useState(connectorId ?? '');

  const [open, setOpen] = useState(false);
  const [connectionState, setConnectionState] = useState(ConnectionState.isNotConnected);
  const [linkDataLoading, setLinkDataLoading] = useState(initLinkDataLoading);

  const databaseService = container.get<IDatabaseService>(TYPES.IDatabaseService);

  useEffect(() => {
    (async () => {
      try {
        const newDatabases = await databaseService.getDatabases();
        setDatabases(newDatabases);
      } catch (error) {
        setDatabases(initCustomSelect);
      } finally {
        setLinkDataLoading((actual) => ({ ...actual, isLoadingDataBase: false }));
      }
    })();
    setSteps(0, 4);
  }, []);

  useEffect(() => {
    (async () => {
      if (databaseSelected.length > 0) {
        try {
          setLinkDataLoading((actual) => ({ ...actual, isLoadingSchema: true }));
          const newSchemas = await databaseService.getSchemasByDatabase(databaseSelected);
          setSchemas(newSchemas);
          if (ConnectionState.noGrantAccess === connectionState) {
            setConnectionState(ConnectionState.isNotConnected);
          }
        } catch (error) {
          setSchemas(initCustomSelect);
          setConnectionState(ConnectionState.noGrantAccess);
        } finally {
          setLinkDataLoading((actual) => ({ ...actual, isLoadingSchema: false }));
        }
      }
    })();
  }, [databaseSelected]);

  const memoConnectorsByProvider = useMemo(() => {
    const connectorsMapped: IMenuItem[] = [{ label: '-', value: '' }];
    connectorCardModels.forEach(({ accordionSections }) =>
      accordionSections.forEach(({ accordionCards }) =>
        accordionCards.forEach(({ label, key_name, providers }) => {
          if (providers?.some((provider) => providerId === provider)) connectorsMapped.push({ label, value: key_name });
        })
      )
    );
    return connectorsMapped;
  }, [providerId, connectorId]);

  const onChangeDataBase = (event: SelectChangeEvent<unknown>) => {
    setDatabaseSelected(event.target.value as string);
  };

  const onChangeSchema = (event: SelectChangeEvent<unknown>) => {
    setSchemaSelected(event.target.value as string);
  };

  const onChangeConnectorUsed = (event: SelectChangeEvent<unknown>) => {
    setConnectorUsedSelected(event.target.value as string);
  };

  const toggleDrawer = () => {
    setOpen((actual) => !actual);
  };

  const onClickBack = () => {
    setSteps(0, connectorId ? activeSubStep - 1 : 1);
    const backPath = connectorId
      ? `/${PathConstants.DATASOURCES}/${PathConstants.PROVIDERS}/${providerId}/${PathConstants.CONNECTORS}/${connectorId}`
      : `/${PathConstants.DATASOURCES}/${PathConstants.PROVIDERS}/${providerId}`;
    navigate(backPath);
  };

  const onClickContinue = () => {
    setSteps(1, 0);
    navigate(`/${PathConstants.DATASOURCES}/${source.SOURCE_ID}/${PathConstants.MODELS}/`, { state: { source } });
  };

  const onClickConnect = async () => {
    try {
      setLinkDataLoading((actual) => ({ ...actual, isLoadingData: true }));
      const { newCustomTable, newSource } = await databaseService.postSaveSource({
        PROVIDER_NAME: providerId!,
        CONNECTOR_NAME: connectorId ?? connectorUsedSelected,
        DATABASE: databaseSelected,
        SCHEMA: schemaSelected,
      });
      source = newSource;
      setConnectionState(ConnectionState.isConnected);
      setCustomTableProps(newCustomTable);
    } catch (error) {
      setConnectionState(ConnectionState.noGrantAccess);
      setCustomTableProps(initCustomTableProps);
    } finally {
      setLinkDataLoading((actual) => ({ ...actual, isLoadingData: false }));
    }
  };

  return {
    databases,
    databaseSelected,
    schemas,
    schemaSelected,
    connectorUsedSelected,
    open,
    connectionState,
    customTableProps,
    linkDataLoading,
    memoConnectorsByProvider,
    onChangeDataBase,
    onChangeSchema,
    onChangeConnectorUsed,
    toggleDrawer,
    onClickBack,
    onClickContinue,
    onClickConnect,
  };
}
