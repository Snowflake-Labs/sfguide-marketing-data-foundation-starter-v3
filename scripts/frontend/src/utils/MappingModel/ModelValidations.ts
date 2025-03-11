import { ColumnRelation, ModelUI, TableModel } from 'dtos/ModelUI';
import { StandardMappingModel } from 'dtos/StandardMappingModel';
import {
  findTableObjectInModelUI,
  generateTableModelRecord,
  mapColumnsToProcessDefinitionJoins,
} from './ModelUIHelpers';import { ProcessDefinition } from 'dtos/Process';
import { getProcessDefinitionJoinsInSourceTableObject } from './toStandardMappingModel';
import { ColumnTransformationMetadata } from 'components/Diagrams/Drawers/MappingsDrawer/ColumnTransformationMetadata';

/**
 * Converts a ColumnRelation object to a StandardMappingModel object.
 *
 * @param mapModel - The ColumnRelation object to convert.
 * @param model - The ModelUI object containing the target and source tables.
 * @returns The converted StandardMappingModel object, or undefined if the target table or column is not found.
 */
export function columnRelationToStandardMappingModel(
  mapModel: ColumnRelation,
  model: ModelUI
): StandardMappingModel | undefined {
  const targetTable = findTableObjectInModelUI(mapModel.target.object, model);
  const targetColumn = targetTable?.columns.find((column) => column.columnName === mapModel.target.columnName);
  const [sourceTable, ...joinTable] = mapColumnsToProcessDefinitionJoins(mapModel.sources, model);

  if (!targetTable || !targetColumn) return;
  const definition: StandardMappingModel = {
    targets: [
      {
        process_name: '',
        process_type_id: 3,
        labels: [''],
        settings: { target_interval: '', target_lag: 0, warehouse: '' },
        target: {
          alias: targetTable.alias,
          object: targetTable.object,
          columns: [
            {
              name: targetColumn.columnName,
              type: targetColumn.sqlType,
            },
          ],
        },
        definitions: [
          {
            columns: [mapModel.mapping],
            source: {
              alias: sourceTable?.alias ?? '',
              object: sourceTable?.object ?? '',
            },
            join: joinTable,
          },
        ],
      },
    ],
  };
  return definition;
}

export function formulaCodeToProcessDefinition(
  model: ModelUI,
  target: TableModel,
  transformation: ColumnTransformationMetadata): ProcessDefinition | undefined {
  const definition = ColumnRelationToProcessDefinition(transformation, model, target);
  if (!definition) return;
  return {
    source: definition.source,
    join: definition.join,
    columns: [transformation.transformation],
    limit: 3,
  };
}

export function processToStandardMappingModel(process: ProcessDefinition): StandardMappingModel {
  return {
    targets: [
      {
        labels: [],
        process_name: '',
        process_type_id: 0,
        settings: {
          target_interval: '',
          target_lag: 0,
          warehouse: '',
        },
        target: {
          columns: [],
          alias: '',
          object: '',
        },
        definitions: [process],
      },
    ],
  };
}




export function ColumnRelationToProcessDefinition(
  sourceTransformation: ColumnTransformationMetadata,
  model: ModelUI,
  targetTable: TableModel
): ProcessDefinition | undefined {
  const sourceTable = sourceTransformation.columns
    ? findTableObjectInModelUI(sourceTransformation.columns[0].object, model)
    : undefined;
  if (!sourceTable) return;
  const tableRecord = generateTableModelRecord(model);
  const join = getProcessDefinitionJoinsInSourceTableObject([sourceTable], tableRecord, targetTable);
  let process: ProcessDefinition = {
    source: {
      alias: sourceTable?.alias ?? '',
      object: sourceTable?.object ?? '',
    },
    join,
    columns: [sourceTransformation.transformation],
  };

  sourceTable?.joins?.forEach((join) => {
    const joinTable = findTableObjectInModelUI(join.target.object, model);
    if (!joinTable) return;
    if (!process.join) process.join = [];
    process.join.push();
  });

  return process;
}