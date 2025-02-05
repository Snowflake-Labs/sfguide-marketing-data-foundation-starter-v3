import { ColumnType, MappingType, ModelUI } from 'dtos/ModelUI';
import {
  ModelUIMock,
  ModelUIMockWithJoinsSequence,
  ModelUIMockWithMappings,
  ModelUIMockWithMultipleTargets,
} from './ModelUIMock';
import { removeDeepTableFromModelUI } from '../ModelUpdates';
import { NullType } from 'dtos/NullType';

describe('ModelUpdates removeDeepTableFromModelUI test', () => {
  test('should remove table from model', () => {
    // arrange
    const modelMock = ModelUIMock;
    const tableObject: string = 'database.schema.table01';
    const expected: ModelUI = {
      id: 'model-id',
      name: 'model-name',
      databases: [
        {
          databaseName: 'database',
          schemas: [
            {
              schemaName: 'schema',
              databaseName: 'database',
              tables: [
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
                      type: ColumnType.NUMBER,
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
                      type: ColumnType.DATE,
                      sqlType: 'DATE',
                      object: 'database.schema.table03',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = removeDeepTableFromModelUI(modelMock, tableObject);

    // assert
    expect(result).toEqual(expected);
  });

  test('should remove related transformations from model', () => {
    // arrange
    const modelMock = ModelUIMockWithMappings;
    const tableObject: string = 'database.schema.table02';
    const parentTargetTable: string = 'database.schema.table01';
    const expected: ModelUI = {
      id: 'model-id',
      name: 'model-name',
      databases: [
        {
          databaseName: 'database',
          schemas: [
            {
              schemaName: 'schema',
              databaseName: 'database',
              tables: [
                {
                  alias: 'TAB01',
                  type: 'target',
                  object: 'database.schema.table01',
                  tableName: 'table01',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: ColumnType.NUMBER,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table01',
                    },
                    {
                      columnName: 'varchar_column',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                      object: 'database.schema.table01',
                    },
                    {
                      columnName: 'static_col',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                      object: 'database.schema.table01',
                    },
                  ],
                  mappings: [
                    {
                      sources: [
                        {
                          object: NullType,
                          columnName: NullType,
                        },
                      ],
                      target: {
                        object: 'database.schema.table01',
                        columnName: 'static_col',
                      },
                      type: MappingType.Static,
                      mapping: 'static_value',
                    },
                  ],
                },
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
                      type: ColumnType.NUMBER,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table02',
                    },
                    {
                      columnName: 'varchar_column',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                      object: 'database.schema.table02',
                    },
                  ],
                  mappings: [
                    {
                      sources: [
                        {
                          object: NullType,
                          columnName: NullType,
                        },
                      ],
                      target: {
                        object: 'database.schema.table01',
                        columnName: 'static_col',
                      },
                      type: MappingType.Static,
                      mapping: 'static_value',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = removeDeepTableFromModelUI(modelMock, tableObject, parentTargetTable);

    // assert
    expect(result).toEqual(expected);
  });

  test('should remove related joins from model', () => {
    // arrange
    const modelMock = ModelUIMockWithJoinsSequence;
    const tableObject: string = 'database.schema.table02';
    const tableParentObject: string = 'database.schema.table01';
    const expected: ModelUI = {
      id: 'model-id',
      name: 'model-name',
      databases: [
        {
          databaseName: 'database',
          schemas: [
            {
              schemaName: 'schema',
              databaseName: 'database',
              tables: [
                {
                  alias: 'TAB01',
                  type: 'target',
                  object: 'database.schema.table01',
                  tableName: 'table01',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [],
                  joins: [],
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
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = removeDeepTableFromModelUI(modelMock, tableObject, tableParentObject);

    // assert
    expect(result).toEqual(expected);
  });

  test('should not remove table of model when there are still mappings left', () => {
    // arrange
    const modelMock = ModelUIMockWithMultipleTargets;
    const tableToRemove: string = 'database.schema.table03';
    const parentTargetTable: string = 'database.schema.table02';
    const expected: ModelUI = {
      id: 'model-id',
      name: 'model-name',
      databases: [
        {
          databaseName: 'database',
          schemas: [
            {
              schemaName: 'schema',
              databaseName: 'database',
              tables: [
                {
                  alias: 'TAB01',
                  type: 'target',
                  object: 'database.schema.table01',
                  tableName: 'table01',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: ColumnType.NUMBER,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table01',
                    },
                  ],
                  mappings: [
                    {
                      sources: [
                        {
                          object: 'database.schema.table03',
                          columnName: 'number_column',
                        },
                      ],
                      target: {
                        object: 'database.schema.table01',
                        columnName: 'number_column',
                      },
                      type: MappingType.Column,
                      mapping: 'number_column',
                    },
                  ],
                },
                {
                  alias: 'TAB02',
                  type: 'target',
                  object: 'database.schema.table02',
                  tableName: 'table02',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: ColumnType.NUMBER,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table02',
                    },
                  ],
                  mappings: [],
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
                      columnName: 'number_column',
                      type: ColumnType.NUMBER,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table03',
                    },
                  ],
                  mappings: [
                    {
                      sources: [
                        {
                          object: 'database.schema.table03',
                          columnName: 'number_column',
                        },
                      ],
                      target: {
                        object: 'database.schema.table01',
                        columnName: 'number_column',
                      },
                      type: MappingType.Column,
                      mapping: 'number_column',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = removeDeepTableFromModelUI(modelMock, tableToRemove, parentTargetTable);

    // assert
    expect(result).toEqual(expected);
  });
});
