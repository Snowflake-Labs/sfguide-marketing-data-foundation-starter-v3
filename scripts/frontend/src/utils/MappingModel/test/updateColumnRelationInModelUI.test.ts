import { ColumnType, ModelUI, ColumnRelation, MappingType } from 'dtos/ModelUI';
import { ModelUIMock, ModelUIMockWithMappings } from './ModelUIMock';
import { updateColumnRelationInModelUI } from '../ModelUpdates';
import { NullType } from 'dtos/NullType';

describe('ModelUpdates updateColumnRelationInModelUI test', () => {
  test('should add ColumnRelation to MappingModel', () => {
    // arrange
    const modelMock = ModelUIMock;
    const sourceDbSchema = 'database.schema';
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
                  type: 'source',
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
    const result = updateColumnRelationInModelUI(modelMock, columnRelationMock, sourceDbSchema);

    // assert
    expect(result).toEqual(expected);
  });

  test('should not add duplicated ColumnRelation to MappingModel', () => {
    // arrange
    const modelMock = ModelUIMockWithMappings;
    const sourceDbSchema = 'database.schema';
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
    const result = updateColumnRelationInModelUI(modelMock, columnRelationMock, sourceDbSchema);

    // assert
    expect(result).toEqual(expected);
  });

  test('should replace ColumnRelation when target already has a ColumnRelation', () => {
    // arrange
    const modelMock = ModelUIMockWithMappings;
    const sourceDbSchema = 'database.schema';
    const columnRelationMock: ColumnRelation = {
      sources: [
        {
          object: 'database.schema.table02',
          columnName: 'number_column',
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
                    {
                      sources: [
                        {
                          columnName: 'number_column',
                          object: 'database.schema.table02',
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
                    {
                      sources: [
                        {
                          object: 'database.schema.table02',
                          columnName: 'number_column',
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
    const result = updateColumnRelationInModelUI(modelMock, columnRelationMock, sourceDbSchema);

    // assert
    expect(result).toEqual(expected);
  });

  test('should not replace ColumnRelation when is from another source', () => {
    // arrange
    const modelMock = ModelUIMockWithMappings;
    const sourceDbSchema = 'database2.schema2';
    const columnRelationMock: ColumnRelation = {
      sources: [
        {
          object: 'database2.schema2.table02',
          columnName: 'number_column',
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
                    {
                      sources: [
                        {
                          object: 'database2.schema2.table02',
                          columnName: 'number_column',
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
    const result = updateColumnRelationInModelUI(modelMock, columnRelationMock, sourceDbSchema);

    // assert
    expect(result).toEqual(expected);
  });
});
