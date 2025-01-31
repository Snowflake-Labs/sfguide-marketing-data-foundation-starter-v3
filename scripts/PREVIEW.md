# Welcome to the Marketing Data Foundation Starter V2

This solution provides a native application that can unify campaing intelligence data from 
different providers using connectors like Fivetran and Omnata.


## Before you start
> [!IMPORTANT]  
> Please make sure that your account has the following features enabled. Go to your account deployment and enable the features mentioned below:


### Snowflake Notebooks

``` SQL
alter account <account_locator> set
ENABLE_STREAMLIT = true,
FEATURE_NOTEBOOKS_V1 = 'ENABLED'  parameter_comment = 'notebook wh prpr';

alter account <account_locator> set UI_ENABLE_NOTEBOOK_CELL_STATUS = 'enabled' parameter_comment = 'notebook wh prpr';


// For the scheduler feature:
alter account <account_locator> set FEATURE_UI_ENABLE_NOTEBOOKS_SCHEDULING = 'ENABLED' parameter_comment = 'notebook wh scheduling prpr';
alter account <account_locator> set FEATURE_NOTEBOOKS_NON_INTERACTIVE_EXECUTION = 'ENABLED' parameter_comment = 'notebook wh scheduling prpr';

// For the stage importing feature:
alter account <account_locator> set ENABLE_FIX_910999_SKIP_CLEANUP_IN_FIRST_CODE_STAGE_DOWNLOAD = true
ENABLE_NOTEBOOK_PACKAGES_FROM_STAGE = true
FEATURE_UI_ENABLE_NOTEBOOK_PACKAGES_FROM_STAGE = 'ENABLED'
parameter_comment = 'Enable module importer for Notebooks';
```

### Cortex Analyst

This application leverages [Cortex Analyst](https://docs.snowflake.com/LIMITEDACCESS/snowflake-cortex/cortex-copilot-api-overview) currently on PrPr.

Request this feature to be enabled in your account using this [form](https://docs.google.com/forms/d/e/1FAIpQLSfgCr3o94L2iPAx_qXwZB0D3XLnLalGNlCEOu9doAevY6WtQQ/viewform)



