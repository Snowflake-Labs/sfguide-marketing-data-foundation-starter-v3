import { ColumnType, ModelUI, ColumnMetadata, MappingType } from 'dtos/ModelUI';
import { ModelUIMock, ModelUIMockWithMappings } from './ModelUIMock';
import { removeColumnFromModelUI } from '../ModelUpdates';
import { NullType } from 'dtos/NullType';

describe('ModelUpdates removeColumnFromModelUI test', () => {
  test('should remove column with no dependencies', () => {
    // arrange
    const modelMock = ModelUIMock;
    const columnMock: ColumnMetadata = {
      columnName: 'number_column',
      object: 'database.schema.table01',
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
                      columnName: 'varchar_column',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                      object: 'database.schema.table01',
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
    const result = removeColumnFromModelUI(modelMock, columnMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should remove column with transformation dependencies', () => {
    // arrange
    const modelMock = ModelUIMockWithMappings;
    const columnMock: ColumnMetadata = {
      columnName: 'varchar_column',
      object: 'database.schema.table01',
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
    const result = removeColumnFromModelUI(modelMock, columnMock);

    // assert
    expect(result).toEqual(expected);
  });
});
