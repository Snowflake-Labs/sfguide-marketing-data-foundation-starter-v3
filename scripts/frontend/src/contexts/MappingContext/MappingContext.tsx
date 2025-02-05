import { EventData } from 'dtos/EventData';
import Model from 'dtos/Model';
import { ColumnRelation, JoinModel, ModelUI, TableModel } from 'dtos/ModelUI';
import Source from 'dtos/Source';
import { IDatabaseService } from 'interfaces/IDatabaseService';
import { IDataSourcesService } from 'interfaces/IDataSourcesService';
import { IMappingService } from 'interfaces/IMappingService';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  addTableModelToModelUI,
  fromColumnsSchemaInfoTableToTableModels,
  getTargetTablesInModelUI,
  removeTableFromMappingModel,
} from 'utils/MappingModel/ModelUIHelpers';
import { addJoinModelToModelUI, updateColumnRelationInModelUI } from 'utils/MappingModel/ModelUpdates';

type MappingContext = {
  model: ModelUI;
  sources: TableModel[];
  targetDatabaseSchema: string;
  sourceDatabaseSchema: string;
  sourceLoading: boolean;
  modelLoading: boolean;
  overlapSpinner: boolean;
  saving: boolean;
  setModelLoading: (loading: boolean) => void;
  setOverlapSpinner(overlapSpinner: boolean): void;
  targetTables: TableModel[];
};

const defaultContext: MappingContext = {
  model: {
    id: '',
    name: '',
    databases: [],
  },
  targetDatabaseSchema: '',
  sourceDatabaseSchema: '',
  sources: [],
  sourceLoading: true,
  modelLoading: true,
  overlapSpinner: false,
  saving: false,
  setModelLoading: () => {},
  setOverlapSpinner: () => {},
  targetTables: [],
};

const MappingContext = createContext<MappingContext>(defaultContext);

interface Props {
  children: ReactNode;
}

export function MappingContextWrapper(props: Props) {
  const { modelId, sourceId } = useParams();

  const [model, setModel] = useState(defaultContext.model);
  const [sources, setSources] = useState(defaultContext.sources);
  const [targetDatabaseSchema, setTargetDatabaseSchema] = useState(defaultContext.targetDatabaseSchema);
  const [sourceDatabaseSchema, setSourceDatabaseSchema] = useState(defaultContext.sourceDatabaseSchema);
  const [modelLoading, setModelLoading] = useState(false);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [overlapSpinner, setOverlapSpinner] = useState(false);
  const [saving, setSaving] = useState(defaultContext.saving);
  const [isAutoSave, setIsAutoSave] = useState(false);
  const [targetTables, setTargetTables] = useState<TableModel[]>([]);

  const mappingService = container.get<IMappingService>(TYPES.IMappingService);
  const databaseService = container.get<IDatabaseService>(TYPES.IDatabaseService);
  const sourcesService = container.get<IDataSourcesService>(TYPES.IDataSources);
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  useEffect(() => {
    setTargetTables(getTargetTablesInModelUI(model));
  }, [model]);

  const getModelUI = () => {
    if (!modelId || model.id == modelId || modelLoading) return;
    setModelLoading(true);
    mappingService
      .getModelById(Number(modelId))
      .then((table) => {
        if (!table?.MODEL_UI) return;
        setModel(table.MODEL_UI);
        setTargetDatabaseSchema(`${table.TARGET_DATABASE}.${table.TARGET_SCHEMA}`);
      })
      .finally(() => setModelLoading(false));
  };

  const getSource = () => {
    if (!sourceId) return;
    sourcesService.getSource(sourceId).then((source: Source) => {
      setSourceDatabaseSchema(`${source.DATABASE}.${source.SCHEMA}`);
    });
    // TODO handle if source is not found, SIT-2052
  };

  const getSourceSchema = () => {
    if (!modelId || !sourceId || sourceLoading) return;
    setSourceLoading(true);
    databaseService
      .getColumnsSchemaInformation(modelId, sourceId)
      .then((data) => {
        const sources = fromColumnsSchemaInfoTableToTableModels(data);
        setSources(sources);
      })
      .finally(() => setSourceLoading(false));
  };

  const saveModel = (model: ModelUI) => {
    setSaving(true);
    const target = targetDatabaseSchema.split('.');
    const targetModel: Model = {
      MODEL_NAME: model.name,
      MODEL_UI: model,
      TARGET_DATABASE: target[0],
      TARGET_SCHEMA: target[1],
    };
    mappingService
      .updateDataModel(Number(model.id), targetModel)
      .then(() => pubSubService.emitEvent(EventData.Model.AfterSave, { success: true }))
      .catch((e) => pubSubService.emitEvent(EventData.Model.AfterSave, { success: false, error: e }))
      .finally(() => setSaving(false));
  };

  const handleAddJoin = ({ joinModel, from }: { joinModel: JoinModel; from: TableModel }) => {
    setModel((prev) => addJoinModelToModelUI(prev, joinModel, from));
    setIsAutoSave(true);
  };

  const handleAddMapping = ({ mapModel }: { mapModel: ColumnRelation }) => {
    setModel((prev) => updateColumnRelationInModelUI(prev, mapModel, sourceDatabaseSchema));
    setIsAutoSave(true);
  };

  const handleAddTable = ({ table }: { table: TableModel }) => {
    setModel((prev) => addTableModelToModelUI(prev, table));
    setIsAutoSave(true);
  };

  const handleAddLocalTable = ({ table }: { table: TableModel }) => {
    setModel((prev) => addTableModelToModelUI(prev, table));
  };

  const handleRemoveLocalTable = ({ tableId }: { tableId: string }) => {
    setModel((prev) => removeTableFromMappingModel(prev, tableId));
  };

  const handleSaveModel = (model: ModelUI) => {
    setModel({ ...model });
    setIsAutoSave(true);
  };

  const handleSaveAsyncModel = (model: ModelUI) => {
    pubSubService.subscribeToEvent(EventData.Model.AfterSave, 'map-context', ({ success }: { success: boolean }) => {
      if (success) setModel({ ...model });
      pubSubService.unsubscribeFromEvent(EventData.Model.AfterSave, 'map-context');
    });
    saveModel(model);
  };

  useEffect(getModelUI, [modelId]);

  useEffect(getSource, [sourceId]);

  useEffect(getSourceSchema, [sourceDatabaseSchema, modelId, sourceId]);

  useEffect(() => {
    if (modelLoading || !isAutoSave) return;
    saveModel(model);
    setIsAutoSave(false);
  }, [model]);

  // Runs on initialization
  useEffect(() => {
    pubSubService.subscribeToEvent(EventData.Drawer.Join.Save, 'map-context', handleAddJoin);
    pubSubService.subscribeToEvent(EventData.Drawer.Mapping.Save, 'map-context', handleAddMapping);
    pubSubService.subscribeToEvent(EventData.Model.Save, 'map-context', handleSaveModel);
    pubSubService.subscribeToEvent(EventData.Model.SaveAsync, 'map-context', handleSaveAsyncModel);
    pubSubService.subscribeToEvent(EventData.Diagram.Node.Add, 'map-context', handleAddTable);
    pubSubService.subscribeToEvent(EventData.Model.Table.Add, 'map-context', handleAddTable);
    pubSubService.subscribeToEvent(EventData.Diagram.TemporaryNode.Add, 'map-context', handleAddLocalTable);
    pubSubService.subscribeToEvent(EventData.Diagram.TemporaryNode.Remove, 'map-context', handleRemoveLocalTable);
  }, [targetDatabaseSchema, sourceDatabaseSchema]);

  const sharedState: MappingContext = useMemo(
    () => ({
      model,
      sources,
      targetDatabaseSchema,
      sourceDatabaseSchema,
      modelLoading,
      sourceLoading,
      saving,
      overlapSpinner,
      setModelLoading,
      setOverlapSpinner,
      targetTables,
    }),
    [model, sources, modelLoading, sourceLoading, saving]
  );

  return <MappingContext.Provider value={sharedState}>{props.children}</MappingContext.Provider>;
}

export function useMappingContext() {
  return useContext(MappingContext);
}
