create or replace TABLE <DB>.<SCHEMA>.SIMPLEMAPS (
	CITY VARCHAR(16777216),
	CITY_ASCII VARCHAR(16777216),
	LAT FLOAT,
	LNG FLOAT,
	COUNTRY VARCHAR(16777216),
	ISO2 VARCHAR(16777216),
	ISO3 VARCHAR(16777216),
	ADMIN_NAME VARCHAR(16777216),
	CAPITAL VARCHAR(16777216),
	POPULATION VARCHAR(16777216),
	ID NUMBER(38,0));


CREATE OR REPLACE FILE FORMAT <DB>.<SCHEMA>.CSV_FORMAT TYPE=CSV
    SKIP_HEADER=1
    FIELD_DELIMITER=','
    TRIM_SPACE=TRUE
    FIELD_OPTIONALLY_ENCLOSED_BY='"'
    REPLACE_INVALID_CHARACTERS=TRUE
    DATE_FORMAT=AUTO
    TIME_FORMAT=AUTO
    TIMESTAMP_FORMAT=AUTOs;

COPY INTO "<DB>"."<SCHEMA>"."SIMPLEMAPS" 
FROM (SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
	FROM '@"<DB>"."<SCHEMA>"."<STAGE>"/data/worldcities.csv') 
FILE_FORMAT = '<DB>.<SCHEMA>.CSV_FORMAT' 
ON_ERROR=ABORT_STATEMENT;


CREATE OR REPLACE SCHEMA <DB>.GOOGLE_AN_SAMPLE;
CREATE OR REPLACE SCHEMA <DB>.SALESFORCE_SAMPLE;

CREATE OR REPLACE TABLE  <DB>.GOOGLE_AN_SAMPLE.GA_RAW_DATA 
               ( EVENT_DATE DATE , EVENT_TIMESTAMP VARCHAR , EVENT_NAME VARCHAR , EVENT_PREVIOUS_TIMESTAMP VARCHAR , EVENT_VALUE_IN_USD VARCHAR , 
               EVENT_BUNDLE_SEQUENCE_ID NUMBER , EVENT_SERVER_TIMESTAMP_OFFSET VARCHAR , USER_ID VARCHAR , USER_PSEUDO_ID VARCHAR , 
               PRIVACY_INFO_ANALYTICS_STORAGE VARCHAR , PRIVACY_INFO_ADS_STORAGE VARCHAR , PRIVACY_INFO_USES_TRANSIENT_TOKEN BOOLEAN , 
               USER_PROPERTIES VARCHAR , USER_FIRST_TOUCH_TIMESTAMP VARCHAR , USER_LTV_CURRENCY VARCHAR , 
               DEVICE_CATEGORY VARCHAR , DEVICE_MOBILE_BRAND_NAME VARCHAR , DEVICE_MOBILE_MODEL_NAME VARCHAR , DEVICE_MOBILE_MARKETING_NAME VARCHAR , 
               DEVICE_MOBILE_OS_HARDWARE_MODEL VARCHAR , DEVICE_OPERATING_SYSTEM VARCHAR , DEVICE_OPERATING_SYSTEM_VERSION VARCHAR , DEVICE_VENDOR_ID VARCHAR , 
               DEVICE_ADVERTISING_ID VARCHAR , DEVICE_LANGUAGE VARCHAR , DEVICE_IS_LIMITED_AD_TRACKING BOOLEAN , DEVICE_TIME_ZONE_OFFSET_SECONDS VARCHAR , 
               DEVICE_BROWSER VARCHAR , DEVICE_BROWSER_VERSION VARCHAR , DEVICE_WEB_INFO_BROWSER VARCHAR , DEVICE_WEB_INFO_BROWSER_VERSION VARCHAR , 
               GEO_CONTINENT VARCHAR , GEO_COUNTRY VARCHAR , GEO_REGION VARCHAR , GEO_CITY VARCHAR , GEO_SUB_CONTINENT VARCHAR , GEO_METRO VARCHAR , 
               APP_INFO_ID VARCHAR , APP_INFO_VERSION VARCHAR , APP_INFO_INSTALL_STORE VARCHAR , APP_INFO_FIREBASE_APP_ID VARCHAR , APP_INFO_INSTALL_SOURCE VARCHAR , 
               TRAFFIC_SOURCE_MEDIUM VARCHAR , STREAM_ID NUMBER , PLATFORM VARCHAR , EVENT_DIMENSIONS_HOSTNAME VARCHAR , ECOMMERCE_TOTAL_ITEM_QUANTITY VARCHAR , 
               ECOMMERCE_PURCHASE_REVENUE_IN_USD VARCHAR , ECOMMERCE_PURCHASE_REVENUE VARCHAR , ECOMMERCE_REFUND_VALUE_IN_USD VARCHAR , ECOMMERCE_REFUND_VALUE VARCHAR , 
               ECOMMERCE_SHIPPING_VALUE_IN_USD VARCHAR , ECOMMERCE_SHIPPING_VALUE VARCHAR , ECOMMERCE_TAX_VALUE_IN_USD VARCHAR , ECOMMERCE_TAX_VALUE VARCHAR , 
               ECOMMERCE_UNIQUE_ITEMS VARCHAR , ECOMMERCE_TRANSACTION_ID VARCHAR , ITEMS VARCHAR , COLLECTED_TRAFIC_SOURCE_MANUAL_CAMPAIGN_ID VARCHAR , 
               COLLECTED_TRAFIC_SOURCE_MANUAL_MEDIUM VARCHAR , COLLECTED_TRAFIC_SOURCE_GCLID VARCHAR , COLLECTED_TRAFIC_SOURCE_DCLID VARCHAR , 
               COLLECTED_TRAFIC_SOURCE_SRSLTID VARCHAR , DEVICE_WEB_INFO_HOSTNAME VARCHAR , COLLECTED_TRAFIC_SOURCE_MANUAL_CAMPAIGN_NAME VARCHAR , 
               COLLECTED_TRAFIC_SOURCE_MANUAL_SOURCE VARCHAR , TRAFFIC_SOURCE_SOURCE VARCHAR , TRAFFIC_SOURCE_NAME VARCHAR , COLLECTED_TRAFIC_SOURCE_MANUAL_CONTENT VARCHAR , 
               COLLECTED_TRAFIC_SOURCE_MANUAL_TERM VARCHAR , USER_LTV_REVENUE NUMBER, EVENT_PARAMS_UTMS VARIANT );


COPY INTO "<DB>"."GOOGLE_AN_SAMPLE"."GA_RAW_DATA" 
FROM (SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, 
$35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, 
$69, $70, $71, $72 
	FROM '@"<DB>"."<SCHEMA>"."<STAGE>"/data/ga_data/') 
FILE_FORMAT = '<DB>.<SCHEMA>.CSV_FORMAT' 
ON_ERROR=ABORT_STATEMENT;

CREATE OR REPLACE TABLE  <DB>.C360_SAMPLE_SCHEMA.SALESFORCE_RAW_DATA 
                ( SALESFORCE_CAMPAIGN_MEMBER_ID VARCHAR , SALESFORCE_CAMPAIGN_ID VARCHAR , SALESFORCE_PERSON_ID VARCHAR , 
                SALESFORCE_ACCOUNT_ID VARCHAR , FIRST_ASSOCIATED_DATE VARCHAR , HAS_RESPONDED VARCHAR , FIRST_RESPONDED_DATE VARCHAR , 
                RESPONSE_GEO VARCHAR , RESPONSE_COUNTRY VARCHAR , EMPLOYEE VARCHAR , 
                CAMPAIGN_PARTNER VARCHAR , CAMPAIGN_PARTNER_OR_EMPLOYEE VARCHAR , SALESFORCE_CAMPAIGN_NAME VARCHAR , 
                SALESFORCE_ACCOUNT_NAME VARCHAR , SALESFORCE_PERSON_NAME VARCHAR, QUERY_PARAMETERS_UTMS VARCHAR, STATUS VARCHAR );

COPY INTO "<DB>"."C360_SAMPLE_SCHEMA"."SALESFORCE_RAW_DATA" 
FROM (SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
	FROM '@"<DB>"."<SCHEMA>"."<STAGE>"/data/sf_data/') 
FILE_FORMAT = '<DB>.<SCHEMA>.CSV_FORMAT' 
ON_ERROR=ABORT_STATEMENT ;

CREATE OR REPLACE VIEW <DB>.C360_SAMPLE_SCHEMA.CUSTOMER72_GA_LAT_LONG_VW as select * from <DB>.GOOGLE_AN_SAMPLE.GA_RAW_DATA a join <DB>.<SCHEMA>.SIMPLEMAPS b on b.city_ascii = a.geo_city;

CREATE OR REPLACE VIEW <DB>.SALESFORCE_SAMPLE.SALESFORCE_VW AS 
            select CAMPAIGN_PARTNER,CAMPAIGN_PARTNER_OR_EMPLOYEE,EMPLOYEE,FIRST_ASSOCIATED_DATE,FIRST_RESPONDED_DATE,HAS_RESPONDED,
            QUERY_PARAMETERS_UTMS as SALESFORCE_QUERY_PARAMETERS_UTMS,RESPONSE_COUNTRY,RESPONSE_GEO,SALESFORCE_ACCOUNT_ID,SALESFORCE_ACCOUNT_NAME,SALESFORCE_CAMPAIGN_ID,
            SALESFORCE_CAMPAIGN_MEMBER_ID,SALESFORCE_CAMPAIGN_NAME,SALESFORCE_PERSON_ID,
            SALESFORCE_PERSON_NAME,STATUS, SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, 'utm_source=', 2),'&',0) as SF_UTM_SOURCE,
               SPLIT_PART(SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, 'utm_source=', 2),'%utm_medium%=',2), '%', 1) as SF_UTM_MEDIUM, 
               SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, '%utm_campaign%=', 2),'%',0) as SF_utm_campaign,
               SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, '%utm_content%=', 2),'%',0) as SF_utm_ad_name,
               SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, '%ad_id%=', 2),'%',0) as SF_utm_ad_id
               from <DB>.C360_SAMPLE_SCHEMA.SALESFORCE_RAW_DATA;

CREATE OR REPLACE VIEW <DB>.C360_SAMPLE_SCHEMA.CUSTOMER72_GA_LAT_LONG_UTMS_VW AS 
select  *, value:value.string_value as QUERY_PARAMETERS_UTMS, SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, 'utm_source=', 2),'&',0) as UTM_SOURCE,
               SPLIT_PART(SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, 'utm_source=', 2),'%utm_medium=',2), '%', 1) as UTM_MEDIUM, 
               SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, '%utm_campaign%=', 2),'%',0) as utm_campaign,
               SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, '%utm_content%=', 2),'%',0) as utm_ad_name,
               SPLIT_PART(SPLIT_PART(QUERY_PARAMETERS_UTMS, '%ad_id%=', 2),'%',0) as utm_ad_id from C360_SAMPLE_SCHEMA.CUSTOMER72_GA_LAT_LONG_VW,  LATERAL FLATTEN( INPUT => PARSE_JSON(EVENT_PARAMS_UTMS) );


