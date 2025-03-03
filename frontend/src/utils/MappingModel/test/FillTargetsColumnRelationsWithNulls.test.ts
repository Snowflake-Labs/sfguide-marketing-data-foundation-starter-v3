import { ColumnType, ModelUI, MappingType } from 'dtos/ModelUI';
import { ModelUIMockMultipleTargets, ModelUIMockWithNoMappingColumns, ModelUINoRemainingMappings } from './ModelUIMock';
import { FillTargetsColumnRelationsWithNulls } from '../ModelUpdates';

describe('ModelUpdates ModelVeirification test', () => {
  test('Should verify model mappings for a single target', () => {
    const modelMock = ModelUIMockWithNoMappingColumns;
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
                      columnName: 'boolean_column',
                      type: ColumnType.BOOLEAN,
                      sqlType: 'BOOLEAN',
                      object: 'database.schema.table01',
                    },
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
                  ],
                  mappings: [
                    {
                      sources: [
                        {
                          object: 'database.schema.table02',
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
                    {
                      sources: [{ "object": "NULL", "columnName": "NULL" }],
                      target: {
                        object: 'database.schema.table01',
                        columnName: 'boolean_column',
                      },
                      type: MappingType.Static,
                      mapping: 'NULL',
                    },
                    {
                      sources: [{ "object": "NULL", "columnName": "NULL" }],
                      target: {
                        object: 'database.schema.table01',
                        columnName: 'varchar_column',
                      },
                      type: MappingType.Static,
                      mapping: 'NULL',
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
    FillTargetsColumnRelationsWithNulls(modelMock);

    // assert
    expect(modelMock).toEqual(expected);
  });

  test('Should verify model mappings for multiple targets', () => {
    const modelMock = ModelUIMockMultipleTargets;
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
                      columnName: 'boolean_column',
                      type: ColumnType.BOOLEAN,
                      sqlType: 'BOOLEAN',
                      object: 'database.schema.table01',
                    },
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
                          object: 'database.schema.table02',
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
                    {
                      sources: [{ "object": "NULL", "columnName": "NULL" }],
                      target: {
                        object: 'database.schema.table01',
                        columnName: 'boolean_column',
                      },
                      type: MappingType.Static,
                      mapping: 'NULL',
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
                      columnName: 'varchar_column',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                      object: 'database.schema.table02',
                    },
                  ],
                  mappings: [
                    {
                      sources: [{ "object": "NULL", "columnName": "NULL" }],
                      target: {
                        object: 'database.schema.table02',
                        columnName: 'varchar_column',
                      },
                      type: MappingType.Static,
                      mapping: 'NULL',
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
    FillTargetsColumnRelationsWithNulls(modelMock);

    // assert
    expect(modelMock).toEqual(expected);
  });

  test('Should verify model mappings for all matched mappings', () => {
    const modelMock = ModelUINoRemainingMappings;

    // act
    FillTargetsColumnRelationsWithNulls(modelMock);

    // assert
    expect(modelMock).toEqual(ModelUINoRemainingMappings);
  });
});