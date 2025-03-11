from api import app
from flask import jsonify
from utils.model_helpers import connect_to_snowflake
import globals as g
from snowflake.snowpark.functions import col, lit


@app.get("/api/tables/model/<model_id>/")
def get_columns_info_schema(model_id: int):
    sp_session = connect_to_snowflake()

    sources = (
        sp_session.table([g.APPLICATION, g.METADATA_SCHEMA, g.SOURCES_TABLE])
        .where(col(g.MODEL_ID_COL) == lit(model_id))
        .select(g.DATABASE_COL, g.SCHEMA_COL)
    )

    databases = [
        row.__getitem__(0)
        for row in sources.select(g.DATABASE_COL).distinct().collect()
    ]
    response = None
    for database in databases:
        schemas = [
            row.__getitem__(0)
            for row in sources.select(g.SCHEMA_COL)
            .where(col(g.DATABASE_COL) == lit(database))
            .collect()
        ]
        schema = (
            sp_session.table([database, g.INFORMATION_SCHEMA, g.COLUMNS_COL])
            .where(col(g.TABLE_SCHEMA_COL).isin(schemas))
            .select(
                g.TABLE_CATALOG_COL,
                g.TABLE_SCHEMA_COL,
                g.TABLE_NAME_COL,
                g.COLUMN_NAME_COL,
                g.DATA_TYPE_COL,
            )
        )
        response = schema if database == databases[0] else response.union(schema)
    tables = group_columns_by_table(response.collect()) if response is not None else []
    return jsonify(tables)


@app.get("/api/tables/source/<source_id>/model/<model_id>/")
def get_tables_metadata(model_id: int, source_id: int):
    sp_session = connect_to_snowflake()

    sources = (
        sp_session.table([g.APPLICATION, g.METADATA_SCHEMA, g.SOURCES_TABLE])
        .where((col(g.MODEL_ID_COL) == lit(model_id)) & (col(g.SOURCE_ID_COL) == lit(source_id)))
        .select(g.DATABASE_COL, g.SCHEMA_COL)
    )

    if sources.count() == 0: return []

    database = sources.select(g.DATABASE_COL).first().__getitem__(0)
    
    schemas = [
        row.__getitem__(0)
        for row in sources.select(g.SCHEMA_COL)
        .where(col(g.DATABASE_COL) == lit(database))
        .collect()
    ]

    schema = (
        sp_session.table([database, g.INFORMATION_SCHEMA, g.COLUMNS_COL])
        .where(col(g.TABLE_SCHEMA_COL).isin(schemas))
        .select(
            g.TABLE_CATALOG_COL,
            g.TABLE_SCHEMA_COL,
            g.TABLE_NAME_COL,
            g.COLUMN_NAME_COL,
            g.DATA_TYPE_COL,
        )
    )
    
    tables = group_columns_by_table(schema.collect()) if schema is not None else []
    return jsonify(tables)


@app.get("/api/database/<database>/schema/<schema>/granted")
def get_granted_tables(database: str, schema: str):
    try:
        sp_session = connect_to_snowflake()
        check_command = f"SELECT {g.TABLE_NAME_KEY} FROM {database}.INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '{schema}';"
        granted_tables = sp_session.sql(check_command).to_pandas()
        granted_tables_list = [row[0] for row in granted_tables]
        return jsonify(granted_tables_list)
    except Exception as error:
        return jsonify(error=str(error)), 401


@app.get("/api/database/databases/")
def get_databases():
    try:
        sp_session = connect_to_snowflake()
        databases = (
            sp_session.sql("SHOW DATABASES")
            .select(g.QUOTED_NAME_KEY)
            .where(col(g.QUOTED_NAME_KEY) != lit(g.APPLICATION))
            .to_pandas()
        )
        return (
            databases[g.LOWER_NAME_KEY].apply(names_to_json).to_json(orient="records")
        )
    except Exception as error:
        return "%s" % error.message


@app.get("/api/database/schema/<database>/")
def get_schema_by_database(database: str):
    try:
        sp_session = connect_to_snowflake()
        schemas = (
            sp_session.sql(f"SHOW SCHEMAS IN {database}")
            .select(g.QUOTED_NAME_KEY)
            .where(col(g.QUOTED_NAME_KEY) != lit(g.INFORMATION_SCHEMA))
            .to_pandas()
        )
        return schemas[g.LOWER_NAME_KEY].apply(names_to_json).to_json(orient="records")
    except Exception as error:
        return "%s" % error.message


# Helper function to group columns by table
# Returns a list of tables like this:
# {
#   "COLUMNS": [{ "COLUMN_NAME": "string", "DATA_TYPE": "boolean"}],
#   "TABLE_CATALOG": "string",
#   "TABLE_NAME": "string",
#   "TABLE_SCHEMA": "string"
# }
def group_columns_by_table(data: "DataFrame"):
    tables = []
    for row in data:
        table_database = row[g.TABLE_CATALOG_COL]
        table_schema = row[g.TABLE_SCHEMA_COL]
        table_name = row[g.TABLE_NAME_COL]
        column_name = row[g.COLUMN_NAME_COL]
        column_type = row[g.DATA_TYPE_COL]

        table_match = next(
            (t_model for t_model in tables if t_model[g.TABLE_NAME_COL] == table_name),
            None,
        )
        if table_match:
            column = {g.COLUMN_NAME_COL: column_name, g.DATA_TYPE_COL: column_type}
            table_match[g.COLUMNS_COL].append(column)
        else:
            tables.append(
                {
                    g.TABLE_NAME_COL: table_name,
                    g.COLUMNS_COL: [],
                    g.TABLE_SCHEMA_COL: table_schema,
                    g.TABLE_CATALOG_COL: table_database,
                }
            )
    return tables


def names_to_json(column):
    return {"value": column, "label": column}
