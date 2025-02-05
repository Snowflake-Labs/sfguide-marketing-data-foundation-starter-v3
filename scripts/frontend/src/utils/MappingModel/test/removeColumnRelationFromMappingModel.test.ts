import { ColumnType, ModelUI, ColumnRelation, MappingType } from 'dtos/ModelUI';
import { ModelUIMockWithMappings, ModelUIMockWithMultipleMappings } from './ModelUIMock';
import { removeColumnRelationFromModelUI } from '../ModelUpdates';
import { NullType } from 'dtos/NullType';

describe('ModelUpdates removeColumnRelationFromModelUI test', () => {
  test('should remove existing ColumnRelation from MappingModel', () => {
    // arrange
    const modelMock = { ...ModelUIMockWithMappings };
    const columnRelationMock: ColumnRelation = {
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
    };
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
    const result = removeColumnRelationFromModelUI(modelMock, columnRelationMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should remove static ColumnRelation from MappingModel', () => {
    // arrange
    const modelMock = { ...ModelUIMockWithMappings };
    const columnRelationMock: ColumnRelation = {
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
    };
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
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = removeColumnRelationFromModelUI(modelMock, columnRelationMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should not remove ColumnRelation from different tables with same column name', () => {
    // arrange
    const modelMock = ModelUIMockWithMultipleMappings;
    const columnRelationMock: ColumnRelation = {
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
    };
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
                  ],
                  mappings: [],
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
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = removeColumnRelationFromModelUI(modelMock, columnRelationMock);

    // assert
    expect(result).toEqual(expected);
  });
});
