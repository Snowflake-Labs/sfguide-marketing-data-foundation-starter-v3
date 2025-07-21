import { JoinTypes } from 'dtos/JoinDefinition';
import { ColumnType, MappingType, ModelUI } from 'dtos/ModelUI';
import { StandardMappingModel } from 'dtos/StandardMappingModel';

export const MockModelWithTableInJoinAndTableSource: ModelUI = {
  databases: [
    {
      databaseName: 'TARGET_DB',
      schemas: [
        {
          databaseName: 'TARGET_DB',
          schemaName: 'TARGET',
          tables: [
            {
              databaseName: 'TARGET_DB',
              schemaName: 'TARGET',
              object: 'TARGET_DB.TARGET.table1',
              tableName: 'table1',
              type: 'target',
              alias: 'TAB01',
              columns: [
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  columnName: 'col1',
                  object: 'TARGET_DB.TARGET.table1',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      columnName: 'NAME',
                      object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                    },
                  ],
                  target: {
                    columnName: 'col1',
                    object: 'TARGET_DB.TARGET.table1',
                  },
                  type: MappingType.Column,
                  mapping: 'ADH02.NAME',
                },
              ],
            },
            {
              databaseName: 'TARGET_DB',
              schemaName: 'TARGET',
              object: 'TARGET_DB.TARGET.table2',
              tableName: 'table2',
              type: 'target',
              alias: 'TAB03',
              columns: [
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  columnName: 'col1',
                  object: 'TARGET_DB.TARGET.table2',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  columnName: 'col2',
                  object: 'TARGET_DB.TARGET.table2',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      columnName: 'CLICKS',
                      object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                    },
                  ],
                  target: {
                    columnName: 'col1',
                    object: 'TARGET_DB.TARGET.table2',
                  },
                  type: MappingType.Column,
                  mapping: 'BAS04.CLICKS',
                },
                {
                  sources: [
                    {
                      columnName: 'ACCOUNT_ID',
                      object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                    },
                  ],
                  target: {
                    columnName: 'col2',
                    object: 'TARGET_DB.TARGET.table2',
                  },
                  type: MappingType.Column,
                  mapping: 'ADH02.ACCOUNT_ID',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      databaseName: 'FIVETRAN',
      schemas: [
        {
          schemaName: 'FACEBOOK',
          databaseName: 'FIVETRAN',
          tables: [
            {
              type: 'source',
              columns: [
                {
                  type: ColumnType.DATE,
                  sqlType: 'TIMESTAMP_TZ',
                  columnName: 'CREATED_TIME',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  columnName: 'ACCOUNT_ID',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.DATE,
                  sqlType: 'TIMESTAMP_TZ',
                  columnName: 'UPDATED_TIME',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.DATE,
                  sqlType: 'TIMESTAMP_TZ',
                  columnName: '_FIVETRAN_SYNCED',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  columnName: 'CREATIVE_ID',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'BID_TYPE',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'EFFECTIVE_STATUS',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  columnName: 'ID',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'CONFIGURED_STATUS',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'STATUS',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'LAST_UPDATED_BY_APP_ID',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'CONVERSION_DOMAIN',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'NAME',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'NUMBER',
                  columnName: 'AD_SET_ID',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  columnName: 'BID_AMOUNT',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'PREVIEW_SHAREABLE_LINK',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  columnName: 'CAMPAIGN_ID',
                  object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                },
              ],
              alias: 'ADH02',
              object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
              tableName: 'AD_HISTORY',
              schemaName: 'FACEBOOK',
              databaseName: 'FIVETRAN',
              mappings: [
                {
                  sources: [
                    {
                      columnName: 'NAME',
                      object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                    },
                  ],
                  target: {
                    columnName: 'col1',
                    object: 'TARGET_DB.TARGET.table1',
                  },
                  type: MappingType.Column,
                  mapping: 'ADH02.NAME',
                },
                {
                  sources: [
                    {
                      columnName: 'ACCOUNT_ID',
                      object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                    },
                  ],
                  target: {
                    columnName: 'col2',
                    object: 'TARGET_DB.TARGET.table2',
                  },
                  type: MappingType.Column,
                  mapping: 'ADH02.ACCOUNT_ID',
                },
              ],
            },
            {
              type: 'source',
              columns: [
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'FLOAT',
                  columnName: 'CPM',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  columnName: 'ACCOUNT_ID',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'FLOAT',
                  columnName: 'CTR',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'TEXT',
                  columnName: 'CLICKS',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.DATE,
                  sqlType: 'TIMESTAMP_TZ',
                  columnName: '_FIVETRAN_SYNCED',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  columnName: 'IMPRESSIONS',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'FLOAT',
                  columnName: 'FREQUENCY',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.DATE,
                  sqlType: 'DATE',
                  columnName: 'DATE',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'ADSET_NAME',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: '_FIVETRAN_ID',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  columnName: 'INLINE_LINK_CLICKS',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.VARCHAR,
                  sqlType: 'TEXT',
                  columnName: 'AD_NAME',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'FLOAT',
                  columnName: 'COST_PER_INLINE_LINK_CLICK',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'FLOAT',
                  columnName: 'SPEND',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'TEXT',
                  columnName: 'AD_ID',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
                {
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  columnName: 'REACH',
                  object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                },
              ],
              alias: 'BAS04',
              object: 'FIVETRAN.FACEBOOK.BASIC_AD',
              tableName: 'BASIC_AD',
              schemaName: 'FACEBOOK',
              databaseName: 'FIVETRAN',
              mappings: [
                {
                  sources: [
                    {
                      columnName: 'CLICKS',
                      object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                    },
                  ],
                  target: {
                    columnName: 'col1',
                    object: 'TARGET_DB.TARGET.table2',
                  },
                  type: MappingType.Column,
                  mapping: 'BAS04.CLICKS',
                },
              ],
              joins: [
                {
                  target: {
                    alias: 'TAB03',
                    object: 'TARGET_DB.TARGET.table2',
                    tableName: 'table2',
                    schemaName: 'TARGET',
                    databaseName: 'TARGET_DB',
                  },
                  from: {
                    alias: 'ADH02',
                    object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
                    tableName: 'AD_HISTORY',
                    schemaName: 'FACEBOOK',
                    databaseName: 'FIVETRAN',
                  },
                  to: {
                    alias: 'BAS04',
                    object: 'FIVETRAN.FACEBOOK.BASIC_AD',
                    tableName: 'BASIC_AD',
                    schemaName: 'FACEBOOK',
                    databaseName: 'FIVETRAN',
                  },
                  type: JoinTypes.INNER,
                  on: 'cast(BAS04.AD_ID as int) = ADH02.ID',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  id: '4',
  name: 'test_model',
};

export const ExpectedMockModelWithTableInJoinAndTableSource: StandardMappingModel = {
  targets: [
    {
      definitions: [{ columns: ['ADH02.NAME'], source: { alias: 'ADH02', object: 'FIVETRAN.FACEBOOK.AD_HISTORY' } }],
      labels: ['label1'],
      process_name: 'table1',
      process_type_id: 1,
      settings: { target_interval: 'hours', target_lag: 24, warehouse: 'MDFSV3SPCS_XSMALL_WH' },
      target: { alias: 'TAB01', columns: [{ name: 'col1', type: 'VARCHAR' }], object: 'TARGET_DB.TARGET.table1' },
    },
    {
      definitions: [
        {
          columns: ['BAS04.CLICKS', 'ADH02.ACCOUNT_ID'],
          join: [
            {
              alias: 'ADH02',
              object: 'FIVETRAN.FACEBOOK.AD_HISTORY',
              on: 'cast(BAS04.AD_ID as int) = ADH02.ID',
              type: JoinTypes.INNER,
            },
          ],
          source: { alias: 'BAS04', object: 'FIVETRAN.FACEBOOK.BASIC_AD' },
        },
      ],
      labels: ['label1'],
      process_name: 'table2',
      process_type_id: 1,
      settings: { target_interval: 'hours', target_lag: 24, warehouse: 'MDFSV3SPCS_XSMALL_WH' },
      target: {
        alias: 'TAB03',
        columns: [
          { name: 'col1', type: 'VARCHAR' },
          { name: 'col2', type: 'VARCHAR' },
        ],
        object: 'TARGET_DB.TARGET.table2',
      },
    },
  ],
};
