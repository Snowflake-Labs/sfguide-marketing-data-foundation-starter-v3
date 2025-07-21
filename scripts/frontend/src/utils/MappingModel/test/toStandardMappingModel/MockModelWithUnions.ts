import { ColumnType, MappingType, ModelUI } from 'dtos/ModelUI';
import { StandardMappingModel } from 'dtos/StandardMappingModel';

export const ModelUIMockWithUnions: ModelUI = {
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
              ],
              mappings: [
                {
                  sources: [
                    {
                      columnName: 'number_column',
                      object: 'database.schema.table01',
                    },
                  ],
                  target: {
                    columnName: 'number_column1',
                    object: 'database.schema.table03',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
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
                      columnName: 'number_column',
                      object: 'database.schema.table02',
                    },
                  ],
                  target: {
                    columnName: 'number_column2',
                    object: 'database.schema.table03',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
              ],
            },
            {
              alias: 'TAB03',
              type: 'target',
              object: 'database.schema.table03',
              tableName: 'table03',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column1',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table03',
                },
                {
                  columnName: 'number_column2',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table03',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      columnName: 'number_column',
                      object: 'database.schema.table01',
                    },
                  ],
                  target: {
                    columnName: 'number_column1',
                    object: 'database.schema.table03',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
                {
                  sources: [
                    {
                      columnName: 'number_column',
                      object: 'database.schema.table02',
                    },
                  ],
                  target: {
                    columnName: 'number_column2',
                    object: 'database.schema.table03',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const StandardMappingModelMockWithUnions: StandardMappingModel = {
  targets: [
    {
      process_name: 'table03',
      process_type_id: 1,
      labels: ['label1'],
      target: {
        alias: 'TAB03',
        object: 'database.schema.table03',
        columns: [
          { name: 'number_column1', type: 'NUMBER' },
          { name: 'number_column2', type: 'NUMBER' },
        ],
      },
      settings: { target_interval: 'hours', target_lag: 24, warehouse: 'MDFSV3SPCS_XSMALL_WH' },
      definitions: [
        {
          columns: ['number_column', 'NULL'],
          source: { alias: 'TAB01', object: 'database.schema.table01' },
        },
        {
          columns: ['NULL', 'number_column'],
          source: { alias: 'TAB02', object: 'database.schema.table02' },
        },
      ],
    },
  ],
};
