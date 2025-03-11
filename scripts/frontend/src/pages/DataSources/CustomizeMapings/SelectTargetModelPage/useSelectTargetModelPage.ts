import { SelectChangeEvent } from '@mui/material';
import { InitialMenuItems } from 'components/CustomSelect/CustomSelect';
import { useProcessProgressContext } from 'contexts/MappingContext/ProcessProgressContext';
import Model from 'dtos/Model';
import { ModelUI } from 'dtos/ModelUI';
import { IMappingService } from 'interfaces/IMappingService';
import { ISnowflakeService } from 'interfaces/ISnowflakeService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useEffect, ChangeEvent, useState, ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const initialMappingTables: Model[] = [];

const initialCustomDrawerState = {
  isOpen: false,
  isLoading: false,
};

const initialModelState = {
  isLoadingModels: true,
  modelNameValue: '',
  models: initialMappingTables,
};

const initialDatabaseState = {
  isDatabaseLoading: false,
  databaseValue: '',
  databases: InitialMenuItems,
};

const initialSchemaState = {
  isSchemaLoading: false,
  schemaValue: '',
  schemas: InitialMenuItems,
};

export default function useSelectTargetModelPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [customDrawer, setCustomDrawer] = useState(initialCustomDrawerState);
  const [model, setModel] = useState(initialModelState);
  const [database, setDatabase] = useState(initialDatabaseState);
  const [schema, setSchema] = useState(initialSchemaState);
  const mappingService = container.get<IMappingService>(TYPES.IMappingService);
  const snowflakeServices = container.get<ISnowflakeService>(TYPES.ISnowflakeService);
  const { ApplyAndContinueProcess } = useProcessProgressContext();
  const { sourceId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        if (!sourceId) return;
        setModel((state) => ({ ...state, isLoadingModels: true }));
        const models = await mappingService.getAllModels(sourceId);
        setModel((state) => ({ ...state, models, isLoadingModels: false }));
      } catch (error) {
        setModel((state) => ({ ...state, isLoadingModels: false }));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!customDrawer.isOpen) return;
        setDatabase((state) => ({ ...state, isDatabaseLoading: true }));
        const databases = await snowflakeServices.get_databases();
        setDatabase((state) => ({ ...state, databases, isDatabaseLoading: false }));
      } catch (error) {
        setDatabase((state) => ({ ...state, isDatabaseLoading: false }));
      }
    })();
  }, [customDrawer.isOpen]);

  useEffect(() => {
    (async () => {
      try {
        if (!database.databaseValue) return;
        setSchema((state) => ({ ...state, isSchemaLoading: true }));
        const schemas = await snowflakeServices.get_schemas(database.databaseValue);
        setSchema((state) => ({ ...state, schemas, isSchemaLoading: false }));
      } catch (error) {
        setSchema((state) => ({ ...state, isSchemaLoading: false }));
      }
    })();
  }, [database.databaseValue]);

  const handleModelApply = async (model: ModelUI) => {
    ApplyAndContinueProcess(model);
  };

  const handleModelShow = async (modelId: number) => {
    if (location.state?.source) {
      setModel((state) => ({ ...state, isLoadingModels: true }));
      await mappingService.updateSourceModelID(location.state.source.SOURCE_ID, modelId);
      setModel((state) => ({ ...state, isLoadingModels: false }));
    }

    navigate(String(modelId));
  };

  const toogleCustomDrawer = () => {
    setCustomDrawer((state) => ({ ...state, isOpen: !state.isOpen }));
  };

  const onCreateClick = async () => {
    try {
      if (!sourceId) return;
      setCustomDrawer((state) => ({ ...state, isLoading: true }));
      const targetModel: Model = {
        MODEL_NAME: model.modelNameValue,
        TARGET_DATABASE: database.databaseValue,
        TARGET_SCHEMA: schema.schemaValue,
        MODEL_UI: {
          id: '',
          name: model.modelNameValue,
          databases: [
            {
              databaseName: database.databaseValue,
              schemas: [{ schemaName: schema.schemaValue, databaseName: database.databaseValue, tables: [] }],
            },
          ],
        },
      };
      mappingService.createModel(targetModel);
      const models = await mappingService.getAllModels(sourceId);
      setModel((state) => ({ ...state, models: models }));
      setCustomDrawer((state) => ({ ...state, isOpen: false, isLoading: false }));
    } catch (error) {
      setCustomDrawer((state) => ({ ...state, isOpen: true, isLoading: false }));
    }
  };

  const validateTextFields = () =>
    model.modelNameValue === '' || database.databaseValue === '' || schema.schemaValue === '';

  const onSelectFieldChange = (textFieldId: string) => (event: SelectChangeEvent<unknown>, _child: ReactNode) => {
    const value = event.target.value as string;
    switch (textFieldId) {
      case 'Database':
        setDatabase((state) => ({ ...state, databaseValue: value }));
        break;
      case 'Schema':
        setSchema((state) => ({ ...state, schemaValue: value }));
    }
  };

  const onTextFildChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setModel((state) => ({ ...state, modelNameValue: value }));
  };

  return {
    model,
    database,
    schema,
    customDrawer,
    onCreateClick,
    handleModelApply,
    handleModelShow,
    toogleCustomDrawer,
    onSelectFieldChange,
    onTextFildChange,
    validateTextFields,
  };
}
