import { JoinTypes } from 'dtos/JoinDefinition';
import { ColumnType, MappingType, ModelUI } from 'dtos/ModelUI';
import { NullType } from 'dtos/NullType';
import { StandardMappingModel } from 'dtos/StandardMappingModel';

export const ModelUIMockComplex: ModelUI = {
  id: 'model-id',
  name: 'complex-model',
  databases: [
    {
      databaseName: 'database01',
      schemas: [
        {
          schemaName: 'schema01',
          databaseName: 'database01',
          tables: [
            {
              type: 'target',
              alias: 'TAB01',
              tableName: 'table01',
              schemaName: 'schema01',
              databaseName: 'database01',
              object: 'database01.schema01.table01',
              columns: [
                {
                  columnName: 'id',
                  object: 'database01.schema01.table01',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                },
                {
                  columnName: 'varchar',
                  object: 'database01.schema01.table01',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                },
                {
                  columnName: 'null',
                  object: 'database01.schema01.table01',
                  type: ColumnType.NULL,
                  sqlType: 'NULL',
                },
                {
                  columnName: 'formula',
                  object: 'database01.schema01.table01',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                },
                {
                  columnName: 'agregation',
                  object: 'database01.schema01.table01',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                },
                {
                  columnName: 'static',
                  object: 'database01.schema01.table01',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                },
                {
                  columnName: 'variable',
                  object: 'database01.schema01.table01',
                  type: ColumnType.DATE,
                  sqlType: 'DATE',
                },
              ],
              mappings: [
                {
                  sources: [{ columnName: 'id', object: 'database02.schema02.table01' }],
                  target: { columnName: 'id', object: 'database01.schema01.table01' },
                  type: MappingType.Column,
                  mapping: 'TAB01.id',
                },
                {
                  sources: [{ columnName: 'varchar', object: 'database02.schema02.table02' }],
                  target: { columnName: 'varchar', object: 'database01.schema01.table01' },
                  type: MappingType.Column,
                  mapping: 'TAB02.varchar',
                },
                {
                  sources: [{ columnName: 'id', object: 'database03.schema03.table01' }],
                  target: { columnName: 'formula', object: 'database01.schema01.table01' },
                  type: MappingType.Formula,
                  mapping: 'custom_formula(TAB01.id)',
                },
                {
                  sources: [
                    { columnName: 'id', object: 'database02.schema02.table02' },
                    { columnName: 'id', object: 'database03.schema03.table01' },
                  ],
                  target: { columnName: 'agregation', object: 'database01.schema01.table01' },
                  type: MappingType.Formula,
                  mapping: 'agregation_formula(TAB02.id, TAB01.id)',
                },
                {
                  sources: [{ columnName: NullType, object: NullType }],
                  target: { columnName: 'static', object: 'database01.schema01.table01' },
                  type: MappingType.Static,
                  mapping: '10',
                },
                {
                  sources: [{ columnName: NullType, object: NullType }],
                  target: { columnName: 'variable', object: 'database01.schema01.table01' },
                  type: MappingType.Variable,
                  mapping: 'TO_TIMESTAMP_NTZ("10/02/2024")',
                },
              ],
            },
            {
              type: 'target',
              alias: 'TAB02',
              tableName: 'table02',
              schemaName: 'schema01',
              databaseName: 'database01',
              object: 'database01.schema01.table02',
              columns: [
                {
                  columnName: 'id',
                  object: 'database01.schema01.table02',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                },
              ],
              mappings: [
                {
                  sources: [{ columnName: 'id', object: 'database02.schema02.table01' }],
                  target: { columnName: 'id', object: 'database01.schema01.table02' },
                  type: MappingType.Column,
                  mapping: 'TAB01.id',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      databaseName: 'database02',
      schemas: [
        {
          schemaName: 'schema02',
          databaseName: 'database02',
          tables: [
            {
              type: 'source',
              alias: 'TAB01',
              tableName: 'table01',
              schemaName: 'schema02',
              databaseName: 'database02',
              object: 'database02.schema02.table01',
              columns: [
                {
                  columnName: 'id',
                  object: 'database02.schema02.table01',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                },
              ],
              joins: [
                {
                  target: {
                    alias: 'TAB01',
                    tableName: 'table01',
                    schemaName: 'schema01',
                    databaseName: 'database01',
                    object: 'database01.schema01.table01',
                  },
                  from: {
                    alias: 'TAB02',
                    tableName: 'table02',
                    schemaName: 'schema02',
                    databaseName: 'database02',
                    object: 'database02.schema02.table02',
                  },
                  to: {
                    alias: 'TAB01',
                    tableName: 'table01',
                    schemaName: 'schema02',
                    databaseName: 'database02',
                    object: 'database02.schema02.table01',
                  },
                  type: JoinTypes.INNER,
                  on: 'TAB01.id = TAB02.id',
                },
              ],
            },
            {
              type: 'source',
              tableName: 'table02',
              schemaName: 'schema02',
              databaseName: 'database02',
              alias: 'TAB02',
              object: 'database02.schema02.table02',
              columns: [
                {
                  columnName: 'id',
                  object: 'database02.schema02.table02',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                },
                {
                  columnName: 'varchar',
                  object: 'database02.schema02.table02',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      databaseName: 'database03',
      schemas: [
        {
          schemaName: 'schema03',
          databaseName: 'database03',
          tables: [
            {
              type: 'source',
              tableName: 'table01',
              schemaName: 'schema03',
              databaseName: 'database03',
              alias: 'TAB01',
              object: 'database03.schema03.table01',
              columns: [
                {
                  columnName: 'id',
                  object: 'database03.schema03.table01',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                },
              ],
              joins: [
                {
                  target: {
                    alias: 'TAB01',
                    tableName: 'table01',
                    schemaName: 'schema01',
                    databaseName: 'database01',
                    object: 'database01.schema01.table01',
                  },
                  from: {
                    alias: 'TAB02',
                    tableName: 'table02',
                    schemaName: 'schema02',
                    databaseName: 'database02',
                    object: 'database02.schema02.table02',
                  },
                  to: {
                    alias: 'TAB01',
                    tableName: 'table01',
                    schemaName: 'schema02',
                    databaseName: 'database02',
                    object: 'database03.schema03.table01',
                  },
                  type: JoinTypes.INNER,
                  on: 'TAB01.id = TAB02.id',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const StandardMappingModelMockComplex: StandardMappingModel = {
  targets: [
    {
      labels: ['label1'],
      process_name: 'table01',
      process_type_id: 1,
      settings: { target_interval: 'hours', target_lag: 24, warehouse: 'MDFSV3SPCS_XSMALL_WH' },
      target: {
        alias: 'TAB01',
        object: 'database01.schema01.table01',
        columns: [
          { name: 'id', type: 'NUMBER' },
          { name: 'varchar', type: 'VARCHAR' },
          { name: 'null', type: 'NULL' },
          { name: 'formula', type: 'NUMBER' },
          { name: 'agregation', type: 'NUMBER' },
          { name: 'static', type: 'NUMBER' },
          { name: 'variable', type: 'DATE' },
        ],
      },
      definitions: [
        {
          columns: ['TAB01.id', 'TAB02.varchar', 'NULL', 'NULL', 'NULL', '10', 'TO_TIMESTAMP_NTZ("10/02/2024")'],
          join: [
            {
              alias: 'TAB02',
              object: 'database02.schema02.table02',
              on: 'TAB01.id = TAB02.id',
              type: 'INNER' as JoinTypes,
            },
          ],
          source: {
            alias: 'TAB01',
            object: 'database02.schema02.table01',
          },
        },
        {
          columns: [
            'NULL',
            'NULL',
            'NULL',
            'custom_formula(TAB01.id)',
            'agregation_formula(TAB02.id, TAB01.id)',
            'NULL',
            'NULL',
          ],
          join: [
            {
              alias: 'TAB02',
              object: 'database02.schema02.table02',
              on: 'TAB01.id = TAB02.id',
              type: 'INNER' as JoinTypes,
              qualify: undefined,
              where: undefined,
            },
          ],
          source: { alias: 'TAB01', object: 'database03.schema03.table01', qualify: undefined, where: undefined },
        },
      ],
    },
    {
      labels: ['label1'],
      process_name: 'table02',
      process_type_id: 1,
      settings: { target_interval: 'hours', target_lag: 24, warehouse: 'MDFSV3SPCS_XSMALL_WH' },
      target: {
        alias: 'TAB02',
        object: 'database01.schema01.table02',
        columns: [{ name: 'id', type: 'NUMBER' }],
      },
      definitions: [
        {
          columns: ['TAB01.id'],
          source: { alias: 'TAB01', object: 'database02.schema02.table01', qualify: undefined, where: undefined },
        },
      ],
    },
  ],
};
