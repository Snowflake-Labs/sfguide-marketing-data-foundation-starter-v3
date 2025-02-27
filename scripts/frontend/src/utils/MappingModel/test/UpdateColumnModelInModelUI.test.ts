import { ColumnModel, ColumnType, ModelUI } from 'dtos/ModelUI';
import { ModelUIMock } from './ModelUIMock';
import { UpdateColumnModelInModelUI } from '../ModelUIHelpers';

describe('ModelUIHelpers UpdateColumnModelInModelUI test', () => {
  test('should UpdateColumnModelInModelUI update a column to MappingModel', () => {
    const modelMock = ModelUIMock;
    const previousColumn: ColumnModel = {
      columnName: 'number_column',
      type: ColumnType.NUMBER,
      sqlType: 'NUMBER',
      object: 'database.schema.table01',
    };
    const updatedColumn: ColumnModel = {
      columnName: 'boolean_column',
      type: ColumnType.BOOLEAN,
      sqlType: 'BOOLEAN',
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
                      columnName: 'boolean_column',
                      type: ColumnType.BOOLEAN,
                      sqlType: 'BOOLEAN',
                      object: 'database.schema.table01',
                    },
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
    const result = UpdateColumnModelInModelUI(previousColumn, updatedColumn, modelMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should not UpdateColumnModelInModelUI update a column to MappingModel', () => {
    const modelMock = ModelUIMock;
    const previousColumn: ColumnModel = {
      columnName: 'number_column',
      type: ColumnType.NUMBER,
      sqlType: 'NUMBER',
      object: 'database.schema.table01',
    };
    const updatedColumn: ColumnModel = {
      columnName: 'varchar_column',
      type: ColumnType.VARCHAR,
      sqlType: 'VARCHAR',
      object: 'database.schema.table01',
    };

    const expected = ModelUIMock;

    // act
    const result = UpdateColumnModelInModelUI(previousColumn, updatedColumn, modelMock);

    // assert
    expect(result).toEqual(expected);
  });
});
