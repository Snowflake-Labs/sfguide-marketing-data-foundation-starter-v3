--- Snowflake Solutions Marketplace teardown file.
--- Use this file to drop objects in the solution Snowflake account.
--- See producer documentation for details: https://app.dataops.live/snowflake/frostbyte-poc/producer-documentation.

--- CAUTION: This file will be executed with an account owner privilege
--- and so the content must be carefully reviewed before enabling it.

--- TIP: Enable this file by renaming to `teardwon.template.sql`

--- TIP: Use the ACCOUNTADMIN role.
USE ROLE accountadmin;

--- TIP: Use templating to access the correct instance objects.
-- DROP WAREHOUSE IF EXISTS {{ DATAOPS_CATALOG_SOLUTION_PREFIX }}_test_wh;

--- TIP: Use Jinja2 for loops to do the same thing for multiple objects.
-- {% for warehouse in ['DE_WH', 'DS_WH', 'BI_WH', 'DEV_WH', 'DATA_APP_WH', 'BUILD_WH'] %}
-- DROP WAREHOUSE IF EXISTS {{ DATAOPS_CATALOG_SOLUTION_PREFIX }}_{{warehouse}};
-- {% endfor %}

--- TIP: Drop instance database.
DROP DATABASE IF EXISTS {{ DATAOPS_DATABASE }};
DROP DATABASE FIVETRAN_CONNECTOR_DEMO;
DROP DATABASE OMNATA_CONNECTOR_DEMO;
DROP WAREHOUSE MARKETING_DATA_FOUNDATION_WAREHOUSE;
DROP DATABASE LLM_DEMO;
DROP DATABASE C360_SAMPLE_DB;
DROP COMPUTE POOL IF EXISTS  MARKETING_DATA_FOUNDATION_COMPUTE_POOL;

--- TIP: The service user will be dropped automatically.
--- TIP: When developing this file, create an instance of the 
--- solution and run this file (without template rendering) to test it.