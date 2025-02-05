
interface INotebook {
    t: (message: string) => string;
    org: string;
    account: string;
}

  //   TODO Move notebooks to app database and update links

export default function getNotebooks({t , org, account}:INotebook ) {

const notebooks =  [
    [
      t('DataQualityStarter'),
      t('DataQualityStarterDesc'),
      `https://app.snowflake.com/${org}/${account}/#/notebooks/C360LLM_DEMO.DEMO.%22Data%20Quality%20Demo%201%22`,
    ],
    [
      t('DataQualityStarter2'),
      t('DataQualityStarter2Desc'),
      `https://app.snowflake.com/${org}/${account}/#/notebooks/C360LLM_DEMO.DEMO.%22Data%20Quality%20Demo%202%22`,
    ],
    [
      t('DataQualityStarter3'),
      t('DataQualityStarter3Desc'),
      `https://app.snowflake.com/${org}/${account}/#/notebooks/C360LLM_DEMO.DEMO.%22Data%20Quality%20Demo%203%22`,
    ]

  ]
  return notebooks
}