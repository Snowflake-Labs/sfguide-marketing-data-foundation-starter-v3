import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { ColumnModel, ColumnType, TableModel } from 'dtos/ModelUI';
import { NullType } from 'dtos/NullType';
import { createContext, ReactNode, useMemo, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  findTableObjectInModelUI,
  getRelatedSourcesFromTargetTable,
  getTargetTablesInModelUI,
} from 'utils/MappingModel/ModelUIHelpers';

type EditMappingContext = {
  sources: TableModel[];
  target?: TableModel;
  columnToEdit?: ColumnModel;
  addColumnDefault: ColumnModel;
  setColumnToEdit: React.Dispatch<React.SetStateAction<ColumnModel | undefined>>;
  selectTargetObject: (tableObject: string, columnName: string) => void;
  selectedColumn?: ColumnModel;
  setSelectedColumn: React.Dispatch<React.SetStateAction<ColumnModel | undefined>>;
};

const defaultContext: EditMappingContext = {
  sources: [],
  target: undefined,
  selectTargetObject: () => undefined,
  columnToEdit: undefined,
  setColumnToEdit: () => undefined,
  addColumnDefault: { type: ColumnType.NULL, sqlType: 'NULL', columnName: '', object: '' },
  selectedColumn: undefined,
  setSelectedColumn: () => undefined,
};

const newTargetTableTemplate: TableModel = {
  object: '',
  tableName: 'NEW_TABLE',
  alias: 'NEW00',
  databaseName: NullType,
  schemaName: NullType,
  columns: [],
  type: 'target',
};

const addColumnDefault: ColumnModel = { type: ColumnType.NULL, sqlType: 'NULL', columnName: '', object: 'addColumn' };

const EditMappingContext = createContext<EditMappingContext>(defaultContext);

interface Props {
  children: ReactNode;
}

export function EditMappingContextWrapper(props: Props) {
  const location = useLocation();
  const { model, targetDatabaseSchema, sourceDatabaseSchema } = useMappingContext();
  const [sources, setSources] = useState<TableModel[]>(defaultContext.sources);
  const [target, setTarget] = useState<TableModel>();
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [columnToEdit, setColumnToEdit] = useState<ColumnModel>();
  const [selectedColumn, setSelectedColumn] = useState<ColumnModel>();

  const selectTargetObject = (object: string) => {
    const target = findTableObjectInModelUI(object, model);
    if (target) setTarget({ ...target });
  };

  const createNewTargetTable = () => {
    const [database, schema] = targetDatabaseSchema.split('.');
    const newTargetTable: TableModel = {
      ...newTargetTableTemplate,
      object: `${targetDatabaseSchema}.${newTargetTableTemplate.tableName}`,
      databaseName: database,
      schemaName: schema,
    };
    setTarget(newTargetTable);
  };

  useEffect(() => {
    if (!isModelInitialized) return;

    const locationArray = location.pathname.split('/');
    const isNewTargetTable = locationArray[locationArray.length - 1] == 'new';
    if (isNewTargetTable) {
      createNewTargetTable();
    } else if (location?.state?.selectedTableName) {
      selectTargetObject(location.state.selectedTableName);
    }
  }, [location, isModelInitialized]);

  useEffect(() => {
    if (!target || !sourceDatabaseSchema) return;
    const sources = getRelatedSourcesFromTargetTable(target, model);
    const [database, schema] = sourceDatabaseSchema.split('.');
    const filteredSources = sources.filter((table) => table.databaseName === database && table.schemaName === schema);
    setSources(filteredSources);
  }, [target, sourceDatabaseSchema]);

  useEffect(() => {
    if (!isModelInitialized && model.databases.length > 0) setIsModelInitialized(true);

    if (!target) {
      // Select first target as default if none is selected
      const targets = getTargetTablesInModelUI(model);
      if (targets.length > 0) setTarget(targets[0]);
    } else selectTargetObject(target.object);
  }, [model]);

  const sharedState: EditMappingContext = useMemo(
    () => ({
      sources,
      target,
      selectTargetObject,
      columnToEdit,
      setColumnToEdit,
      addColumnDefault,
      selectedColumn,
      setSelectedColumn,
    }),
    [sources, target, columnToEdit, selectedColumn]
  );

  return <EditMappingContext.Provider value={sharedState}>{props.children}</EditMappingContext.Provider>;
}

export function useEditMappingContext() {
  return useContext(EditMappingContext);
}
