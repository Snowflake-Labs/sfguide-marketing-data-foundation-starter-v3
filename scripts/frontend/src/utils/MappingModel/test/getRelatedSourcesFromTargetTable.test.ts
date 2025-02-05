import 'reflect-metadata';
import { ColumnType, ModelUI, MappingType, TableModel } from 'dtos/ModelUI';
import { getRelatedSourcesFromTargetTable } from '../ModelUIHelpers';
import { MappingModelMockWithMappingAndJoinInSequence, ModelUIMock, ModelUIMockWithJoinsSequence } from './ModelUIMock';
import { JoinTypes } from 'dtos/JoinDefinition';

describe('ModelUIHelpers getRelatedSourcesFromTargetTable test', () => {
  test('should get related mappings in target table', () => {
    // arrange
    const modelMock: ModelUI = ModelUIMock;
    const targetTableMock: TableModel = {
      alias: 'TAB01',
      type: 'target',
      object: 'database.schema.table01',
      tableName: 'table01',
      databaseName: 'database',
      schemaName: 'schema',
      columns: [],
      mappings: [
        {
          sources: [
            {
              object: 'database.schema.table02',
              columnName: 'varchar_column',
            },
          ],
          target: {
            object: 'database.schema.table01',
            columnName: 'varchar_column',
          },
          type: MappingType.Column,
          mapping: 'varchar_column',
        },
        {
          sources: [
            {
              object: 'database.schema.table03',
              columnName: 'varchar_column',
            },
          ],
          target: {
            object: 'database.schema.table01',
            columnName: 'varchar_column',
          },
          type: MappingType.Column,
          mapping: 'varchar_column',
        },
      ],
    };
    const expected: TableModel[] = [
      {
        alias: 'TAB02',
        type: 'source',
        object: 'database.schema.table02',
        tableName: 'table02',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [
          {
            columnName: 'number_column',
            type: 'NUMBER' as ColumnType,
            sqlType: 'NUMBER',
            object: 'database.schema.table02',
          },
        ],
      },
      {
        alias: 'TAB03',
        type: 'source',
        object: 'database.schema.table03',
        tableName: 'table03',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [
          {
            columnName: 'date_column',
            type: 'DATE' as ColumnType,
            sqlType: 'DATE',
            object: 'database.schema.table03',
          },
        ],
      },
    ];

    // act
    const result = getRelatedSourcesFromTargetTable(targetTableMock, modelMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should get related joins in source table', () => {
    // arrange
    const modelMock: ModelUI = ModelUIMock;
    const targetTableMock: TableModel = {
      alias: 'TAB01',
      type: 'source',
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
          type: JoinTypes.INNER,
          on: 'TAB02.number_column = TAB01.number_column',
        },
        {
          target: {
            alias: 'TAB01',
            object: 'database.schema.table01',
            tableName: 'table01',
            databaseName: 'database',
            schemaName: 'schema',
          },
          from: {
            alias: 'TAB03',
            object: 'database.schema.table03',
            tableName: 'table03',
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
          type: JoinTypes.INNER,
          on: 'TAB02.number_column = TAB01.number_column',
        },
      ],
    };
    const expected: TableModel[] = [
      {
        alias: 'TAB02',
        type: 'source',
        object: 'database.schema.table02',
        tableName: 'table02',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [
          {
            columnName: 'number_column',
            type: 'NUMBER' as ColumnType,
            sqlType: 'NUMBER',
            object: 'database.schema.table02',
          },
        ],
      },
      {
        alias: 'TAB03',
        type: 'source',
        object: 'database.schema.table03',
        tableName: 'table03',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [
          {
            columnName: 'date_column',
            type: 'DATE' as ColumnType,
            sqlType: 'DATE',
            object: 'database.schema.table03',
          },
        ],
      },
    ];

    // act
    const result = getRelatedSourcesFromTargetTable(targetTableMock, modelMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should get related joins in sequence', () => {
    // arrange
    const modelMock: ModelUI = ModelUIMockWithJoinsSequence;
    const targetTableMock: TableModel = {
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
          type: JoinTypes.INNER,
          on: 'TAB02.number_column = TAB01.number_column',
        },
      ],
    };
    const expected: TableModel[] = [
      {
        alias: 'TAB02',
        type: 'source',
        object: 'database.schema.table02',
        tableName: 'table02',
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
              alias: 'TAB03',
              object: 'database.schema.table03',
              tableName: 'table03',
              databaseName: 'database',
              schemaName: 'schema',
            },
            to: {
              alias: 'TAB02',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
            },
            type: JoinTypes.INNER,
            on: 'TAB02.number_column = TAB03.number_column',
          },
        ],
      },
      {
        alias: 'TAB03',
        type: 'source',
        object: 'database.schema.table03',
        tableName: 'table03',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [],
      },
    ];

    // act
    const result = getRelatedSourcesFromTargetTable(targetTableMock, modelMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should get related source tables when target has no joins', () => {
    // arrange
    const modelMock: ModelUI = MappingModelMockWithMappingAndJoinInSequence;
    const targetTableMock: TableModel = {
      alias: 'TAB01',
      type: 'target',
      object: 'database.schema.table01',
      tableName: 'table01',
      databaseName: 'database',
      schemaName: 'schema',
      columns: [],
      mappings: [
        {
          sources: [
            {
              object: 'database.schema.table02',
              columnName: 'varchar_column',
            },
          ],
          target: {
            object: 'database.schema.table01',
            columnName: 'varchar_column',
          },
          type: MappingType.Column,
          mapping: 'varchar_column',
        },
      ],
    };
    const expected: TableModel[] = [
      {
        alias: 'TAB02',
        type: 'source',
        object: 'database.schema.table02',
        tableName: 'table02',
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
              alias: 'TAB03',
              object: 'database.schema.table03',
              tableName: 'table03',
              databaseName: 'database',
              schemaName: 'schema',
            },
            to: {
              alias: 'TAB02',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
            },
            type: JoinTypes.INNER,
            on: 'TAB02.number_column = TAB03.number_column',
          },
          {
            target: {
              alias: 'TAB02',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
            },
            from: {
              alias: 'TAB04',
              object: 'database.schema.table04',
              tableName: 'table04',
              databaseName: 'database',
              schemaName: 'schema',
            },
            to: {
              alias: 'TAB02',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
            },
            type: JoinTypes.INNER,
            on: 'TAB02.number_column = TAB04.number_column',
          },
        ],
      },
      {
        alias: 'TAB03',
        type: 'source',
        object: 'database.schema.table03',
        tableName: 'table03',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [],
      },
    ];

    // act
    const result: TableModel[] = getRelatedSourcesFromTargetTable(targetTableMock, modelMock);

    // assert
    expect(result).toEqual(expected);
  });
});
