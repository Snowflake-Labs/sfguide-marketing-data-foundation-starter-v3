import { ColumnSchemaInfoTable } from 'dtos/ColumnSchemaInfoTable';
import { JoinQuery } from 'dtos/JoinQuery';
import {
  ColumnModel,
  ColumnType,
  JoinModel,
  ModelUI,
  TableMetadata,
  TableModel,
  ColumnRelation,
  SchemaModel,
  ColumnMetadata,
  MappingType,
  Condition,
  SimpleTableMetadata,
} from 'dtos/ModelUI';
import { ProcessDefinition, ProcessDefinitionJoin } from 'dtos/Process';
import { ColumnMappings } from 'dtos/SqlColumnTypes';
import { StandardMappingModel } from 'dtos/StandardMappingModel';
import { NullType } from 'dtos/NullType';
import { JoinTypes } from 'dtos/JoinDefinition';

/**
 * Adds a table model to the mapping model.
 * @param model The mapping model to add the table to.
 * @param table The table to add to the model.
 * @returns The updated mapping model.
 */
export function addTableModelToModelUI(model: ModelUI, table: TableModel): ModelUI {
  const isAlreadyAdded = findTableModelInModelUI(table, model);
  if (isAlreadyAdded) return model;
  const schema = getOrCreateSchemaInModelUI(model, table.schemaName, table.databaseName);
  schema.tables.push(table);
  return { ...model };
}

/**
 * Edits or creates a table model in a mapping model.
 * @param model The mapping model to add the table to.
 * @param table The table to add to the model.
 * @param prevTable The previous table to remove from the model.
 * @returns The updated mapping model.
 */

export function editTableModelToModelUI(model: ModelUI, table: TableModel, prevTable: TableModel): ModelUI {
  removeTableFromMappingModel(model, prevTable.object);
  const schema = getOrCreateSchemaInModelUI(model, table.schemaName, table.databaseName);
  schema.tables.push(table);
  return { ...model };
}

/**
 * Get all the related sources from a target table in the mapping model.
 * @param targetTable The target table to get the related sources from.
 * @param model The mapping model to search for the related sources.
 * @returns The related source tables.
 */
export function getRelatedSourcesFromTargetTable(targetTable: TableModel, model: ModelUI): TableModel[] {
  const unique: string[] = [];
  const relatedSources: TableModel[] = [];
  getRelatedSourcesFromTargetTableMappings(targetTable, model, unique, relatedSources);
  const allTables = [targetTable, ...relatedSources];
  getRecursiveSourcesFromTableJoins(allTables, model, unique, relatedSources, targetTable);
  return relatedSources;
}

/**
 * Converts a JoinQuery and code into a ProcessDefinition object.
 * @param joinQuery - The JoinQuery object.
 * @param code - The code string.
 * @returns The ProcessDefinition object.
 */
export function fromJoinQueryToProcessDefinition(joinQuery: JoinQuery, joinClause: string): ProcessDefinition {
  const definition: ProcessDefinition = {
    columns: ['*'],
    join: [
      {
        alias: joinQuery.target?.alias ?? '',
        on: joinClause,
        object: joinQuery.target?.object ?? '',
        type: joinQuery.type,
      },
    ],
    source: {
      alias: joinQuery.source?.alias ?? '',
      object: joinQuery.source?.object ?? '',
    },
  };
  return definition;
}

/**
 * Converts an array of ColumnSchemaInfoTable objects into an array of TableModel objects.
 * @param columnsSchemaInfoTable - The array of ColumnSchemaInfoTable objects.
 * @returns The array of TableModel objects.
 */
export function fromColumnsSchemaInfoTableToTableModels(columnsSchemaInfoTable: ColumnSchemaInfoTable[]): TableModel[] {
  return columnsSchemaInfoTable.map<TableModel>((table, index) => {
    let object = `${table.TABLE_CATALOG}.${table.TABLE_SCHEMA}.${table.TABLE_NAME}`;
    return {
      type: 'source',
      columns: table.COLUMNS.map<ColumnModel>((column) => ({
        type: ColumnMappings[column.DATA_TYPE],
        sqlType: column.DATA_TYPE,
        columnName: column.COLUMN_NAME,
        object: object,
      })),
      alias: '',
      object: object,
      tableName: table.TABLE_NAME,
      schemaName: table.TABLE_SCHEMA,
      databaseName: table.TABLE_CATALOG,
    };
  });
}

/**
 * Finds a table model in the given ModelUI based on the provided TableMetadata.
 *
 * @param table - The TableMetadata object representing the table to search for.
 * @param model - The ModelUI object to search within.
 * @returns The found TableModel object if it exists, otherwise undefined.
 */
export function findTableModelInModelUI(table: TableMetadata, model: ModelUI): TableModel | undefined {
  return model.databases
    .find((db) => db.databaseName === table.databaseName)
    ?.schemas.find((schema) => schema.schemaName === table.schemaName)
    ?.tables.find((t) => t.object === table.object);
}

/**
 * Finds a table object in the ModelUI.
 *
 * @param tableObject - The table object to search for.
 * @param model - The ModelUI to search in.
 * @returns The found TableModel or undefined if not found.
 */
export function findTableObjectInModelUI(tableObject: string, model: ModelUI): TableModel | undefined {
  const [database, schema, table] = tableObject.split('.');
  return findTableModelInModelUI(
    { alias: '', object: tableObject, tableName: table, databaseName: database, schemaName: schema },
    model
  );
}

/**
 * Finds a table join in the ModelUI based on the provided table object.
 *
 * @param tableObject - The table object to search for in the ModelUI.
 * @param model - The ModelUI object to search in.
 * @returns An object containing the found table and a boolean indicating if it is a join.
 */
export function findJoinInModelUI(tableObject: string, model: ModelUI, targetTable: string): JoinModel | undefined {
  for (const db of model.databases) {
    for (const sch of db.schemas) {
      for (const t of sch.tables) {
        for (const join of t.joins ?? []) {
          if (join.from.object === tableObject && join.target.object === targetTable) {
            return join;
          }
        }
      }
    }
  }
}

export function findColumnModelInModelUI(model: ModelUI, column: ColumnMetadata): ColumnModel | undefined {
  return findTableObjectInModelUI(column.object, model)?.columns.find((c) => c.columnName === column.columnName);
}

export function findTableObjectInModelUIUsingColumns(
  columns: ColumnMetadata[],
  model: ModelUI
): TableModel | undefined {
  for (let column of columns) {
    let table = findTableObjectInModelUI(column.object, model);
    if (table) return table;
  }
}

/**
 * Generates a table model map based on the provided ModelUI.
 *
 * @param model - The ModelUI object to generate the table model map from.
 * @returns A Map object containing the table models, with the table object as the key.
 */
export function generateTableModelRecord(model: ModelUI): Record<string, TableModel> {
  const tableMap: Record<string, TableModel> = {};
  model.databases.forEach((db) => {
    db.schemas.forEach((schema) => {
      schema.tables.forEach((table) => {
        tableMap[table.object] = table;
      });
    });
  });
  return tableMap;
}

/**
 * Finds tables in the ModelUI using the provided columns.
 *
 * @param columns - An array of ColumnMetadata objects.
 * @param model - The ModelUI object.
 * @returns An array of TableModel objects that match the provided columns.
 */
export function mapColumnsToProcessDefinitionJoins(columns: ColumnMetadata[], model: ModelUI): ProcessDefinitionJoin[] {
  if (!columns) return [];

  const processDefinitionJoin = new Map<string, ProcessDefinitionJoin>();
  const tableMap = new Map<string, TableModel>();

  // Create a map for quick lookup
  // TODO: this could be cached for performance improvements if needed
  model.databases.forEach((db) => {
    db.schemas.forEach((schema) => {
      schema.tables.forEach((table) => {
        tableMap.set(table.object, table);
      });
    });
  });

  for (let column of columns) {
    const tableObject = column.object.split('.').slice(0, 3).join('.');
    const table = tableMap.get(tableObject);
    if (table)
      processDefinitionJoin.set(table.object, {
        alias: table.alias,
        object: table.object,
        on: table.object,
        type: JoinTypes.INNER,
      });
  }
  return Array.from(processDefinitionJoin.values());
}

export function getTargetTablesInModelUI(model: ModelUI): TableModel[] {
  return model.databases.flatMap((db) =>
    db.schemas.flatMap((schema) => schema.tables.filter((table) => table.type === 'target'))
  );
}

export function getSourceTablesInModelUI(model: ModelUI): TableModel[] {
  return model.databases.flatMap((db) =>
    db.schemas.flatMap((schema) => schema.tables.filter((table) => table.type === 'source'))
  );
}

function getRelatedSourcesFromTargetTableMappings(
  targetTable: TableModel,
  model: ModelUI,
  unique: string[],
  relatedSources: TableModel[]
): TableModel[] {
  targetTable.mappings?.forEach((mapping) => {
    mapping.sources?.forEach((source) => {
      let sourceTableObject = source.object;
      if (unique.includes(sourceTableObject)) return;
      unique.push(sourceTableObject);
      let sourceTable = findTableObjectInModelUI(sourceTableObject, model);
      if (!sourceTable) return;
      relatedSources.push(sourceTable);
    });
  });
  return relatedSources;
}

export function getSpecialTableSourcesFromMappings(
  targetTables: TableModel[],
  sourceDatabaseSchema: string
): TableModel[] {
  const tablesMap = new Map<string, TableModel>();

  targetTables.forEach((targetTable) => {
    targetTable.mappings?.forEach((mapping) => {
      if (mapping.type === MappingType.Column) return;
      const object = `..${mapping.type}`;
      const isFromSource = mapping.sources?.some((source) => source.object.startsWith(sourceDatabaseSchema));

      if (mapping.type === MappingType.Formula) {
        if (isFromSource) {
          const tableName = `${mapping.type}-${mapping.mapping}`;
          tablesMap.set(tableName, {
            type: mapping.type,
            columns: [],
            alias: '',
            object: `${object}-${mapping.mapping}`,
            tableName,
            schemaName: '',
            databaseName: '',
          });
        }
      } else if (!tablesMap.has(mapping.type)) {
        tablesMap.set(mapping.type, {
          type: mapping.type,
          columns: [],
          alias: '',
          object: object,
          tableName: mapping.type,
          schemaName: '',
          databaseName: '',
        });
      }
      const columnType = targetTable.columns.find((c) => c.columnName === mapping.target.columnName) || {
        type: ColumnType.NULL,
        sqlType: ColumnType.NULL,
      };

      const tableColumns = tablesMap.get(mapping.type)?.columns;
      if (isFromSource && tableColumns && !tableColumns.find((c) => c.columnName === mapping.mapping)) {
        tableColumns.push({
          type: mapping.mapping != 'NULL' ? columnType.type : ColumnType.NULL,
          sqlType: mapping.mapping != 'NULL' ? columnType.sqlType : 'NULL',
          columnName: mapping.displayValue ?? mapping.mapping,
          object: object,
        });
      }
    });
  });

  if (tablesMap.get(MappingType.Static)?.columns.length === 0) tablesMap.delete(MappingType.Static);
  if (tablesMap.get(MappingType.Variable)?.columns.length === 0) tablesMap.delete(MappingType.Variable);
  return Array.from(tablesMap.values());
}

function getRecursiveSourcesFromTableJoins(
  tables: TableModel[],
  model: ModelUI,
  unique: string[],
  relatedSources: TableModel[],
  targetTable: TableModel
): TableModel[] {
  tables.forEach((table) => {
    table?.joins?.forEach((join) => {
      let nextTableObject = join.from.object;
      let isFromTarget = join.target.object === targetTable.object;
      if (!isFromTarget || unique.includes(nextTableObject)) return;
      unique.push(nextTableObject);
      let nextTable = findTableObjectInModelUI(nextTableObject, model);
      if (!nextTable) return;
      tables.push(nextTable);
      relatedSources.push(nextTable);
      getRecursiveSourcesFromTableJoins(tables, model, unique, relatedSources, targetTable);
    });
  });
  return relatedSources;
}

function getOrCreateDatabaseInModelUI(model: ModelUI, databaseName: string) {
  let database = model.databases.find((db) => db.databaseName === databaseName);
  if (!database) {
    database = { databaseName: databaseName, schemas: [] };
    model.databases.push(database);
  }
  return database;
}

function getOrCreateSchemaInModelUI(model: ModelUI, schemaName: string, databaseName: string) {
  let database = getOrCreateDatabaseInModelUI(model, databaseName);
  let schema = database.schemas.find((schema) => schema.schemaName === schemaName);
  if (!schema) {
    schema = { schemaName: schemaName, databaseName: databaseName, tables: [] };
    database.schemas.push(schema);
  }
  return schema;
}

function getTableMetadata(table: TableModel): TableMetadata {
  return {
    alias: table.alias,
    object: table.object,
    tableName: table.tableName,
    databaseName: table.databaseName,
    schemaName: table.schemaName,
  };
}

export default function getAliasFromTableName(tableName: string, index: number): string {
  return `${tableName.replaceAll('_', '').slice(0, 3).toUpperCase()}${index < 10 ? '0' : ''}${index}`;
}

export function getAliasFromTableMetadata(model: ModelUI, table: TableMetadata): string {
  if (table.alias) return table.alias;
  const index = countTablesInModelUI(model) + 1;
  return `${table.tableName.replaceAll('_', '').slice(0, 3).toUpperCase()}${index < 10 ? '0' : ''}${index}`;
}

export function AddColumnModelInModelUI(newColumnModel: ColumnModel, model: ModelUI) {
  const targetTable = findTableObjectInModelUI(newColumnModel.object, model);
  const isDuplicated = targetTable?.columns.find((column) => column.columnName === newColumnModel.columnName);
  if (!targetTable || isDuplicated) return model;
  targetTable.columns = targetTable.columns ? [...targetTable.columns, newColumnModel] : [newColumnModel];
  return { ...model };
}

export function UpdateColumnModelInModelUI(previousColumn: ColumnModel, newColumnModel: ColumnModel, model: ModelUI) {
  const targetTable = findTableObjectInModelUI(newColumnModel.object, model);
  const isDuplicated = targetTable?.columns
    .filter((column) => {
      column != previousColumn;
    })
    .find((column) => column.columnName === newColumnModel.columnName);
  const columnIndex = targetTable?.columns.findIndex((column) => column.columnName === previousColumn.columnName);
  if (!targetTable || isDuplicated || columnIndex === undefined || columnIndex < 0) return model;
  const newColumns = [
    ...targetTable.columns.slice(0, columnIndex),
    newColumnModel,
    ...targetTable.columns.slice(columnIndex + 1),
  ];
  targetTable.columns = [...newColumns];
  targetTable.mappings = targetTable.mappings?.map((mapping) => {
    if (mapping.target.columnName === previousColumn.columnName) {
      mapping.target.columnName = newColumnModel.columnName;
    }
    return mapping;
  });
  return { ...model };
}

export function updateTableFromMappingModel(
  model: ModelUI,
  targetTableObjectToUpdate: string,
  newTableName: string,
  newTableObject: string,
  alias: string
) {
  const [database, schema] = targetTableObjectToUpdate.split('.');
  model.databases.forEach((db) => {
    if (db.databaseName !== database) return;
    db.schemas.forEach((sch) => {
      if (sch.schemaName !== schema) return;
      sch.tables.forEach((table) => {
        if (table.object === targetTableObjectToUpdate) {
          updateObjectInTableAttributes(table, newTableName, newTableObject, alias);
        }
      });
    });
  });

  return { ...model };
}

function updateObjectInTableAttributes(table: TableModel, newTableName: string, newTableObject: string, alias: string) {
  table.joins?.forEach((join) => {
    if (join.target.object === table.object) {
      join.target.alias = alias;
      join.target.object = newTableObject;
      join.target.tableName = newTableName;
    }
  });
  table.mappings?.forEach((mapping) => {
    if (mapping.target.object === table.object) {
      mapping.target.object = newTableObject;
    }
  });
  table.columns.forEach((column) => {
    column.object = newTableObject;
  });
  table.alias = alias;
  table.tableName = newTableName;
  table.object = newTableObject;
}

export function addNewTableToMappingModel(
  model: ModelUI,
  targetDatabase: string,
  targetSchema: string,
  newTableName: string,
  newTableObject: string,
  alias: string
) {
  const newTable: TableModel = {
    databaseName: targetDatabase,
    schemaName: targetSchema,
    object: newTableObject,
    tableName: newTableName,
    type: 'target',
    alias: alias,
    columns: [],
  };
  const schema = getOrCreateSchemaInModelUI(model, targetSchema, targetDatabase);
  schema.tables.push(newTable);
  return { ...model };
}

/**
 * Removes table from the mapping model.
 * @param model - The mapping model to modify.
 * @param targetTableObjectToDelete - The name of the target table to delete.
 * @returns The updated mapping model with the target table removed.
 */
export function removeTableFromMappingModel(model: ModelUI, targetTableObjectToDelete: string) {
  const [database, schema] = targetTableObjectToDelete.split('.');

  model.databases.forEach((db) => {
    if (db.databaseName !== database) return;
    db.schemas.forEach((sch) => {
      if (sch.schemaName !== schema) return;
      sch.tables = sch.tables.filter((t) => t.object !== targetTableObjectToDelete);
    });
  });

  return { ...model };
}

export function fromJoinQueryToJoinModel(
  joinQuery: JoinQuery,
  joinClause: string,
  target?: TableMetadata
): JoinModel | undefined {
  if (!joinQuery.source || !joinQuery.target || !target) return;
  return {
    target: {
      alias: target.alias,
      object: target.object,
      tableName: target.tableName,
      schemaName: target.schemaName,
      databaseName: target.databaseName,
    },
    from: {
      alias: joinQuery.target.alias,
      object: joinQuery.target.object,
      tableName: joinQuery.target.tableName,
      schemaName: joinQuery.target.schemaName,
      databaseName: joinQuery.target.databaseName,
    },
    to: {
      alias: joinQuery.source.alias,
      object: joinQuery.source.object,
      tableName: joinQuery.source.tableName,
      schemaName: joinQuery.source.schemaName,
      databaseName: joinQuery.source.databaseName,
    },
    type: joinQuery.type,
    on: joinClause,
  };
}

/**
 * Replaces columns in the mapping model from the sources.
 * @param model The mapping model to replace the columns.
 * @param sources The sources to replace the columns.
 * @returns The updated mapping model.
 */
export function addColumnsFromSourcesToModelUI(model: ModelUI, sources: TableModel[]): ModelUI {
  if (sources.length === 0) return model;
  getSourceTablesInModelUI(model).forEach((source) => {
    let sourceMatch = sources.find((s) => s.object === source.object);
    source.columns = source.columns
      .concat(sourceMatch?.columns ?? [])
      .filter((value, index, self) => self.findIndex((t) => t.columnName === value.columnName) === index)
      .sort((a, b) => a.columnName.localeCompare(b.columnName));
  });
  return { ...model };
}

export function conditionToProcessDefinition(
  table: TableModel,
  target: TableMetadata | undefined,
  condition: string | undefined,
  type: 'Qualify' | 'Where' | undefined,
  allColumns: boolean = true,
  limit: number | undefined = undefined
): StandardMappingModel {
  const definition: StandardMappingModel = {
    targets: [
      {
        process_name: '',
        process_type_id: 3,
        labels: [''],
        settings: { target_interval: '', target_lag: 0, warehouse: '' },
        target: {
          alias: '',
          object: '',
          columns: [
            {
              name: '',
              type: NullType,
            },
          ],
        },
        definitions: [
          {
            columns: allColumns ? ['*'] : table.columns.map((column) => column.columnName),
            source: {
              alias: table.alias,
              object: table.object,
              where: type === 'Where' ? condition : findWhereOfTargetInTable(table, target)?.value,
              qualify: type === 'Qualify' ? condition : findQualifyOfTargetInTable(table, target)?.value,
            },
          },
        ],
      },
    ],
  };
  if (limit) {
    definition.targets[0].definitions[0]['limit'] = limit;
  }
  return definition;
}

export function mergeFilterInModelUI(
  model: ModelUI,
  filterProcess: StandardMappingModel,
  target: SimpleTableMetadata
): ModelUI {
  const [database, schema, table] = filterProcess.targets[0].definitions[0].source.object.split('.');
  const where = filterProcess.targets[0].definitions[0].source.where;
  const qualify = filterProcess.targets[0].definitions[0].source.qualify;
  model.databases.forEach((db) => {
    if (db.databaseName == database) {
      db.schemas.forEach((sch) => {
        if (sch.schemaName == schema) {
          sch.tables.forEach((t) => {
            if (t.tableName == table) {
              t.where = where ? [...(t.where ?? []), { value: where, target: target }] : t.where;
              t.qualify = qualify ? [...(t.qualify ?? []), { value: qualify, target: target }] : t.qualify;
            }
            t.joins?.forEach((join) => {
              if (join.from.object === filterProcess.targets[0].definitions[0].source.object) {
                join.where = where ?? '';
                join.qualify = qualify ?? '';
              }
            });
          });
        }
      });
    }
  });
  return { ...model };
}

export function findSchemaInModelUI(database: string, schema: string, model: ModelUI): SchemaModel | undefined {
  return model.databases.find((db) => db.databaseName === database)?.schemas.find((sch) => sch.schemaName === schema);
}

export function findWhereOfTargetInTable(table: TableModel, target?: TableMetadata): Condition | undefined {
  return target ? table.where?.find((condition) => condition.target.object === target.object) : undefined;
}

export function findQualifyOfTargetInTable(table: TableModel, target?: TableMetadata): Condition | undefined {
  return target ? table.qualify?.find((condition) => condition.target.object === target.object) : undefined;
}

export function getTableNameInObject(object: string | undefined): string {
  if (!object) return '';
  const path = object.split('.');
  return path.length > 2 ? path[2] : '';
}

/**
 * Checks if a column relation matches another column relation.
 * If the source is not valid it ignores it and only checks the target.
 * @param relation1 The column relation to compare.
 * @param relation2 The column relation to compare.
 * @returns True if the column relation matches the other column relation.
 */
export function isColumnRelationMatch(relation1: ColumnRelation, relation2: ColumnRelation): boolean {
  if (relation1.sources.length !== relation2.sources.length) {
    return false;
  }

  for (let i = 0; i < relation1.sources.length; i++) {
    if (!isColumnMetadataEqual(relation1.sources[i], relation2.sources[i])) {
      return false;
    }
  }

  return (
    isColumnMetadataEqual(relation1.target, relation2.target) &&
    relation1.type === relation2.type &&
    relation1.mapping === relation2.mapping
  );
}

/**
 * Checks if two column metadata objects are equal.
 * @param metadata1 - The first column metadata object.
 * @param metadata2 - The second column metadata object.
 * @returns A boolean indicating whether the column metadata objects are equal.
 */
export function isColumnMetadataEqual(metadata1: ColumnMetadata, metadata2: ColumnMetadata): boolean {
  return metadata1.columnName === metadata2.columnName && metadata1.object === metadata2.object;
}

/**
 * Retrieves a column from the model based on the given alias and column name.
 * @param alias - The alias of the table.
 * @param columnName - The name of the column.
 * @param model - The ModelUI object containing the databases, schemas, and tables.
 * @returns The ColumnModel object if found, otherwise undefined.
 */
export function columnByAliasAndColumnName(alias: string, columnName: string, model: ModelUI): ColumnModel | undefined {
  const table = model.databases
    .flatMap((db) => db.schemas.flatMap((schema) => schema.tables))
    .find((table) => table.alias === alias);
  if (!table) return;
  return table.columns.find((column) => column.columnName === columnName);
}

export function countTablesInSchemaInModelUI(model: ModelUI, database: string, schema: string): number {
  return (
    model.databases.find((db) => db.databaseName === database)?.schemas.find((sch) => sch.schemaName === schema)?.tables
      .length ?? 0
  );
}

export function findColumnRelationOfTargetInModelUI(
  model: ModelUI,
  target: ColumnMetadata
): ColumnRelation | undefined {
  return findTableObjectInModelUI(target.object, model)?.mappings?.find(
    (mapping) => mapping.target.columnName === target.columnName
  );
}

export function countTablesInModelUI(model: ModelUI): number {
  return model.databases.flatMap((db) => db.schemas.flatMap((schema) => schema.tables)).length;
}
