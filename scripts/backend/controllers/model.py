import pandas as pd
from api import app
from services.process import (
    create_model_data,
    execute_model,
    get_model_sources,
    get_new_model_id,
    get_preview,
    replace_placeholder_db_schema,
    source_validation,
)
from flask import request, jsonify, Response
from snowflake.snowpark.functions import col, lit, when_matched, when_not_matched
from utils.model_helpers import connect_to_snowflake
from exceptions.invalid_model_id import InvalidModelId
from exceptions.invalid_sql import InvalidSql
from globals import *
from exceptions.length_mismatch import LengthMissmatch
from datetime import datetime


@app.post("/api/mappings/sql_validation/")
def run_sql_validation():
    content = request.get_json()
    return get_preview(content)


@app.post("/api/mappings/source_validation/")
def run_source_validation():
    content = request.get_json()
    return source_validation(content)


@app.post("/api/mappings/")
def post_model():
    content = request.get_json()
    sp_session = connect_to_snowflake()
    new_model_id = get_new_model_id()

    data = create_model_data(content)
    data[0][MODEL_ID_COL] = new_model_id
    data[0][MODEL_UI_COL][ID_KEY.lower()] = new_model_id
    df = sp_session.createDataFrame(data)
    df = df.withColumn(MODEL_ID_COL, lit(new_model_id)).withColumn(
        CREATED_TIMESTAMP_COL, lit(datetime.now())
    )
    df = df.select(
        col(MODEL_ID_COL),
        col(MODEL_NAME_COL),
        col("TARGET_DATABASE"),
        col("TARGET_SCHEMA"),
        col(MODEL_UI_COL),
        col(CREATED_TIMESTAMP_COL),
    )
    df.write.mode("append").save_as_table([APPLICATION, METADATA_SCHEMA, MODELS_TABLE])
    result = (
        sp_session.table([APPLICATION, METADATA_SCHEMA, MODELS_TABLE])
        .order_by(CREATED_TIMESTAMP_COL, ascending=False)
        .limit(1)
        .to_pandas()
        .iloc[0]
        .to_json()
    )

    return result, 200


@app.put("/api/mappings/<model_id>")
def update_model(model_id):
    content = request.get_json()
    sp_session = connect_to_snowflake()
    data = create_model_data(content)
    data[0][MODEL_ID_COL] = model_id
    df = sp_session.createDataFrame(data)
    target = sp_session.table([APPLICATION, METADATA_SCHEMA, MODELS_TABLE])
    result = target.merge(
        df,
        (target.MODEL_ID == df.MODEL_ID),
        [
            when_matched().update(
                {
                    MODEL_NAME_COL: df[MODEL_NAME_COL],
                    "TARGET_DATABASE": df["TARGET_DATABASE"],
                    "TARGET_SCHEMA": df["TARGET_SCHEMA"],
                    MODEL_UI_COL: df[MODEL_UI_COL],
                }
            ),
            when_not_matched().insert(
                {
                    MODEL_ID_COL: df[MODEL_ID_COL],
                    MODEL_NAME_COL: df[MODEL_NAME_COL],
                    "TARGET_DATABASE": df["TARGET_DATABASE"],
                    "TARGET_SCHEMA": df["TARGET_SCHEMA"],
                    MODEL_UI_COL: df[MODEL_UI_COL],
                    CREATED_TIMESTAMP_COL: lit(datetime.now()),
                }
            ),
        ],
    )
    result = {
        "rows_deleted": result.rows_deleted,
        "rows_inserted": result.rows_inserted,
        "rows_updated": result.rows_updated,
    }
    return result, 200


@app.get("/api/mappings/source/<source_id>")
def get_mappings(source_id):
    sp_session = connect_to_snowflake()
    models = (
        sp_session.table([APPLICATION, METADATA_SCHEMA, SOURCES_TABLE])
        .where(col(SOURCE_ID_COL) == lit(source_id))
        .select(col(MODEL_ID_COL))
    )
    model_ids = [
        row.__getitem__(MODEL_ID_COL)
        for row in models.collect()
        if row.__getitem__(MODEL_ID_COL) is not None
    ]
    result = (
        sp_session.table([APPLICATION, METADATA_SCHEMA, MODELS_TABLE])
        .orderBy(col(CREATED_TIMESTAMP_COL), ascending=False)
        .select(MODEL_ID_COL, MODEL_NAME_COL)
    )
    if len(model_ids) > 0:
        result = result.where(col(MODEL_ID_COL).isin(model_ids))
    return result.to_pandas().to_json(orient="records")


@app.get("/api/mappings/<model_id>")
def get_mapping(model_id):
    sp_session = connect_to_snowflake()
    df = sp_session.table([APPLICATION, METADATA_SCHEMA, MODELS_TABLE]).where(
        col(MODEL_ID_COL) == lit(model_id)
    )

    if df.count() == 0: return []
    model_ui = df.select(col(MODEL_UI_COL)).collect()[0].__getitem__(0)
    sources = get_model_sources(model_id, sp_session)

    for row in sources:
        provider = row.__getitem__("PROVIDER_NAME")
        connector = row.__getitem__("CONNECTOR_NAME")
        database = row.__getitem__("DATABASE")
        schema = row.__getitem__("SCHEMA")
        model_ui = replace_placeholder_db_schema(
            model_ui, provider, connector, database, schema
        )

    df = df.withColumn(MODEL_UI_COL, lit(model_ui)).to_pandas()
    result = df.iloc[0].to_json()
    return result, 200


@app.post("/api/mappings/<model_id>")
def execute_mapping(model_id):
    sp_session = connect_to_snowflake()
    return Response(execute_model(sp_session, model_id))


@app.get("/api/mappings/<model_id>/status")
def get_model_status(model_id):
    sp_session = connect_to_snowflake()
    result = (
        sp_session.table([APPLICATION, METADATA_SCHEMA, PROCESSES_TABLE])
        .select(
            MODEL_ID_COL,
            PROCESS_ID_COL,
            PROCESS_NAME_KEY,
            STATUS_COL,
            CREATED_TIMESTAMP_COL,
            MODIFIED_TIMESTAMP_COL,
        )
        .where(col(MODEL_ID_COL) == lit(model_id))
        .to_pandas()
        .to_json(orient="records")
    )
    return result, 200


@app.errorhandler(InvalidModelId)
def handle_invalid_model_id(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.errorhandler(InvalidSql)
def handle_invalid_sql(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.errorhandler(LengthMissmatch)
def handle_length_missmatch(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.put("/api/mappings/source/<source_id>/model/<model_id>")
def update_source_model(source_id, model_id):
    sp_session = connect_to_snowflake()
    sp_session.table([APPLICATION, METADATA_SCHEMA, SOURCES_TABLE]).update(
        {MODEL_ID_COL: lit(model_id)}, condition=col(SOURCE_ID_COL) == lit(source_id)
    )

    return {"message": "Source updated successfully"}, 200
