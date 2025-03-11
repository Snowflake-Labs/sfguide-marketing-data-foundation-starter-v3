import { getProcessDefinitionJoinsInSourceTableObject } from '../toStandardMappingModel';
import { JoinTypes } from 'dtos/JoinDefinition';
import { MappingModelMockWithMappingAndJoinInSequence, ModelUIMockWithJoinsSequence } from './ModelUIMock';
import { JoinModel, ModelUI, TableMetadata, TableModel } from 'dtos/ModelUI';
import { generateTableModelRecord } from '../ModelUIHelpers';
import { ProcessDefinitionJoin } from 'dtos/Process';

describe('MappingModelHelpers getProcessDefinitionJoinsInSourceTableObject', () => {
  test('should getAllJoinModelsFromTableModels', () => {
    // arrange
    const modelMock: ModelUI = ModelUIMockWithJoinsSequence;
    const targetMock: TableMetadata = {
      alias: 'TAB01',
      object: 'database.schema.table01',
      tableName: 'table01',
      databaseName: 'database',
      schemaName: 'schema',
    };
    const tablesModelMock: TableModel[] = [
      {
        alias: 'TAB01',
        type: 'target',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [],
        joins: [
          {
            target: {
              alias: 'TAB01',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
            },
            from: {
              alias: 'TAB02',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
            },
            to: {
              alias: 'TAB01',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
            },
            type: 'INNER' as JoinTypes,
            on: 'TAB02.number_column = TAB01.number_column',
          },
        ],
      },
    ];
    const expected: ProcessDefinitionJoin[] = [
      {
        alias: 'TAB02',
        on: 'TAB02.number_column = TAB01.number_column',
        object: 'database.schema.table02',
        type: JoinTypes.INNER,
        qualify: undefined,
        where: undefined,
      },
      {
        alias: 'TAB03',
        on: 'TAB02.number_column = TAB03.number_column',
        object: 'database.schema.table03',
        type: JoinTypes.INNER,
        qualify: undefined,
        where: undefined,
      },
    ];
    // act
    const result = getProcessDefinitionJoinsInSourceTableObject(
      tablesModelMock,
      generateTableModelRecord(modelMock),
      targetMock
    );

    // assert
    expect(result).toEqual(expected);
  });

  test('should getAllJoinModelsFromTableModels from target', () => {
    // arrange
    const modelMock: ModelUI = MappingModelMockWithMappingAndJoinInSequence;
    const targetMock: TableMetadata = {
      alias: 'TAB01',
      object: 'database.schema.table01',
      tableName: 'table01',
      databaseName: 'database',
      schemaName: 'schema',
    };
    const tablesModelMock: TableModel[] = [
      {
        alias: 'TAB01',
        type: 'target',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [],
        joins: [
          {
            target: {
              alias: 'TAB01',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
            },
            from: {
              alias: 'TAB02',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
            },
            to: {
              alias: 'TAB01',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
            },
            type: 'INNER' as JoinTypes,
            on: 'TAB02.number_column = TAB01.number_column',
          },
        ],
      },
    ];
    const expected: ProcessDefinitionJoin[] = [
      {
        alias: 'TAB02',
        on: 'TAB02.number_column = TAB01.number_column',
        object: 'database.schema.table02',
        type: JoinTypes.INNER,
        qualify: undefined,
        where: undefined,
      },
      {
        alias: 'TAB03',
        on: 'TAB02.number_column = TAB03.number_column',
        object: 'database.schema.table03',
        type: JoinTypes.INNER,
        qualify: undefined,
        where: undefined,
      },
    ];
    // act
    const result = getProcessDefinitionJoinsInSourceTableObject(
      tablesModelMock,
      generateTableModelRecord(modelMock),
      targetMock
    );

    // assert
    expect(result).toEqual(expected);
  });
});
