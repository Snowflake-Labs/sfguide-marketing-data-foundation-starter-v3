import { JoinTypes } from 'dtos/JoinDefinition';
import { ColumnType, MappingType, ModelUI } from 'dtos/ModelUI';
import { StandardMappingModel } from 'dtos/StandardMappingModel';

export const ModelUIMockWithWhereQualify: ModelUI = {
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
                  mapping: 'TAB02.number_column',
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
                  mapping: 'TAB03.varchar_column',
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
              qualify: [{ value: '1 = 1', target: { alias: 'TAB01', object: 'database.schema.table01' } }],
              where: [
                {
                  value: 'TAB02.number_column > 10',
                  target: { alias: 'TAB01', object: 'database.schema.table01' },
                },
              ],
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
                  qualify: '1 = 1',
                  where: 'TAB03.varchar_column = "test"',
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
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table03',
                },
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
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

export const StandardMappingModelMockWithWhereQualify: StandardMappingModel = {
  targets: [
    {
      labels: ['label1'],
      process_name: 'table01',
      process_type_id: 1,
      settings: {
        target_interval: 'hours',
        target_lag: 24,
        warehouse: 'XSMALL_WH',
      },
      target: {
        alias: 'TAB01',
        columns: [
          { name: 'number_column', type: 'NUMBER' },
          { name: 'varchar_column', type: 'VARCHAR' },
        ],
        object: 'database.schema.table01',
      },
      definitions: [
        {
          columns: ['TAB02.number_column', 'TAB03.varchar_column'],
          source: {
            alias: 'TAB02',
            object: 'database.schema.table02',
            qualify: '1 = 1',
            where: 'TAB02.number_column > 10',
          },
          join: [
            {
              alias: 'TAB03',
              on: 'TAB02.number_column = TAB03.number_column',
              object: 'database.schema.table03',
              type: 'INNER' as JoinTypes,
              qualify: '1 = 1',
              where: 'TAB03.varchar_column = "test"',
            },
          ],
        },
      ],
    },
  ],
};
