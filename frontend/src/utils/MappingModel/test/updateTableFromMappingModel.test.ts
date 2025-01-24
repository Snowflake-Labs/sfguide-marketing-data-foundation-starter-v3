import { ColumnType, ModelUI, MappingType } from 'dtos/ModelUI';
import { ModelUIMockWithJoins } from './ModelUIMock';
import { updateTableFromMappingModel } from '../ModelUIHelpers';
import { JoinTypes } from 'dtos/JoinDefinition';

describe('ModelUpdates updateTableFromMappingModel test', () => {
  test('should update table from mapping model', () => {
    // arrange
    const modelMock = ModelUIMockWithJoins;
    const targetTableToUpdate = 'database.schema.table01';
    const newTargetTableObject = 'database.schema.myTable';
    const newTargetTableName = 'myTable';
    const newAlias = 'MYT01';
    const expectedModel: ModelUI = {
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
                  alias: 'MYT01',
                  type: 'target',
                  object: 'database.schema.myTable',
                  tableName: 'myTable',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: ColumnType.NUMBER,
                      sqlType: 'NUMBER',
                      object: 'database.schema.myTable',
                    },
                    {
                      columnName: 'varchar_column',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                      object: 'database.schema.myTable',
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
                        object: 'database.schema.myTable',
                        columnName: 'number_column',
                      },
                      type: MappingType.Column,
                      mapping: 'number_column',
                    },
                  ],
                  joins: [
                    {
                      target: {
                        alias: 'MYT01',
                        object: 'database.schema.myTable',
                        tableName: 'myTable',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      from: {
                        alias: 'TAB01',
                        object: 'database.schema.table01',
                        tableName: 'table01',
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
                      on: 'TAB02.number_column = TAB01.number_column',
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
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = updateTableFromMappingModel(
      modelMock,
      targetTableToUpdate,
      newTargetTableName,
      newTargetTableObject,
      newAlias
    );

    // assert
    expect(result).toEqual(expectedModel);
  });
});
