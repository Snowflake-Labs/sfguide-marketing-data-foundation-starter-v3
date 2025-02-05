import { StandardMappingModel } from 'dtos/StandardMappingModel';
import { ColumnType, ModelUI, SimpleTableMetadata } from 'dtos/ModelUI';
import { ModelUIMock } from './ModelUIMock';
import { mergeFilterInModelUI } from '../ModelUIHelpers';

describe('ModelUIHelpers mergeFilterInModelUI test', () => {
  test('should mergeFilterInModelUI add filter to MappingModel', () => {
    const modelMock = ModelUIMock;
    const target: SimpleTableMetadata = { alias: 'TAB01', object: 'database.schema.table01' };
    const filterModelMock: StandardMappingModel = {
      targets: [
        {
          labels: ['label01'],
          process_name: 'process-name',
          process_type_id: 1,
          settings: {
            target_interval: 'target-interval',
            target_lag: 1,
            warehouse: 'warehouse',
          },
          target: {
            alias: 'TAB01',
            object: 'database.schema.table01',
            columns: [
              {
                name: 'number_column',
                type: 'NUMBER',
              },
            ],
          },
          definitions: [
            {
              columns: ['number_column'],
              source: {
                alias: 'TAB01',
                object: 'database.schema.table01',
                where: 'number_column > 10',
                qualify: 'number_column > 20',
              },
            },
          ],
        },
      ],
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
                  qualify: [
                    { value: 'number_column > 20', target: { alias: 'TAB01', object: 'database.schema.table01' } },
                  ],
                  where: [
                    { value: 'number_column > 10', target: { alias: 'TAB01', object: 'database.schema.table01' } },
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
    const result = mergeFilterInModelUI(modelMock, filterModelMock, target);

    // assert
    expect(result).toEqual(expected);
  });
});
