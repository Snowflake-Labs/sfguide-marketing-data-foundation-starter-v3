
interface INotebook {
    t: (message: string) => string;
    org: string;
    account: string;
}

  //   Fixed: Updated notebook database and names to match deployment
  //   URLs must be lowercase for org and account

export default function getNotebooks({t , org, account}:INotebook ) {

// Snowflake URLs require lowercase org and account names
const orgLower = org.toLowerCase();
const accountLower = account.toLowerCase();

const notebooks =  [
    [
      t('DataQualityStarter'),
      t('DataQualityStarterDesc'),
      `https://app.snowflake.com/${orgLower}/${accountLower}/#/notebooks/LLM_DEMO.DEMO.DATA_QUALITY_DEMO_1`,
    ],
    [
      t('DataQualityStarter2'),
      t('DataQualityStarter2Desc'),
      `https://app.snowflake.com/${orgLower}/${accountLower}/#/notebooks/LLM_DEMO.DEMO.DATA_QUALITY_DEMO_2`,
    ],
    [
      t('DataQualityStarter3'),
      t('DataQualityStarter3Desc'),
      `https://app.snowflake.com/${orgLower}/${accountLower}/#/notebooks/LLM_DEMO.DEMO.DATA_QUALITY_DEMO_3`,
    ]

  ]
  return notebooks
}