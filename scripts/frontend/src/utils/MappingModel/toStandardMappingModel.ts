import { ColumnMetadata, JoinModel, MappingType, ModelUI, TableMetadata, TableModel } from 'dtos/ModelUI';
import { NullType } from 'dtos/NullType';
import { ProcessAttributes, ProcessDefinition, ProcessDefinitionJoin, SourceProcessTable } from 'dtos/Process';
import { StandardMappingModel } from 'dtos/StandardMappingModel';
import {
  findJoinInModelUI,
  findQualifyOfTargetInTable,
  findWhereOfTargetInTable,
  generateTableModelRecord,
} from './ModelUIHelpers';

/**
 * Converts a mapping model to a standard mapping model.
 * @param model The mapping model to convert.
 * @returns The standard mapping model.
 */
export function toStandardMappingModel(model: ModelUI): StandardMappingModel {
  return {
    targets: model.databases.flatMap<ProcessAttributes>((db) =>
      db.schemas.flatMap<ProcessAttributes>((schema) =>
        schema.tables
          .filter((table) => table.type == 'target')
          .map<ProcessAttributes>((table) => targetTableToProcessAttributes(table, model))
      )
    ),
  };
}

export function targetTableToProcessAttributes(table: TableModel, model: ModelUI): ProcessAttributes {
  return {
    process_name: table.tableName,
    labels: ['label1'],
    process_type_id: 1,
    target: {
      alias: table.alias,
      object: `${table.databaseName}.${table.schemaName}.${table.tableName}`,
      columns: table.columns.map((column) => ({ name: column.columnName, type: column.sqlType })),
    },
    settings: {
      target_interval: table.targetLag?.timeUnit ?? 'hours',
      target_lag: table.targetLag?.number ?? 24,
      warehouse: 'MDFSV3SPCS_BUILD_WH',
    },
    definitions: getProcessDefinitionsInTargetTable(table, model),
  };
}

function getProcessDefinitionsInTargetTable(targetTable: TableModel, modelUI: ModelUI): ProcessDefinition[] {
  if (!targetTable.mappings) return [];

  const targetColumns: (string | NullType)[] = new Array(targetTable.columns.length).fill(NullType);
  const processes: Record<string, ProcessDefinition> = {};
  const tableRecord = generateTableModelRecord(modelUI);
  const noJoinTableRecord: Record<string, TableModel> = {};
  const joinModelRecord: Record<string, JoinModel> = {};

  const getSourceTable = (
    joinModel: JoinModel,
    currentJoinValues: JoinModel[],
    index: number
  ): TableModel | undefined => {
    const tableTo = joinModel.to;
    const table = noJoinTableRecord[tableTo.object];
    if (table) return table;
    const nextJoin = currentJoinValues[index + 1];
    if (!nextJoin) return;
    return getSourceTable(nextJoin, currentJoinValues, index + 1);
  };

  const updateProcessColumns = (process: Partial<ProcessDefinition>, target: ColumnMetadata, mapping: string) => {
    const index = targetTable.columns.findIndex((column) => column.columnName === target.columnName);
    if (index >= 0) process.columns![index] = mapping;
  };

  const createProcessDefinition = (columns: (string | NullType)[], source: SourceProcessTable): ProcessDefinition => ({
    columns,
    source,
  });

  const getFirstKeyName = (obj: any): string => {
    const keys = Object.keys(obj);
    return keys[0] ?? NullType;
  };

  const findMainSourceTable = (
    sources: ColumnMetadata[],
    currentJoinRecord: Record<string, JoinModel>
  ): TableModel | undefined => {
    for (const source of sources) {
      if (noJoinTableRecord[source.object]) {
        return noJoinTableRecord[source.object];
      } else if (joinModelRecord[source.object]) {
        currentJoinRecord[source.object] = joinModelRecord[source.object];
      } else {
        const foundJoin = findJoinInModelUI(source.object, modelUI, targetTable.object);
        if (foundJoin) {
          joinModelRecord[source.object] = foundJoin;
          currentJoinRecord[source.object] = foundJoin;
        } else {
          const table = tableRecord[source.object];
          if (table) {
            noJoinTableRecord[table.object] = table;
            return table;
          }
        }
      }
    }
  };

  const saveProcessDefinition = (mainTable: TableModel, target: ColumnMetadata, mapping: string) => {
    const processColumns = processes[NullType] ? processes[NullType].columns! : [...targetColumns];
    updateProcessColumns({ columns: processColumns }, target, mapping);

    const join = getProcessDefinitionJoinsInSourceTableObject([mainTable, targetTable], tableRecord, targetTable);

    const definition = createProcessDefinition(processColumns, {
      alias: mainTable.alias ?? NullType,
      object: mainTable.object,
    });

    const where = findWhereOfTargetInTable(mainTable, targetTable)?.value;
    const qualify = findQualifyOfTargetInTable(mainTable, targetTable)?.value;

    if (where) definition.source.where = where;
    if (qualify) definition.source.qualify = qualify;
    if (join.length > 0) definition.join = join;
    processes[mainTable.object] = definition;
  };

  for (const { sources, mapping, type, target } of targetTable.mappings) {
    if (type === MappingType.Static || type === MappingType.Variable) {
      const process = processes[getFirstKeyName(processes)];
      if (process) {
        updateProcessColumns(process, target, mapping);
      } else {
        const processColumns = [...targetColumns];
        updateProcessColumns({ columns: processColumns }, target, mapping);
        processes[NullType] = createProcessDefinition(processColumns, { alias: NullType, object: NullType });
      }
    } else {
      const currentJoinRecord: Record<string, JoinModel> = {};
      let mainTable: TableModel | undefined = findMainSourceTable(sources, currentJoinRecord);
      if (!mainTable) {
        const currentJoinValues = Object.values(currentJoinRecord);
        if (currentJoinValues.length === 0) continue;
        mainTable = getSourceTable(currentJoinValues[0], currentJoinValues, 0);
      }

      if (!mainTable) continue;
      if (processes[mainTable.object]) {
        updateProcessColumns(processes[mainTable.object], target, mapping);
      } else {
        saveProcessDefinition(mainTable, target, mapping);
      }
    }
  }

  return Object.values(processes);
}

export function getProcessDefinitionJoinsInSourceTableObject(
  tables: TableModel[],
  tableRecord: Record<string, TableModel>,
  targetTable: TableMetadata
): ProcessDefinitionJoin[] {
  const allJoins: ProcessDefinitionJoin[] = [];
  for (const table of tables) {
    for (const join of table.joins ?? []) {
      if (join.target.object !== targetTable.object) continue;
      allJoins.push(fromJoinModelToProcessDefinitionJoin(join));

      const nextTable = tableRecord[join.from.object];
      if (!nextTable) continue;
      allJoins.push(...getProcessDefinitionJoinsInSourceTableObject([nextTable], tableRecord, targetTable));
    }
  }
  return allJoins;
}

function fromJoinModelToProcessDefinitionJoin(join: JoinModel): ProcessDefinitionJoin {
  const definitionJoin: ProcessDefinitionJoin = {
    alias: join.from.alias,
    on: join.on,
    object: join.from.object,
    type: join.type,
  };
  if (join.where) definitionJoin.where = join.where;
  if (join.qualify) definitionJoin.qualify = join.qualify;
  return definitionJoin;
}
