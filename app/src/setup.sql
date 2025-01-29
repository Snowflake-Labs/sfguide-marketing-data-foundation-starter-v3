CREATE APPLICATION ROLE IF NOT EXISTS app_admin;
CREATE APPLICATION ROLE IF NOT EXISTS app_user;
CREATE SCHEMA IF NOT EXISTS app_public;
GRANT USAGE ON SCHEMA app_public TO APPLICATION ROLE app_admin;
GRANT USAGE ON SCHEMA app_public TO APPLICATION ROLE app_user;
CREATE OR ALTER VERSIONED SCHEMA v1;
GRANT USAGE ON SCHEMA v1 TO APPLICATION ROLE app_admin;


CREATE OR REPLACE PROCEDURE v1.register_single_callback(ref_name STRING, operation STRING, ref_or_alias STRING)
 RETURNS STRING
 LANGUAGE SQL
 AS $$
      BEGIN
      CASE (operation)
         WHEN 'ADD' THEN
            SELECT system$set_reference(:ref_name, :ref_or_alias);
         WHEN 'REMOVE' THEN
            SELECT system$remove_reference(:ref_name);
         WHEN 'CLEAR' THEN
            SELECT system$remove_reference(:ref_name);
         ELSE
            RETURN 'Unknown operation: ' || operation;
      END CASE;
      RETURN 'Operation ' || operation || ' succeeds.';
      END;
   $$;
GRANT USAGE ON PROCEDURE v1.register_single_callback( STRING,  STRING,  STRING) TO APPLICATION ROLE app_admin;

CREATE OR REPLACE PROCEDURE app_public.start_app(poolname VARCHAR, whname VARCHAR)
    RETURNS string
    LANGUAGE sql
    AS $$
BEGIN
        EXECUTE IMMEDIATE 'CREATE SERVICE IF NOT EXISTS app_public.st_spcs
            IN COMPUTE POOL Identifier(''' || poolname || ''')
            FROM SPECIFICATION_FILE=''' || '/fullstack.yaml' || '''
            QUERY_WAREHOUSE=''' || whname || '''';
GRANT USAGE ON SERVICE app_public.st_spcs TO APPLICATION ROLE app_user;

RETURN 'Service started. Check status, and when ready, get URL';
END;
$$;
GRANT USAGE ON PROCEDURE app_public.start_app(VARCHAR, VARCHAR) TO APPLICATION ROLE app_admin;

CREATE OR REPLACE PROCEDURE app_public.stop_app()
    RETURNS string
    LANGUAGE sql
    AS
$$
BEGIN
    DROP SERVICE IF EXISTS app_public.st_spcs;
END
$$;
GRANT USAGE ON PROCEDURE app_public.stop_app() TO APPLICATION ROLE app_admin;

CREATE OR REPLACE PROCEDURE app_public.app_url()
    RETURNS string
    LANGUAGE sql
    AS
$$
DECLARE
    ingress_url VARCHAR;
BEGIN
    SHOW ENDPOINTS IN SERVICE app_public.st_spcs;
    SELECT "ingress_url" INTO :ingress_url FROM TABLE (RESULT_SCAN (LAST_QUERY_ID())) LIMIT 1;
    RETURN ingress_url;
END
$$;
GRANT USAGE ON PROCEDURE app_public.app_url() TO APPLICATION ROLE app_admin;
GRANT USAGE ON PROCEDURE app_public.app_url() TO APPLICATION ROLE app_user;


--  Application's specific objects initialization. These objects are used by the application to store metadata and logs.
/* -------- Setup scripts that runs at the initialization of the app -------- */

CREATE
SCHEMA IF NOT EXISTS METADATA;


CREATE
SCHEMA IF NOT EXISTS TARGET;

CREATE
OR REPLACE STAGE METADATA.DATA_CONTRACTS COMMENT = "Stores data contracts";


CREATE
OR REPLACE TABLE METADATA.LABELS(
    LABEL_ID INT PRIMARY KEY,
    LABEL_NAME VARCHAR,
    DESCRIPTION VARCHAR,
    ATTRIBUTES VARIANT,
    CREATED_TIMESTAMP TIMESTAMP_NTZ,
    MODIFIED_TIMESTAMP TIMESTAMP_NTZ
);

CREATE
OR REPLACE TABLE METADATA.OBJECTS(
    OBJECT_ID INT PRIMARY KEY,
    OBJECT_TYPE VARCHAR,
    DATABASE_NAME VARCHAR,
    SCHEMA_NAME VARCHAR,
    OBJECT_NAME VARCHAR,
    ATTRIBUTES VARIANT,
    LABELS ARRAY,
    ADDED_TIMESTAMP TIMESTAMP_NTZ,
    MODIFIED_TIMESTAMP TIMESTAMP_NTZ
);

CREATE
OR REPLACE TABLE METADATA.PROCESS_TYPES(
    PROCESS_TYPE_ID INT PRIMARY KEY,
    PROCESS_TYPE VARCHAR,
    DESCRIPTION VARCHAR,
    TEMPLATE VARCHAR,
    OBJECT_TYPE VARCHAR,
    OBJECT_ACTION VARCHAR,
    CREATED_TIMESTAMP TIMESTAMP_NTZ,
    MODIFIED_TIMESTAMP TIMESTAMP_NTZ
);

/* ------------------------------ SOURCES TABLES RELATION ----------------------------- */
CREATE
OR REPLACE TABLE METADATA.MODELS (
    MODEL_ID INT AUTOINCREMENT PRIMARY KEY,
    MODEL_NAME VARCHAR,
    TARGET_DATABASE VARCHAR,
    TARGET_SCHEMA VARCHAR,
    MODEL_UI VARIANT,
    CREATED_TIMESTAMP TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

CREATE
OR REPLACE TABLE METADATA.SOURCES (
    SOURCE_ID INT AUTOINCREMENT PRIMARY KEY,
    MODEL_ID INT,
    FOREIGN KEY (MODEL_ID) REFERENCES METADATA.MODELS(MODEL_ID),
    PROVIDER_NAME VARCHAR(255),
    CONNECTOR_NAME VARCHAR(255),
    DATABASE VARCHAR(255),
    SCHEMA VARCHAR(255),
    CREATED_TIMESTAMP TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
) COMMENT = 'Contains existing sources made by user.';

CREATE
OR REPLACE TABLE METADATA.PROCESSES (
    PROCESS_ID INT PRIMARY KEY,
    MODEL_ID INT,
    FOREIGN KEY (MODEL_ID) REFERENCES METADATA.MODELS(MODEL_ID),
    PROCESS_NAME VARCHAR,
    PROCESS_TYPE_ID INT,
    PROCESS_ATTRIBUTES OBJECT, 
    CREATED_TIMESTAMP TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    MODIFIED_TIMESTAMP TIMESTAMP_NTZ,
    STATUS VARCHAR // "RUNNING" | "COMPLETED" | "FAILED"| "DRAFT"
);

CREATE
OR REPLACE TABLE METADATA.PROCESS_LOG(
    PROCESS_LOG_ID INT AUTOINCREMENT PRIMARY KEY,
    PROCESS_RUN_ID INT,
    PROCESS_ID INT,
    PROCESS_START_TIMESTAMP TIMESTAMP_NTZ,
    PROCESS_END_TIMESTAMP TIMESTAMP_NTZ,
    PROCESS_OUTPUT VARIANT
);


INSERT INTO
    METADATA.PROCESS_TYPES (
        PROCESS_TYPE_ID,
        PROCESS_TYPE,
        DESCRIPTION,
        TEMPLATE,
        OBJECT_TYPE,
        OBJECT_ACTION,
        CREATED_TIMESTAMP,
        MODIFIED_TIMESTAMP
    )
VALUES(
        1,
        'target_dynamic_table',
        'a template that creates the target as a dynamic table',
        $$
  
CREATE OR REPLACE DYNAMIC TABLE {{ target["object"] | sqlsafe }}
{% if target["columns"] %}
(
        {{ target["columns"][0]["name"] | sqlsafe }} {{ target["columns"][0]["type"] | sqlsafe }}
    {% for column in target["columns"][1:]%}
        ,{{ column["name"] | sqlsafe}} {{ column["type"] | sqlsafe}}
    {% endfor %}
)
{% endif %}
TARGET_LAG = '{{ settings["target_lag"] | sqlsafe }} {{ settings["target_interval"] | sqlsafe }}'
WAREHOUSE = '{{ settings["warehouse"] | sqlsafe}}'
COMMENT = '{"origin":"sf_sit","name":"Marketing Data Foundation","version":{"major":1, "minor":0},"attributes":""}'
AS 
    {% for definition in definitions %}
        SELECT
            {{ definition['columns'][0] | sqlsafe}} 
        {% for column in definition['columns'][1:] %}
            ,{{ column | sqlsafe}}
        {% endfor %}
        FROM (
            SELECT * FROM {{ definition['source']["object"] | sqlsafe }}
        {% if definition['source']['where']  %}
            WHERE {{ definition['source']['where']  | sqlsafe }}
        {% endif %}
        {% if definition['source']['qualify']  %}
            QUALIFY {{ definition['source']['qualify'] | sqlsafe }}
        {% endif %}
            ) {{ definition['source']["alias"] | sqlsafe }}
        {% for j in definition['join'] %}
        {{ j["type"] | sqlsafe }} JOIN (
            SELECT * FROM
            {{ j["object"] | sqlsafe }}
            {% if j['where']  %}
                WHERE {{ j['where']  | sqlsafe }}
            {% endif %}
            {% if j['qualify']  %}
                QUALIFY {{ j['qualify'] | sqlsafe }}
            {% endif %}
            ) {{ j["alias"] | sqlsafe }} ON {{ j["on"] | sqlsafe }}
        {% endfor %}
        {% if definition['group_by']  %}
        GROUP BY 
            {{ definition['group_by'][0] | sqlsafe }}
        {% for gb in definition['group_by'][1:] %}
            ,{{ gb | sqlsafe }}
        {% endfor %}
        {% endif %}
        {% if definition['order_by']  %}
        ORDER BY 
            {{ definition['order_by'][0] | sqlsafe }}
        {% for ob in definition['order_by'][1:] %}
            ,{{ ob | sqlsafe }}
        {% endfor %}
        {% endif %}
        GROUP BY ALL
        {% if loop.index < loop.length  %}
            UNION ALL
        {% endif %}
    {% endfor %}
;

    $$,
        'dynamic table',
        'create',
        SYSDATE(),
        NULL
    ),
    (
        2,
        'sql_validator',
        'a template used to generate a select statement used to validate sql syntaxis',
        $$
SELECT
    {{ columns[0] | sqlsafe}} 
{% for column in columns[1:] %}
    ,{{ column | sqlsafe}}
{% endfor %}
{% if source["object"] %}
FROM (
    SELECT * FROM
    {{ source["object"] | sqlsafe }}
    {% if source['where']  %}
        WHERE {{ source['where']  | sqlsafe }}
    {% endif %}
    {% if source['qualify']  %}
        QUALIFY {{ source['qualify'] | sqlsafe }}
    {% endif %}
    ) {{ source["alias"] | sqlsafe }}
{% endif %}
{% for j in join %}
{{ j["type"] | sqlsafe }} JOIN (
    SELECT * FROM
    {{ j["object"] | sqlsafe }}
    {% if j['where']  %}
        WHERE {{ j['where']  | sqlsafe }}
    {% endif %}
    {% if j['qualify']  %}
        QUALIFY {{ j['qualify'] | sqlsafe }}
    {% endif %}
    ) {{ j["alias"] | sqlsafe }} ON {{ j["on"] | sqlsafe }}
{% endfor %}
{% if group_by  %}
GROUP BY 
    {{ group_by[0] | sqlsafe }}
{% for gb in group_by[1:] %}
    ,{{ gb | sqlsafe }}
{% endfor %}
{% endif %}
{% if order_by %}
ORDER BY 
    {{ order_by[0] | sqlsafe }}
{% for ob in order_by[1:] %}
    ,{{ ob | sqlsafe }}
{% endfor %}
{% endif %}
GROUP BY ALL

    $$,
        'select statement',
        'select',
        SYSDATE(),
        NULL
    ),
    (
        3,
        'source_validator',
        'a template used to generate to get data types for sources',
        $$
SELECT
    TYPEOF({{ columns[0] | sqlsafe}}::VARIANT) COL1
{% for column in columns[1:] %}
    ,TYPEOF({{ column | sqlsafe}}::VARIANT)
{% endfor %}
{% if source["object"] %}
FROM (
    SELECT * FROM
    {{ source["object"] | sqlsafe }}
    {% if source['where']  %}
        WHERE {{ source['where']  | sqlsafe }}
    {% endif %}
    {% if source['qualify']  %}
        QUALIFY {{ source['qualify'] | sqlsafe }}
    {% endif %}
    ) {{ source["alias"] | sqlsafe }}
{% endif %}
{% for j in join %}
{{ j["type"] | sqlsafe }} JOIN (
    SELECT * FROM
    {{ j["object"] | sqlsafe }}
    {% if j['where']  %}
        WHERE {{ j['where']  | sqlsafe }}
    {% endif %}
    {% if j['qualify']  %}
        QUALIFY {{ j['qualify'] | sqlsafe }}
    {% endif %}
    ) {{ j["alias"] | sqlsafe }} ON {{ j["on"] | sqlsafe }}
{% endfor %}
{% if group_by  %}
GROUP BY 
    {{ group_by[0] | sqlsafe }}
{% for gb in group_by[1:] %}
    ,{{ gb | sqlsafe }}
{% endfor %}
{% endif %}
{% if order_by %}
ORDER BY 
    {{ order_by[0] | sqlsafe }}
{% for ob in order_by[1:] %}
    ,{{ ob | sqlsafe }}
{% endfor %}
{% endif %}
GROUP BY ALL
LIMIT 1

    $$,
        'source and target validation',
        'select',
        SYSDATE(),
        NULL
    );

/* ----------------------------------- LLM ---------------------------------- */

CREATE SCHEMA IF NOT EXISTS LLM;

/* ------------------------ Chat bot assistant files ------------------------ */
CREATE
    OR REPLACE STAGE LLM.SEMANTIC_MODEL DIRECTORY = (ENABLE = TRUE) COMMENT = 'Used for holding semantic models used in the chat bot Marketing assitant.';

CREATE
    OR REPLACE STAGE LLM.CONFIGURATION DIRECTORY = (ENABLE = TRUE) COMMENT = 'Used for holding config file used in the chat bot Data Engineering assistant.';

CREATE
    OR REPLACE TABLE LLM.ASSISTANT (
        ID VARCHAR(255),
        NAME VARCHAR(255),
        SYS_PROMPT VARCHAR,
        USER VARCHAR,
        ASSISTANT VARCHAR,
        CHAT VARIANT
) COMMENT = 'Contains history on llm assistants conversations';

/* ------------------ Cortex API procedure to process text ------------------ */
CREATE OR REPLACE PROCEDURE LLM.GET_CHAT_RESPONSE(message VARCHAR, file VARCHAR, file_path VARCHAR)
    RETURNS VARIANT
    LANGUAGE PYTHON
    RUNTIME_VERSION = 3.8
    HANDLER = 'run'
    PACKAGES = ('snowflake')
    AS $$
import _snowflake
import json

def run(session, message, file, file_path):
    query_params = ""
    post_params = ""
    headers = { "Content-Type": "application/json" }
    request_body = {
        "messages": json.loads(message),
        "semantic_model_file": f"@{file_path}/{file}",
    }
    db, schema, stage = file_path.split('.')
    response = _snowflake.send_snow_api_request("POST", f"/api/v2/cortex/analyst/message", query_params, headers, request_body, post_params, 30000);

    return response
$$;
CREATE OR REPLACE PROCEDURE LLM.GET_CHAT_COMPLETE (model VARCHAR, messages VARCHAR)
    RETURNS TABLE()
    LANGUAGE SQL
    AS DECLARE res RESULTSET DEFAULT (
        SELECT
            snowflake.cortex.complete(:model, :messages)
    );
BEGIN RETURN TABLE(res);
END;
