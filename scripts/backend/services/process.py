import json
import time
import model_manager.model_manager as ModelManager
import model_manager.process_status as status
from model_manager.process_results import ProcessResult
from snowflake.snowpark.functions import col, lit, max as max_
from snowflake.snowpark.session import Session
from exceptions.invalid_model_id import InvalidModelId
from globals import *
from exceptions.invalid_sql import InvalidSql
from exceptions.length_mismatch import LengthMissmatch
import pandas as pd
import jsonpickle
from utils.model_helpers import connect_to_snowflake



def get_model_sources(model_id: int, sp_session: Session):
    df = sp_session.table([APPLICATION, METADATA_SCHEMA, SOURCES_TABLE])\
        .where(col(MODEL_ID_COL)== lit(model_id)).select(
                                                    col(PROVIDER_NAME_COL), 
                                                    col(CONNECTOR_NAME_COL), 
                                                    col(DATABASE_COL),
                                                    col(SCHEMA_COL)
                                                    ).collect()
    
    return df

def get_preview(process: dict):
    try:
        template = ModelManager.get_template(2)
        sql_command = ModelManager.get_sql_jinja(template, process)
        result = ModelManager.test_query(sql_command)
        row_count = result.count()
        if "limit" in process.keys():
            result = result.limit(process["limit"]).collect()
        else:
            result = result.limit(50).collect()
        return {"data": result, "total_row_count": row_count}
    except Exception as e:
        raise InvalidSql(f"Invalid SQL: {e}", 500) from e
    

def get_processes(sp_session: Session, model_id: int):
     df = sp_session.table([APPLICATION, METADATA_SCHEMA, PROCESSES_TABLE])\
        .where(col(MODEL_ID_COL)== lit(model_id)).select(
                                                    col(MODEL_ID_COL), 
                                                    col(PROCESS_ID_COL),
                                                    col(PROCESS_NAME_KEY), 
                                                    col(STATUS_COL)
                                                    ).to_pandas().to_json(orient="records")
     return df


def compare_types(sources: list, targets: list):

    def standardize_type(item):
        varchar = {
            "values": [
                "VARCHAR",
                "CHAR",
                "CHARACTER",
                "STRING",
                "TEXT",
                "BINARY",
                "VARBINARY",
            ],
            "standard": "VARCHAR",
        }
        numeric = {
            "values": [
                "DOUBLE",
                "DOUBLE PRECISION",
                "REAL",
                "FLOAT",
                "FLOAT4",
                "FLOAT8",
                "NUMBER",
                "DECIMAL",
                "NUMERIC",
                "INT",
                "INTEGER",
                "BIGINT",
                "SMALLINT",
                "TINYINT",
                "BYTEINT",
            ],
            "standard": "NUMERIC",
        }
        date_time = {
            "values": [
                "DATE",
                "DATETIME",
                "TIME",
                "TIMESTAMP",
                "TIMESTAMP_LTZ",
                "TIMESTAMP_NTZ",
                "TIMESTAMP_TZ",
            ],
            "standard": "TIMESTAMP",
        }
        variant = {"values": ["VARIANT", "OBJECT", "ARRAY"], "standard": "VARIANT"}

        types = [varchar, numeric, date_time, variant]
        
        for type in types:
            if item in type["values"]:
                return type["standard"]

        return item

    if len(sources) != len(targets):
        raise LengthMissmatch("Sources and targets have different lengths", 500)
    else:
        results = []
        for source, target in zip(sources, targets):
            source = standardize_type(source)
            target = standardize_type(target)
            if source == target:
                results.append(True)
            elif target == "VARCHAR":
                results.append(True)
            elif source == "NULL":
                results.append(True)
            else:
                results.append(False)
        if False in results:
            raise InvalidSql(f"Missmatch", 500)
        return results


def source_validation(process: dict):
    targets = [col["type"] for col in process["targets"][0]["target"]["columns"]]
    template = ModelManager.get_template(3)
    sql_command = ModelManager.get_sql_jinja(
        template, process["targets"][0]["definitions"][0]
    )
    result = ModelManager.test_query(sql_command).fillna("NULL")
    columns = result.columns
    for index, column in enumerate(columns):
        if index == 0:
            sources = result.select(col(column))
        else:
            sources = sources.unionAll(result.select(col(column)))
    sources = [row.__getitem__("COL1") for row in sources.select(col("COL1")).collect()]
    results = compare_types(sources, targets)
    return {"data": results}
    
    
def processes_table(sp_session: Session):
    table = sp_session.table([APPLICATION, METADATA_SCHEMA, PROCESSES_TABLE])
    return table


def process_runner(process: str, managed_processes: dict) -> ProcessResult:
    if managed_processes[process] == "deleted":
        return ProcessResult["Deleted"]
    else:
        try:
            return ModelManager.run_process(managed_processes[process])
        except Exception as e:
            error = ProcessResult["Error"]
            result = dict(error)
            result.update({"message": str(e)})
            return result


def save_process(processes: dict, model_id: int = None) -> dict:
    ModelManager.manage_process(processes, status.DRAFT, model_id)
    return {"result": "Process saved sucessfully"}


def replace_string_in_dict(d, old, new):
    if isinstance(d, dict):
        return {k: replace_string_in_dict(v, old, new) for k, v in d.items()}
    elif isinstance(d, list):
        return [replace_string_in_dict(i, old, new) for i in d]
    elif isinstance(d, str):
        return d.replace(old, new)
    else:
        return d

def replace_placeholder_db_schema(model: dict, provider: str, connector: str, database: str, schema: str):
    if provider == 'FacebookAds' and connector == 'Fivetran':
        model = replace_string_in_dict(model, "<SOURCE_DATABASE_FIVETRAN_FACEBOOK>", database)
        model = replace_string_in_dict(model, "<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>", schema)
    elif provider in ('googleAnalytics', 'SalesforceMarketingCloud') and connector in ('GoogleAnalyticsNativeConnector', 'SalesforceNativeConnector'):
        model = replace_string_in_dict(model, "<SOURCE_DATABASE_C360_DEMO>", database)
        model = replace_string_in_dict(model, "<SOURCE_SCHEMA_C360_DEMO>", schema)
    elif provider == 'LinkedInAds' and connector == 'Omnata':
        model = replace_string_in_dict(model, "<SOURCE_DATABASE_OMNATA_LINKEDIN>", database)
        model = replace_string_in_dict(model, "<SOURCE_SCHEMA_OMNATA_LINKEDIN>", schema)
    #TODO add omnata linkedin
    return model


def execute_process(processes: dict, model_id: int = None) -> "List[ProcessResult]":
    managed_processes = ModelManager.manage_process(processes, status.RUNNING, model_id)
    results = []
    for idx, process in enumerate(managed_processes.keys()):
        p_result = process_runner(process, managed_processes)
        result = dict(p_result)
        result.update({"name": process})
        result.update({"index": f'{idx}/{len(managed_processes)}'})
        results.append(result)     
    return jsonpickle.encode(results, unpicklable=False)


def execute_model(sp_session: Session, model_id: int):
    query = processes_table(sp_session).where(col(MODEL_ID_COL) == lit(model_id))
    process = query.to_pandas()

    if len(process) <= 0:
        raise InvalidModelId("Model not found or does not exists", 400)

    processes = process[PROCESS_ATTRIBUTES_COL]
    processes = list(map(lambda process: json.loads(process), processes))
    targets = {TARGETS_COL: processes}
    return execute_process(targets, model_id)
    
    

def update_dependant_processes(sp_session: Session, sources: list):
    for source in sources:
        table = processes_table(sp_session)
        processes_to_update = table.where(
            col(MODEL_ID_COL) == lit(source[MODEL_ID_COL])
        ).collect()
        if processes_to_update:
            for process in processes_to_update:
                process_id = lit(process[PROCESS_ID_KEY])
                attributes = json.loads(process[PROCESS_ATTRIBUTES_COL])
                definitions = attributes.get(DEFINITIONS_COL, [])
                filtered_definitions = [
                    definition
                    for definition in definitions
                    if not check_source(
                        definition, source[DATABASE_NAME_KEY], source[SCHEMA_NAME_KEY]
                    )
                ]
                attributes[DEFINITIONS_COL] = filtered_definitions
                table.update(
                    {PROCESS_ATTRIBUTES_COL: attributes},
                    condition=table[PROCESS_ID_KEY] == process_id,
                )


def check_source(element: dict, database: str, schema: str):
    schema_path = f"{database}.{schema}"
    source = element.get(SOURCE_COL, {})
    source_object = source.get(OBJECT_COL, "")
    return schema_path in source_object


def get_all_tables_in_schema(sp_session, database, schema):
    tables_list = sp_session.sql(f"SHOW TABLES IN {database}.{schema}").collect()
    tables_model_list = [
        {
            "type": "source",
            "tableName": row[1],
            "schemaName": schema,
            "databaseName": database,
        }
        for row in tables_list
    ]
    return tables_model_list


def create_model_data(content):
    return [
        {
            "MODEL_NAME": content["MODEL_NAME"],
            "TARGET_DATABASE": content["TARGET_DATABASE"],
            "TARGET_SCHEMA": content["TARGET_SCHEMA"],
            "MODEL_UI": content["MODEL_UI"],
        }
    ]


def get_new_model_id():
    sp_session = connect_to_snowflake()
    model_id = sp_session.table([APPLICATION, METADATA_SCHEMA, MODELS_TABLE]).select(max_(col(MODEL_ID_COL)))\
        .collect()[0].__getitem__(0)
    if model_id:
        model_id += 1
    else:
        model_id = 1
    return int(model_id)