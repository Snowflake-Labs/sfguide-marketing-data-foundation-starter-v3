import { TableModel, ColumnType, ModelUI } from 'dtos/ModelUI';
import 'reflect-metadata';
import { MappingModelMockWithoutColumns } from './ModelUIMock';
import { addColumnsFromSourcesToModelUI } from '../ModelUIHelpers';

describe('MappingModelHelpers addColumnsFromSourcesToMappingModel test', () => {
  test('should addColumnsFromSourcesToMappingModel sorted', () => {
    // arrange
    const modelMock = MappingModelMockWithoutColumns;
    const sourcesMock: TableModel[] = [
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
            type: 'VARCHAR' as ColumnType,
            sqlType: 'VARCHAR',
            object: 'database.schema.table01',
          },
          {
            columnName: 'number_column',
            type: 'NUMBER' as ColumnType,
            sqlType: 'NUMBER',
            object: 'database.schema.table01',
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
            type: 'NUMBER' as ColumnType,
            sqlType: 'NUMBER',
            object: 'database.schema.table02',
          },
        ],
      },
    ];
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
                      type: 'NUMBER' as ColumnType,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table01',
                    },
                    {
                      columnName: 'varchar_column',
                      type: 'VARCHAR' as ColumnType,
                      sqlType: 'VARCHAR',
                      object: 'database.schema.table01',
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
                  columns: [],
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = addColumnsFromSourcesToModelUI(modelMock, sourcesMock);

    // assert
    expect(result).toEqual(expected);
  });
});
