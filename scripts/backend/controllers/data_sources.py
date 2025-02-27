from datetime import datetime
from api import app
from flask import request, jsonify
from ast import literal_eval
from utils.model_helpers import connect_to_snowflake
from snowflake.snowpark.functions import col, lit
from globals import *
import pandas as pd
import json


@app.get("/api/sources/")
def get_existing_sources():
    sp_session = connect_to_snowflake()
    models = sp_session.table([APPLICATION, METADATA_SCHEMA, MODELS_TABLE]).select(
        col(MODEL_ID_COL), col(MODEL_NAME_COL)
    )
    existing_sources_table = (
        sp_session.table([APPLICATION, METADATA_SCHEMA, SOURCES_TABLE])
        .join(right=models, how="left", on=MODEL_ID_COL)
        .select(
            col(SOURCE_ID_COL),
            col(MODEL_ID_COL),
            col(PROVIDER_NAME_COL),
            col(CONNECTOR_NAME_COL),
            col(DATABASE_COL),
            col(SCHEMA_COL),
            col(CREATED_TIMESTAMP_COL),
            col(MODEL_NAME_COL)
        )
        .to_pandas()
    )
    return existing_sources_table.apply(
        _generate_existing_source_dict, "columns"
    ).to_json(orient="records")


@app.get("/api/sources/<source_id>")
def get_source(source_id):
    sp_session = connect_to_snowflake()
    result = (
        sp_session.table([APPLICATION, METADATA_SCHEMA, SOURCES_TABLE])
        .where(col(SOURCE_ID_COL) == lit(source_id))
        .first()
    )
    if result is None:
        return {"message": f"Source with id {source_id} not found"}, 404
    else:
        return result.as_dict(), 200


@app.delete("/api/sources/")
def delete_existing_sources():
    sp_session = connect_to_snowflake()
    ids = json.loads(request.headers[SOURCES_KEY])
    source_table = sp_session.table([APPLICATION, METADATA_SCHEMA, SOURCES_TABLE])
    source_table.delete(col(SOURCE_ID_COL).isin(ids))
    source_table.collect()

    return {"message": "Sources successfully deleted"}, 200


@app.post("/api/sources/")
def post_existing_sources():
    try:
        sp_session = connect_to_snowflake()
        content = request.get_json()
        database = content["DATABASE"]
        schema = content["SCHEMA"]
        data = [
            {
                "PROVIDER_NAME": content["PROVIDER_NAME"],
                "CONNECTOR_NAME": content["CONNECTOR_NAME"],
                "DATABASE": database,
                "SCHEMA": schema,
            }
        ]
        df = pd.DataFrame(data)
        sp_session.write_pandas(
            df, SOURCES_TABLE, database=APPLICATION, schema=METADATA_SCHEMA
        )

        result = (
            sp_session.table([APPLICATION, METADATA_SCHEMA, SOURCES_TABLE])
            .order_by(CREATED_TIMESTAMP_COL, ascending=False)
            .select(
                SOURCE_ID_COL,
                PROVIDER_NAME_COL,
                CONNECTOR_NAME_COL,
                DATABASE_COL,
                SCHEMA_COL,
            )
            .limit(1)
            .to_pandas()
            .iloc[0]
            .to_dict()
        )

        granted_tables = (
            sp_session.table([database, "INFORMATION_SCHEMA", "TABLES"])
            .select(col(TABLE_NAME_COL))
            .where(col(TABLE_SCHEMA_COL) == lit(schema))
            .to_pandas()
        )
        granted_tables_list = [{"name": row} for row in granted_tables[TABLE_NAME_COL]]

        return {
            "newSource": result,
            "newCustomTable": {
                "columns": [],
                "data": granted_tables_list,
                "header": "TablesNames",
                "title": "",
            },
        }, 200
    except Exception as error:
        return jsonify(error=str(error)), 401
    finally:
        sp_session.close()


def _generate_existing_source_dict(row):
    existing_source_info = {
        SOURCE_ID_COL: row[SOURCE_ID_COL],
        PROVIDER_NAME_COL: row[PROVIDER_NAME_COL],
        CONNECTOR_NAME_COL: row[CONNECTOR_NAME_COL],
        DATABASE_COL: row[DATABASE_COL],
        SCHEMA_COL: row[SCHEMA_COL],
        CREATED_TIMESTAMP_COL: f"{row[CREATED_TIMESTAMP_COL].year}-{row[CREATED_TIMESTAMP_COL].month}-{row[CREATED_TIMESTAMP_COL].day} {row[CREATED_TIMESTAMP_COL].hour}:{row[CREATED_TIMESTAMP_COL].minute}:{row[CREATED_TIMESTAMP_COL].second}",
        MODEL_ID_COL: row[MODEL_ID_COL],
        MODEL_NAME_COL: row[MODEL_NAME_COL],
    }
    return existing_source_info
