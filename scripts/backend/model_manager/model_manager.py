from __future__ import unicode_literals

import os
import re
import yaml
import json
import pandas as pd
import model_manager.process_status as status

from exceptions.invalid_sql import InvalidSql
from utils.model_helpers import connect_to_snowflake
from six import string_types
from copy import deepcopy
from jinjasql import JinjaSql
from globals import *
from snowflake.snowpark.functions import col, lit, max as max_
from model_manager.process_results import ProcessResult
from services.session import is_local


def manage_label(label_name, description, attributes):
    sp_session = connect_to_snowflake()
    try:

        label_id = pd.DataFrame(
            sp_session.sql(
                f"""SELECT MAX(LABEL_ID) FROM {APPLICATION}.METADATA.LABELS"""
            ).collect()
        ).iloc[0, 0]

        if label_id:
            label_id += 1
        else:
            label_id = 1

        attributes_str = ""
        if type(attributes).__name__ == "sqlNullWrapper":
            attributes_str = "NULL"
        else:
            attributes_str = json.dumps(attributes)

        sp_session.sql(
            f"""MERGE INTO {APPLICATION}.METADATA.LABELS l USING 
            (SELECT
                {label_id} LABEL_ID
                ,'{label_name}' LABEL_NAME
                ,{"$"}{"$"}{description}{"$"}{"$"} DESCRIPTION
                ,PARSE_JSON({"$"}{"$"}{attributes_str}{"$"}{"$"}) ATTRIBUTES
            ) AS nl
        ON 
            LOWER(l.LABEL_NAME) = LOWER(nl.LABEL_NAME)
        WHEN MATCHED THEN UPDATE SET 
            l.DESCRIPTION = nl.DESCRIPTION
            ,l.ATTRIBUTES = nl.ATTRIBUTES
            ,l.MODIFIED_TIMESTAMP = SYSDATE()
        WHEN NOT MATCHED THEN INSERT (LABEL_ID, LABEL_NAME, DESCRIPTION, ATTRIBUTES, CREATED_TIMESTAMP, MODIFIED_TIMESTAMP) VALUES 
            (
                nl.LABEL_ID
                ,nl.LABEL_NAME
                ,nl.DESCRIPTION
                ,nl.ATTRIBUTES
                ,SYSDATE()
                ,NULL
            )"""
        ).collect()

        status = f"Label: {label_name} added/updated."

        return status
    except Exception as e:

        error_eraw = (
            str(e)
            .replace("'", "")
            .replace("\r", " ")
            .replace("\n", " ")
            .replace("\r\n", " ")
            .replace("\n\r", " ")
        )

        msg_return = "Failed: " + error_eraw

        raise Exception(msg_return)


def manage_object(
    object_type: str, database_name: str, schema_name: str, object_name: str, labels
):
    sp_session = connect_to_snowflake()
    try:

        object_id = pd.DataFrame(
            sp_session.sql(
                f"""SELECT MAX(OBJECT_ID) FROM {APPLICATION}.METADATA.OBJECTS"""
            ).collect()
        ).iloc[0, 0]

        if object_id:
            object_id += 1
        else:
            object_id = 1

        if object_type.lower() in [
            "table",
            "view",
            "dynamic_table",
            "materialized_view",
            "",
        ]:

            object_type_show = ""
            if object_type.lower() == "dynamic_table":
                object_type_show = "table"
            elif object_type.lower() == "materialized_view":
                object_type_show = "view"
            else:
                object_type_show = object_type

            sp_session.sql(
                f"SHOW COLUMNS IN {object_type_show} {database_name}.{schema_name}.{object_name}"
            ).collect()

            sp_session.sql(
                f"""MERGE INTO {APPLICATION}.METADATA.OBJECTS obj USING 
                (SELECT
                    {object_id} OBJECT_ID
                    ,'table' OBJECT_TYPE
                    ,"database_name" DATABASE_NAME
                    ,"schema_name" SCHEMA_NAME
                    ,"table_name" OBJECT_NAME
                    ,ARRAY_AGG(object_construct(
                        'column_name',"column_name",
                        'data_type',parse_json("data_type"):type::varchar,
                        'is_nullable',parse_json("data_type"):nullable::boolean,
                        'precision',parse_json("data_type"):precision::number,
                        'scale',parse_json("data_type"):scale::number,
                        'length',parse_json("data_type"):length::number,
                        'byte_length',parse_json("data_type"):byteLength::number,
                        'description',null,
                        'null?',null
                        )) ATTRIBUTES
                    ,{labels} LABELS
                FROM table(RESULT_SCAN(LAST_QUERY_ID()))
                GROUP BY "database_name", "schema_name", "table_name"
                ) AS nobj 
            ON 
                LOWER(obj.DATABASE_NAME) = LOWER(nobj.DATABASE_NAME)
                AND LOWER(obj.SCHEMA_NAME) = LOWER(nobj.SCHEMA_NAME)
                AND LOWER(obj.OBJECT_NAME) = LOWER(nobj.OBJECT_NAME)
            WHEN MATCHED THEN UPDATE SET 
                obj.ATTRIBUTES = nobj.ATTRIBUTES
                ,obj.LABELS = nobj.LABELS
                ,obj.MODIFIED_TIMESTAMP = SYSDATE()
            WHEN NOT MATCHED THEN INSERT (OBJECT_ID, OBJECT_TYPE, DATABASE_NAME, SCHEMA_NAME, OBJECT_NAME, ATTRIBUTES, LABELS, ADDED_TIMESTAMP, MODIFIED_TIMESTAMP) VALUES 
                (
                    nobj.OBJECT_ID
                    ,nobj.OBJECT_TYPE
                    ,nobj.DATABASE_NAME
                    ,nobj.SCHEMA_NAME
                    ,nobj.OBJECT_NAME
                    ,nobj.ATTRIBUTES
                    ,nobj.LABELS
                    ,SYSDATE()
                    ,NULL
                )"""
            ).collect()
            status = f"{object_type.upper()}: {database_name}.{schema_name}.{object_name} attributes added/updated."
        else:
            status = f"Error: Object type: {object_type} is invalid.  Please submit with a valid object type."

        return status
    except Exception as e:

        error_eraw = (
            str(e)
            .replace("'", "")
            .replace("\r", " ")
            .replace("\n", " ")
            .replace("\r\n", " ")
            .replace("\n\r", " ")
        )

        msg_return = "Failed: " + error_eraw

        raise Exception(msg_return)


def manage_process(processes: dict, status: str, model_id: int):
    sp_session = connect_to_snowflake()
    managed_processes = {}
    existing_model = False

    try:
        if model_id:
            existing_model = True
            pass
        else:
            model_id = pd.DataFrame(
                sp_session.sql(
                    f"""SELECT MAX(MODEL_ID) FROM {APPLICATION}.METADATA.PROCESSES"""
                ).collect()
            ).iloc[0, 0]

            if model_id:
                model_id += 1
            else:
                model_id = 1
        existing_proceses = []
        for process in processes[TARGETS_COL]:
            existing_proceses.append(process[PROCESS_NAME_KEY])
            process_id = (
                sp_session.table([APPLICATION, METADATA_SCHEMA, PROCESSES_TABLE])
                .select(max_(PROCESS_ID_COL))
                .collect()[0]
                .__getitem__(0)
            )

            if process_id:
                process_id += 1
            else:
                process_id = 1
            process_name = process[PROCESS_NAME_KEY]

            process_type_id = process[PROCESS_TYPE_ID_KEY]
            attributes_str = json.dumps(process)

            sp_session.sql(
                f"""MERGE INTO {APPLICATION}.METADATA.PROCESSES p USING 
                (SELECT
                    {process_id} PROCESS_ID
                    ,'{process_name}' PROCESS_NAME
                    ,{process_type_id} PROCESS_TYPE_ID
                    ,PARSE_JSON({"$"}{"$"}{attributes_str}{"$"}{"$"}) PROCESS_ATTRIBUTES
                    ,{model_id} MODEL_ID
                    ,'{status}' STATUS

                ) AS np 
            ON LOWER(p.PROCESS_NAME) = LOWER('{process_name}')
            WHEN MATCHED THEN UPDATE SET 
                p.PROCESS_ATTRIBUTES = np.PROCESS_ATTRIBUTES
                ,p.MODIFIED_TIMESTAMP = SYSDATE()
                ,p.MODEL_ID = np.MODEL_ID
                ,p.STATUS = np.STATUS
            WHEN NOT MATCHED THEN INSERT (PROCESS_ID, PROCESS_NAME, PROCESS_TYPE_ID, PROCESS_ATTRIBUTES,
            CREATED_TIMESTAMP, MODIFIED_TIMESTAMP, STATUS, MODEL_ID) VALUES 
                (
                    np.PROCESS_ID
                    ,np.PROCESS_NAME
                    ,np.PROCESS_TYPE_ID
                    ,np.PROCESS_ATTRIBUTES
                    ,SYSDATE()
                    ,NULL
                    ,np.STATUS
                    ,np.MODEL_ID
                )"""
            ).collect()
            managed_processes[process_name] = (
                sp_session.table([APPLICATION, METADATA_SCHEMA, PROCESSES_TABLE])
                .select(col(PROCESS_ID_COL))
                .where(col(PROCESS_NAME_KEY) == lit(process_name))
                .collect()[0]
                .__getitem__(PROCESS_ID_COL)
            )
        if existing_model:
            if len(existing_proceses) == 0:
                existing_proceses = [""]
            to_drop = (
                sp_session.table([APPLICATION, METADATA_SCHEMA, PROCESSES_TABLE])
                .where(
                    (col(MODEL_ID_COL) == lit(model_id))
                    & ((col(PROCESS_NAME_KEY).isin(existing_proceses) == lit(False)))
                )
                .select(col(PROCESS_NAME_KEY), col(PROCESS_ATTRIBUTES_COL))
                .collect()
            )
            for table in to_drop:
                process_name = table.__getitem__(PROCESS_NAME_KEY.upper())
                table_name = json.loads(table.__getitem__(PROCESS_ATTRIBUTES_COL))[
                    TARGET_KEY
                ][OBJECT_KEY].split(".")
                exists = sp_session.table(
                    [table_name[0], INFORMATION_SCHEMA, TABLES_COL]
                ).where(
                    (col(TABLE_SCHEMA_COL) == lit(table_name[1]))
                    & (col(TABLE_NAME_COL) == lit(table_name[2]))
                )

                managed_processes[process_name] = "deleted"
                sp_session.table(
                    [APPLICATION, METADATA_SCHEMA, PROCESSES_TABLE]
                ).delete(
                    (col(MODEL_ID_COL) == lit(model_id))
                    & ((col(PROCESS_NAME_KEY).isin(existing_proceses) == lit(False)))
                )
                if len(exists.collect()) > 0:
                    sp_session.table(table_name).drop_table()
        return managed_processes

    except Exception as e:
        error_eraw = (
            str(e)
            .replace("'", "")
            .replace("\r", " ")
            .replace("\n", " ")
            .replace("\r\n", " ")
            .replace("\n\r", " ")
        )

        msg_return = "Failed: " + error_eraw

        raise Exception(msg_return)


def get_sql_jinja(template: str, parameters: dict):

    def quote_sql_string(value):
        """
        If `value` is a string type, escapes single quotes in the string
        and returns the string enclosed in single quotes.
        """
        if isinstance(value, string_types):
            new_value = str(value)
            new_value = new_value.replace("'", "''")
            new_value2 = re.sub(r"[^a-zA-Z0-9_.-]", "", new_value)
            return "'{}'".format(new_value2)
        return value

    def get_sql_from_template(query, bind_params):
        if not bind_params:
            return query
        params = deepcopy(bind_params)
        for key, val in params.items():
            params[key] = quote_sql_string(val)
        return query % params

    def strip_blank_lines(text):
        """
        Removes blank lines from the text, including those containing only spaces.
        https://stackoverflow.com/questions/1140958/whats-a-quick-one-liner-to-remove-empty-lines-from-a-python-string
        """
        return os.linesep.join([s for s in text.splitlines() if s.strip()])

    j = JinjaSql(param_style="pyformat")
    query, bind_params = j.prepare_query(template, parameters)
    return strip_blank_lines(get_sql_from_template(query, bind_params))


def test_query(sql_command: str):
    sp_session = connect_to_snowflake()
    try:
        data_df = sp_session.sql(f"""{sql_command}""")
    except Exception as e:
        raise InvalidSql(f"Invalid SQL: {e}", 500) from e
    return data_df


def get_template(process_type_id: int):
    sp_session = connect_to_snowflake()
    template = (
        sp_session.table([APPLICATION, METADATA_SCHEMA, PROCESS_TYPES_TABLE])
        .where(col(PROCESS_TYPE_ID_KEY) == lit(process_type_id))
        .select(col(TEMPLATE_COL))
        .collect()[0][0]
    )
    return template


def run_process(process_id: int) -> ProcessResult:
    sp_session = connect_to_snowflake()

    try:

        log_id = (
            sp_session.table([APPLICATION, METADATA_SCHEMA, "PROCESS_LOG"])
            .select(max_("PROCESS_LOG_ID"))
            .collect()[0]
            .__getitem__(0)
        )
        if log_id:
            log_id += 1
        else:
            log_id = 1

        run_id = (
            sp_session.table([APPLICATION, METADATA_SCHEMA, "PROCESS_LOG"])
            .select(max_("PROCESS_RUN_ID"))
            .collect()[0]
            .__getitem__(0)
        )
        if run_id:
            run_id += 1
        else:
            run_id = 1

        # Get process information including model_id
        process_df = pd.DataFrame(
            sp_session.sql(
                f"""SELECT {PROCESS_ATTRIBUTES_COL}, {MODEL_ID_COL} FROM {APPLICATION}.METADATA.PROCESSES WHERE PROCESS_ID = {process_id}"""
            ).collect()
        )
        attributes = json.loads(process_df.iloc[0, 0])
        model_id = process_df.iloc[0, 1]
        
        # Get target database and schema from the model to replace placeholders
        if model_id:
            model_df = pd.DataFrame(
                sp_session.sql(
                    f"""SELECT TARGET_DATABASE, TARGET_SCHEMA FROM {APPLICATION}.METADATA.MODELS WHERE MODEL_ID = {model_id}"""
                ).collect()
            )
            if len(model_df) > 0:
                target_database = model_df.iloc[0, 0]
                target_schema = model_df.iloc[0, 1]
                
                # Replace TARGET_DATABASE placeholder in attributes
                from services.process import replace_string_in_dict
                attributes = replace_string_in_dict(attributes, "<TARGET_DATABASE>", target_database)
        
        table_name = attributes["target"]["object"]

        process_type_id = attributes[PROCESS_TYPE_ID_KEY]
        process_name = attributes[PROCESS_NAME_KEY]
        process_type_df = pd.DataFrame(
            sp_session.sql(
                f"""SELECT PROCESS_TYPE, TEMPLATE, OBJECT_TYPE, OBJECT_ACTION FROM {APPLICATION}.METADATA.PROCESS_TYPES WHERE PROCESS_TYPE_ID = {process_type_id}"""
            ).collect()
        )
        template = process_type_df.iloc[0, 1]
        object_type = process_type_df.iloc[0, 2]
        object_action = process_type_df.iloc[0, 3]

        sql_command = get_sql_jinja(template, attributes)
        sp_session.sql(
            f"""INSERT INTO {APPLICATION}.METADATA.PROCESS_LOG (PROCESS_LOG_ID, PROCESS_RUN_ID, 
                       PROCESS_ID, PROCESS_START_TIMESTAMP, PROCESS_END_TIMESTAMP, PROCESS_OUTPUT) SELECT {log_id}, {run_id}, 
                       {process_id}, SYSDATE(), NULL, OBJECT_CONSTRUCT('msg', OBJECT_CONSTRUCT(
                       'process_name','{process_name}', 'status', 'started'))"""
        ).collect()
        results_df = sp_session.call(
            f"{APPLICATION}.METADATA.CREATE_DYNAMIC_TABLE", sql_command
        )
        if not is_local():
            sp_session.call(
                f"{APPLICATION}.METADATA.GRANTER", APPLICATION, [table_name]
            )
        details = ""

        if object_action.lower() == "create" and object_type.lower() in [
            "dynamic table",
            "table",
            "view",
            "materialized view",
        ]:
            target_obj_str = attributes[TARGET_KEY][OBJECT_KEY]
            target_obj_db = target_obj_str.split(".")[0]
            target_obj_sch = target_obj_str.split(".")[1]
            target_obj_name = target_obj_str.split(".")[2]

            labels = attributes["labels"]

            manage_object(
                "dynamic_table", target_obj_db, target_obj_sch, target_obj_name, labels
            )

            results = results_df[0][0]
            details = f"""'details',{"$"}{"$"}{results}{"$"}{"$"}"""

        sp_session.sql(
            f"""UPDATE {APPLICATION}.METADATA.PROCESS_LOG SET PROCESS_END_TIMESTAMP = SYSDATE(), PROCESS_OUTPUT = OBJECT_CONSTRUCT('msg', OBJECT_CONSTRUCT(
                       'process_name','{process_name}', 'status','completed', {details})) WHERE PROCESS_RUN_ID = {run_id} 
                       AND PROCESS_ID = {process_id}"""
        ).collect()

        sp_session.table([APPLICATION, METADATA_SCHEMA, PROCESSES_TABLE]).update(
            {STATUS_COL: lit(status.COMPLETED)}, col(PROCESS_ID_COL) == lit(process_id)
        )

        file_name = f"DATA_CONTRACT_{process_name}.yaml"
        file = open(file_name, "w")
        yaml.dump(attributes, file)
        file.close()
        sp_session.file.put(
            local_file_name=file_name,
            stage_location=f"{APPLICATION}.METADATA.DATA_CONTRACTS",
            auto_compress=False,
            overwrite=True,
        )
        os.remove(file_name)

        return ProcessResult["Created"]

    except Exception as e:

        error_eraw = (
            str(e)
            .replace("'", "")
            .replace("\r", " ")
            .replace("\n", " ")
            .replace("\r\n", " ")
            .replace("\n\r", " ")
        )

        sp_session.sql(
            f"""MERGE INTO {APPLICATION}.METADATA.PROCESS_LOG l USING 
                        (SELECT
                            {log_id} PROCESS_LOG_ID
                            ,{run_id} PROCESS_RUN_ID
                            ,{process_id} PROCESS_ID
                            ,OBJECT_CONSTRUCT('error',{"$"}{"$"}{error_eraw}{"$"}{"$"}) PROCESS_OUTPUT
                        ) AS el 
                    ON 
                        LOWER(l.PROCESS_RUN_ID) = LOWER(el.PROCESS_RUN_ID)
                        AND LOWER(l.PROCESS_ID) = LOWER(el.PROCESS_ID)
                    WHEN MATCHED THEN UPDATE SET 
                        l.PROCESS_OUTPUT = el.PROCESS_OUTPUT
                        ,l.PROCESS_END_TIMESTAMP = SYSDATE()
                    WHEN NOT MATCHED THEN INSERT (PROCESS_LOG_ID, PROCESS_RUN_ID, 
                    PROCESS_ID, PROCESS_START_TIMESTAMP, PROCESS_END_TIMESTAMP, PROCESS_OUTPUT) VALUES 
                        (
                            el.PROCESS_LOG_ID
                            ,el.PROCESS_RUN_ID
                            ,el.PROCESS_ID
                            ,SYSDATE()
                            ,NULL
                            ,el.PROCESS_OUTPUT
                        )"""
        ).collect()

        msg_return = "Failed: " + error_eraw
        sp_session.table([APPLICATION, METADATA_SCHEMA, PROCESSES_TABLE]).update(
            {STATUS_COL: lit(status.FAILED)}, col(PROCESS_ID_COL) == lit(process_id)
        )
        raise Exception(msg_return)


def update_target(process_id, sql_command):
    sp_session = connect_to_snowflake()

    try:
        log_id = pd.DataFrame(
            sp_session.sql(
                f"""SELECT MAX(PROCESS_LOG_ID) FROM {APPLICATION}.METADATA.PROCESS_LOG"""
            ).collect()
        ).iloc[0, 0]

        if log_id:
            log_id += 1
        else:
            log_id = 1

        run_id = pd.DataFrame(
            sp_session.sql(
                f"""SELECT MAX(PROCESS_RUN_ID) FROM {APPLICATION}.METADATA.PROCESS_LOG"""
            ).collect()
        ).iloc[0, 0]

        if run_id:
            run_id += 1
        else:
            run_id = 1

        process_df = pd.DataFrame(
            sp_session.sql(
                f"""SELECT PROCESS_NAME, PROCESS_TYPE_ID, FROM {APPLICATION}.METADATA.PROCESSES WHERE PROCESS_ID = {process_id}"""
            ).collect()
        )
        process_name = process_df.iloc[0, 0]
        process_type_id = process_df.iloc[0, 1]

        process_df = pd.DataFrame(
            sp_session.sql(
                f"""SELECT PROCESS_TYPE, OBJECT_TYPE, OBJECT_ACTION FROM {APPLICATION}.METADATA.PROCESS_TYPES WHERE PROCESS_TYPE_ID = {process_type_id}"""
            ).collect()
        )

        object_type = process_df.iloc[0, 1]
        object_action = process_df.iloc[0, 2]

        sp_session.sql(
            f"""INSERT INTO {APPLICATION}.METADATA.PROCESS_LOG (PROCESS_LOG_ID, PROCESS_RUN_ID
                       , PROCESS_ID, PROCESS_START_TIMESTAMP, PROCESS_END_TIMESTAMP, PROCESS_OUTPUT) SELECT {log_id}, {run_id}
                       , {process_id}, SYSDATE(), NULL, OBJECT_CONSTRUCT('msg', OBJECT_CONSTRUCT(
                        'process_name','{process_name}', 'status', 'started'))"""
        ).collect()

        results_df = pd.DataFrame(sp_session.sql(f"""{sql_command}""").collect())

        details = ""

        if object_action.lower() == "create" and object_type.lower() in ["table"]:
            results = results_df.iloc[0, 0]
            details = f"""'details',{"$"}{"$"}{results}{"$"}{"$"}"""

        elif object_action.lower() in ["merge_insert", "merge_delete"]:

            if object_action.lower() == "merge_insert":
                rows_inserted = results_df.iloc[0, 0]
                rows_updated = results_df.iloc[0, 1]
                details = f"""'rows_inserted',{rows_inserted}, 'rows_updated',{rows_updated}"""

            elif object_action.lower() == "merge_delete":
                rows_inserted = results_df.iloc[0, 0]
                rows_deleted = results_df.iloc[0, 1]
                details = f"""'rows_inserted',{rows_inserted}, 'rows_deleted',{rows_deleted}"""

        sp_session.sql(
            f"""UPDATE {APPLICATION}.METADATA.PROCESS_LOG SET PROCESS_END_TIMESTAMP = SYSDATE(), PROCESS_OUTPUT = OBJECT_CONSTRUCT('msg', OBJECT_CONSTRUCT(
                       'process_name','{process_name}', 'status','completed', {details})) WHERE PROCESS_RUN_ID = {run_id} AND PROCESS_ID = {process_id}"""
        ).collect()

    except Exception as e:

        error_eraw = (
            str(e)
            .replace("'", "")
            .replace("\r", " ")
            .replace("\n", " ")
            .replace("\r\n", " ")
            .replace("\n\r", " ")
        )

        sp_session.sql(
            f"""MERGE INTO {APPLICATION}.METADATA.PROCESS_LOG l USING 
                        (SELECT
                            {log_id} PROCESS_LOG_ID
                            ,{run_id} PROCESS_RUN_ID
                            ,{process_id} PROCESS_ID
                            ,OBJECT_CONSTRUCT('error',{"$"}{"$"}{error_eraw}{"$"}{"$"}) PROCESS_OUTPUT
                        ) AS el 
                    ON 
                        LOWER(l.PROCESS_RUN_ID) = LOWER(el.PROCESS_RUN_ID)
                        AND LOWER(l.PROCESS_ID) = LOWER(el.PROCESS_ID)
                    WHEN MATCHED THEN UPDATE SET 
                        l.PROCESS_OUTPUT = el.PROCESS_OUTPUT
                        ,l.PROCESS_END_TIMESTAMP = SYSDATE()
                    WHEN NOT MATCHED THEN INSERT (PROCESS_LOG_ID, PROCESS_RUN_ID, 
                    PROCESS_ID, PROCESS_START_TIMESTAMP, PROCESS_END_TIMESTAMP, PROCESS_OUTPUT) VALUES 
                        (
                            el.PROCESS_LOG_ID
                            ,el.PROCESS_RUN_ID
                            ,el.PROCESS_ID
                            ,SYSDATE()
                            ,NULL
                            ,el.PROCESS_OUTPUT
                        )"""
        ).collect()

        msg_return = "Failed: " + error_eraw

        raise Exception(msg_return)
