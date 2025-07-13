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
        # Try to get tables using case-insensitive query to handle case sensitivity better
        try:
            check_command = f"SELECT {g.TABLE_NAME_KEY} FROM {database}.INFORMATION_SCHEMA.TABLES WHERE UPPER(TABLE_SCHEMA) = UPPER('{schema}');"
            granted_tables = sp_session.sql(check_command).to_pandas()
            granted_tables_list = [row[0] for row in granted_tables.values]
        except Exception as table_error:
            # If the direct query fails, try with uppercase database name
            try:
                check_command = f"SELECT {g.TABLE_NAME_KEY} FROM {database.upper()}.INFORMATION_SCHEMA.TABLES WHERE UPPER(TABLE_SCHEMA) = UPPER('{schema}');"
                granted_tables = sp_session.sql(check_command).to_pandas()
                granted_tables_list = [row[0] for row in granted_tables.values]
            except Exception as uppercase_error:
                # If both fail, return empty list but log the error
                print(f"Error querying tables: {str(table_error)}, {str(uppercase_error)}")
                granted_tables_list = []
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


@app.get("/api/database/debug/<database>/<schema>")
def debug_database_connection(database: str, schema: str):
    """Debug endpoint to help troubleshoot database connectivity and case sensitivity issues"""
    try:
        sp_session = connect_to_snowflake()
        debug_info = {
            "input_database": database,
            "input_schema": schema,
            "tests": []
        }
        
        # Test 1: Try original case
        try:
            check_command = f"SELECT TABLE_NAME FROM {database}.INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '{schema}' LIMIT 5;"
            result = sp_session.sql(check_command).to_pandas()
            debug_info["tests"].append({
                "test": "original_case",
                "database": database,
                "schema": schema,
                "success": True,
                "table_count": len(result),
                "sample_tables": result["TABLE_NAME"].tolist() if len(result) > 0 else []
            })
        except Exception as e:
            debug_info["tests"].append({
                "test": "original_case",
                "database": database,
                "schema": schema,
                "success": False,
                "error": str(e)
            })
        
        # Test 2: Try uppercase database
        try:
            check_command = f"SELECT TABLE_NAME FROM {database.upper()}.INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '{schema}' LIMIT 5;"
            result = sp_session.sql(check_command).to_pandas()
            debug_info["tests"].append({
                "test": "uppercase_database",
                "database": database.upper(),
                "schema": schema,
                "success": True,
                "table_count": len(result),
                "sample_tables": result["TABLE_NAME"].tolist() if len(result) > 0 else []
            })
        except Exception as e:
            debug_info["tests"].append({
                "test": "uppercase_database",
                "database": database.upper(),
                "schema": schema,
                "success": False,
                "error": str(e)
            })
        
        # Test 3: Try uppercase schema
        try:
            check_command = f"SELECT TABLE_NAME FROM {database}.INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '{schema.upper()}' LIMIT 5;"
            result = sp_session.sql(check_command).to_pandas()
            debug_info["tests"].append({
                "test": "uppercase_schema",
                "database": database,
                "schema": schema.upper(),
                "success": True,
                "table_count": len(result),
                "sample_tables": result["TABLE_NAME"].tolist() if len(result) > 0 else []
            })
        except Exception as e:
            debug_info["tests"].append({
                "test": "uppercase_schema",
                "database": database,
                "schema": schema.upper(),
                "success": False,
                "error": str(e)
            })
        
        # Test 4: Try both uppercase
        try:
            check_command = f"SELECT TABLE_NAME FROM {database.upper()}.INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '{schema.upper()}' LIMIT 5;"
            result = sp_session.sql(check_command).to_pandas()
            debug_info["tests"].append({
                "test": "both_uppercase",
                "database": database.upper(),
                "schema": schema.upper(),
                "success": True,
                "table_count": len(result),
                "sample_tables": result["TABLE_NAME"].tolist() if len(result) > 0 else []
            })
        except Exception as e:
            debug_info["tests"].append({
                "test": "both_uppercase",
                "database": database.upper(),
                "schema": schema.upper(),
                "success": False,
                "error": str(e)
            })
        
        # Test 5: Show available databases
        try:
            databases_result = sp_session.sql("SHOW DATABASES").to_pandas()
            available_databases = databases_result["name"].tolist()
            debug_info["available_databases"] = available_databases
        except Exception as e:
            debug_info["available_databases_error"] = str(e)
        
        # Test 6: If database exists, show available schemas
        for test in debug_info["tests"]:
            if test["success"] and test["table_count"] > 0:
                try:
                    schemas_result = sp_session.sql(f"SHOW SCHEMAS IN {test['database']}").to_pandas()
                    debug_info["available_schemas_in_" + test["database"]] = schemas_result["name"].tolist()
                    break
                except Exception as e:
                    debug_info["available_schemas_error"] = str(e)
        
        return jsonify(debug_info)
    except Exception as error:
        return jsonify(error=str(error)), 401


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

        # Create the column object once
        column = {g.COLUMN_NAME_COL: column_name, g.DATA_TYPE_COL: column_type}

        table_match = next(
            (t_model for t_model in tables if t_model[g.TABLE_NAME_COL] == table_name),
            None,
        )
        if table_match:
            table_match[g.COLUMNS_COL].append(column)
        else:
            tables.append(
                {
                    g.TABLE_NAME_COL: table_name,
                    g.COLUMNS_COL: [column],
                    g.TABLE_SCHEMA_COL: table_schema,
                    g.TABLE_CATALOG_COL: table_database,
                }
            )
    return tables


def names_to_json(column):
    return {"value": column, "label": column}
