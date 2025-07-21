import { StandardMappingModel } from 'dtos/StandardMappingModel';
import StandardizeModelFacebookFivetran from '../../../../../../backend/predefined_models/StandardizeModelFacebookFivetran.json';
import { ModelUI } from 'dtos/ModelUI';
import { JoinTypes } from 'dtos/JoinDefinition';

export const UnifiedDataModelMock: ModelUI = StandardizeModelFacebookFivetran as ModelUI;

export const StandardUnifiedDataModelMock: StandardMappingModel = {
  targets: [
    {
      process_name: 'DIM_CAMPAIGN_FIVETRAN_FACEBOOK',
      labels: ['label1'],
      process_type_id: 1,
      target: {
        alias: 'DIM10',
        object: '<TARGET_DATABASE>.TARGET.DIM_CAMPAIGN_FIVETRAN_FACEBOOK',
        columns: [
          {
            name: 'ID',
            type: 'NUMBER',
          },
          {
            name: 'CAMPAIGN_NAME',
            type: 'VARCHAR',
          },
          {
            name: 'ACCOUNT_ID',
            type: 'NUMBER',
          },
          {
            name: 'CREATED_AT',
            type: 'DATE',
          },
          {
            name: 'DATE_START',
            type: 'DATE',
          },
          {
            name: 'DATE_END',
            type: 'DATE',
          },
          {
            name: 'DAILY_BUDGET',
            type: 'NUMBER',
          },
          {
            name: 'LIFETIME_BUDGET',
            type: 'NUMBER',
          },
          {
            name: 'UPDATED_AT',
            type: 'DATE',
          },
          {
            name: 'BUDGET_REMAINING',
            type: 'NUMBER',
          },
        ],
      },
      settings: {
        target_interval: 'hours',
        target_lag: 24,
        warehouse: 'MDFSV3SPCS_BUILD_WH',
      },
      definitions: [
        {
          columns: [
            'CAM02.ID',
            'CAM02.NAME',
            'CAM02.ACCOUNT_ID',
            'CAM02.CREATED_TIME',
            'CAM02.START_TIME',
            'CAM02.STOP_TIME',
            'NULL',
            'CAST(CAM02.LIFETIME_BUDGET AS INT)',
            'NULL',
            'CAM02.BUDGET_REMAINING',
          ],
          source: {
            alias: 'CAM02',
            object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.CAMPAIGN_HISTORY',
            "qualify": "row_number() over (partition by id order by TO_TIMESTAMP_NTZ(UPDATED_TIME) desc) = 1",
          },
        },
      ],
    },
    {
      process_name: 'dim_ad_group_FIVETRAN_FACEBOOK',
      labels: ['label1'],
      process_type_id: 1,
      target: {
        alias: 'DIM10',
        object: '<TARGET_DATABASE>.TARGET.dim_ad_group_FIVETRAN_FACEBOOK',
        columns: [
          {
            name: 'ID',
            type: 'NUMBER',
          },
          {
            name: 'AD_GROUP_NAME',
            type: 'VARCHAR',
          },
          {
            name: 'CAMPAIGN_ID',
            type: 'NUMBER',
          },
          {
            name: 'ACCOUNT_ID',
            type: 'NUMBER',
          },
          {
            name: 'CREATED_AT',
            type: 'DATE',
          },
          {
            name: 'UPDATED_AT',
            type: 'DATE',
          },
        ],
      },
      settings: {
        target_interval: 'hours',
        target_lag: 24,
        warehouse: 'MDFSV3SPCS_BUILD_WH',
      },
      definitions: [
        {
          columns: [
            'ADS10.ADSET_SOURCE_ID',
            'ADS10.NAME',
            'ADS10.CAMPAIGN_ID',
            'ADS10.ACCOUNT_ID',
            'ADS10.CREATED_TIME',
            'ADS10.UPDATED_TIME',
          ],
          source: {
            alias: 'ADS10',
            object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.AD_SET_HISTORY',
          },
        },
      ],
    },
    {
      process_name: 'DIM_ACCOUNT_FIVETRAN_FACEBOOK',
      labels: ['label1'],
      process_type_id: 1,
      target: {
        alias: 'DIM10',
        object: '<TARGET_DATABASE>.TARGET.DIM_ACCOUNT_FIVETRAN_FACEBOOK',
        columns: [
          {
            name: 'ACCOUNT_ID',
            type: 'NUMBER',
          },
          {
            name: 'ACCOUNT_NAME',
            type: 'VARCHAR',
          },
          {
            name: 'ACCOUNT_STATUS',
            type: 'VARCHAR',
          },
          {
            name: 'BUSINESS_COUNTRY_CODE',
            type: 'VARCHAR',
          },
          {
            name: 'CURRENCY_KEY',
            type: 'VARCHAR',
          },
          {
            name: 'TIMEZONE_KEY',
            type: 'VARCHAR',
          },
          {
            name: 'CREATED_AT',
            type: 'DATE',
          },
          {
            name: 'UPDATED_AT',
            type: 'DATE',
          },
        ],
      },
      settings: {
        target_interval: 'hours',
        target_lag: 24,
        warehouse: 'MDFSV3SPCS_BUILD_WH',
      },
      definitions: [
        {
          columns: [
            'ACC07.ID',
            'ACC07.NAME',
            'ACC07.ACCOUNT_STATUS',
            'ACC07.BUSINESS_COUNTRY_CODE',
            'ACC07.CURRENCY',
            'ACC07.TIMEZONE_NAME',
            'ACC07.CREATED_TIME',
            'NULL',
          ],
          source: {
            alias: 'ACC07',
            object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.ACCOUNT_HISTORY',
          },
        },
      ],
    },
    {
      process_name: 'METRICS_FIVETRAN_FACEBOOK',
      labels: ['label1'],
      process_type_id: 1,
      target: {
        alias: 'MET09',
        object: '<TARGET_DATABASE>.TARGET.METRICS_FIVETRAN_FACEBOOK',
        columns: [
          {
            name: 'ad_id',
            type: 'NUMBER',
          },
          {
            name: 'date',
            type: 'DATE',
          },
          {
            name: 'timezone',
            type: 'VARCHAR',
          },
          {
            name: 'geograpy_object',
            type: 'VARCHAR',
          },
          {
            name: 'account_id',
            type: 'NUMBER',
          },
          {
            name: 'campaign_id',
            type: 'NUMBER',
          },
          {
            name: 'ad_group_id',
            type: 'NUMBER',
          },
          {
            name: 'currency_key',
            type: 'VARCHAR',
          },
          {
            name: 'impressions',
            type: 'NUMBER',
          },
          {
            name: 'clicks',
            type: 'NUMBER',
          },
          {
            name: 'spend',
            type: 'NUMBER',
          },
        ],
      },
      settings: {
        target_interval: 'hours',
        target_lag: 24,
        warehouse: 'MDFSV3SPCS_BUILD_WH',
      },
      definitions: [
        {
          columns: [
            'BAS06.AD_ID',
            'BAS06._FIVETRAN_SYNCED',
            'ACC07.TIMEZONE_NAME',
            'NULL',
            'BAS06.ACCOUNT_ID',
            'ADS10.CAMPAIGN_ID',
            'ADS10.ID',
            'ACC07.CURRENCY',
            'BAS06.IMPRESSIONS',
            'BAS06.INLINE_LINK_CLICKS',
            'BAS06.SPEND',
          ],
          source: {
            alias: 'BAS06',
            object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.BASIC_AD',
          },
          join: [
            {
              alias: 'ACC07',
              on: 'BAS06.ACCOUNT_ID = ACC07.ID',
              object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.ACCOUNT_HISTORY',
              type: JoinTypes.LEFT,
              qualify: 'row_number() over (partition by id order by _fivetran_synced desc) = 1',
            },
            {
              alias: 'ADS10',
              on: 'BAS06.AD_ID = ADS10.ID',
              object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.AD_SET_HISTORY',
              type: JoinTypes.LEFT,
              qualify: 'row_number() over (partition by id order by TO_TIMESTAMP_NTZ(UPDATED_TIME) desc) = 1',
            },
          ],
        },
      ],
    },
    {
      definitions: [
        {
          columns: [
            'ADH08.AD_SET_ID',
            'ADH08.CAMPAIGN_ID',
            'BAS06._FIVETRAN_SYNCED',
            'BAS06.IMPRESSIONS',
            'BAS06.INLINE_LINK_CLICKS',
            'BAS06.SPEND',
            'ACC07.CURRENCY',
            'ACC07.TIMEZONE_NAME',
            'CAM02.NAME',
            'ACC07.NAME',
            'ACC07.ACCOUNT_STATUS',
            'ACC07.CREATED_TIME',
            'NULL',
            'ACC07.BUSINESS_COUNTRY_CODE',
            'ADS10.NAME',
            'CAM02.START_TIME',
            'CAM02.STOP_TIME',
            "'facebook'",
          ],
          join: [
            {
              alias: 'BAS06',
              object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.BASIC_AD',
              on: 'ADH08.ID = BAS06.AD_ID',
              type: 'INNER' as JoinTypes,
            },
            {
              alias: 'ACC07',
              object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.ACCOUNT_HISTORY',
              on: 'ADH08.ACCOUNT_ID = ACC07.ID',
              qualify: 'row_number() over (partition by id order by _fivetran_synced desc) = 1',
              type: 'LEFT' as JoinTypes,
            },
            {
              alias: 'CAM02',
              object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.CAMPAIGN_HISTORY',
              on: 'ADH08.CAMPAIGN_ID = CAM02.ID',
              qualify: 'row_number() over (partition by id order by TO_TIMESTAMP_NTZ(UPDATED_TIME) desc) = 1',
              type: 'LEFT' as JoinTypes,
            },
            {
              alias: 'ADS10',
              object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.AD_SET_HISTORY',
              on: 'ADH08.AD_SET_ID = ADS10.ID',
              qualify: 'row_number() over (partition by id order by TO_TIMESTAMP_NTZ(UPDATED_TIME) desc) = 1',
              type: 'INNER' as JoinTypes,
            },
          ],
          source: {
            alias: 'ADH08',
            object: '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.AD_HISTORY',
            qualify: 'row_number() over (partition by id order by TO_TIMESTAMP_NTZ(UPDATED_TIME) desc) = 1',
          },
        },
      ],
      labels: ['label1'],
      process_name: 'CAMPAIGN_PERFORMANCE',
      process_type_id: 1,
      settings: {
        target_interval: 'hours',
        target_lag: 24,
        warehouse: 'MDFSV3SPCS_BUILD_WH',
      },
      target: {
        alias: 'CAM10',
        columns: [
          {
            name: 'AD_GROUP_ID',
            type: 'NUMBER',
          },
          {
            name: 'CAMPAIGN_ID',
            type: 'NUMBER',
          },
          {
            name: 'DATE',
            type: 'DATE',
          },
          {
            name: 'IMPRESSIONS',
            type: 'NUMBER',
          },
          {
            name: 'CLICKS',
            type: 'NUMBER',
          },
          {
            name: 'SPEND',
            type: 'NUMBER',
          },
          {
            name: 'CURRENCY_KEY',
            type: 'VARCHAR',
          },
          {
            name: 'TIMEZONE',
            type: 'VARCHAR',
          },
          {
            name: 'CAMPAIGN_NAME',
            type: 'VARCHAR',
          },
          {
            name: 'ACCOUNT_NAME',
            type: 'VARCHAR',
          },
          {
            name: 'ACCOUNT_STATUS',
            type: 'VARCHAR',
          },
          {
            name: 'ACCOUNT_CREATED_AT',
            type: 'DATE',
          },
          {
            name: 'ACCOUNT_UPDATED_AT',
            type: 'DATE',
          },
          {
            name: 'BUSINESS_COUNTRY_CODE',
            type: 'VARCHAR',
          },
          {
            name: 'AD_GROUP_NAME',
            type: 'VARCHAR',
          },
          {
            name: 'DATE_START_CAMPAIGN',
            type: 'DATE',
          },
          {
            name: 'DATE_END_CAMPAIGN',
            type: 'DATE',
          },
          {
            name: 'PLATFORM_NAME',
            type: 'VARCHAR',
          },
        ],
        object: '<TARGET_DATABASE>.TARGET.CAMPAIGN_PERFORMANCE',
      },
    },
  ],
};
