import { ColumnType, MappingType, ModelUI } from 'dtos/ModelUI';
import { NullType } from 'dtos/NullType';
import { StandardMappingModel } from 'dtos/StandardMappingModel';

export const ModelUIMockWithMappings: ModelUI = {
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
                  columnName: 'static_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'variable_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'formula_column',
                  type: ColumnType.DATE,
                  sqlType: 'DATE',
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
                      object: 'database.schema.table02',
                      columnName: 'varchar_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'varchar_column',
                  },
                  type: MappingType.Column,
                  mapping: 'TAB02.varchar_column',
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
                    columnName: 'static_column',
                  },
                  type: MappingType.Static,
                  mapping: 'static_value',
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
                    columnName: 'variable_column',
                  },
                  type: MappingType.Variable,
                  mapping: 'variable_value',
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
                    columnName: 'variable_column',
                  },
                  type: MappingType.Variable,
                  mapping: 'variable_value',
                },
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'date_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'formula_column',
                  },
                  type: MappingType.Formula,
                  mapping: 'TO_DATE(TAB02.date_column)',
                },
              ],
              targetLag: {
                timeUnit: 'seconds',
                number: 8,
              },
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
                {
                  columnName: 'date_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
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

export const StandardMappingModelMockWithMappings: StandardMappingModel = {
  targets: [
    {
      labels: ['label1'],
      process_name: 'table01',
      process_type_id: 1,
      settings: {
        target_interval: 'seconds',
        target_lag: 8,
        warehouse: 'XSMALL_WH',
      },
      target: {
        alias: 'TAB01',
        columns: [
          { name: 'number_column', type: 'NUMBER' },
          { name: 'varchar_column', type: 'VARCHAR' },
          { name: 'static_column', type: 'VARCHAR' },
          { name: 'variable_column', type: 'VARCHAR' },
          { name: 'formula_column', type: 'DATE' },
        ],
        object: 'database.schema.table01',
      },
      definitions: [
        {
          columns: [
            'TAB02.number_column',
            'TAB02.varchar_column',
            'static_value',
            'variable_value',
            'TO_DATE(TAB02.date_column)',
          ],
          source: {
            alias: 'TAB02',
            object: 'database.schema.table02',
            qualify: undefined,
            where: undefined,
          },
        },
      ],
    },
  ],
};
