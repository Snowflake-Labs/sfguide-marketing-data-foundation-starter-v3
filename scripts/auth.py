import os
import json

from snowflake.snowpark.session import Session

def authenticate(conn_file_name: str) -> Session:
    conn_obj = get_conn_obj(conn_file_name)
    warehouse = conn_obj['warehouse']
    print(f'Warehouse selected: {warehouse}')

    sp_session = Session.builder.configs(conn_obj).create()
    sp_session.use_warehouse(warehouse)
    session_query = 'select current_account(), current_warehouse(), current_role(), current_database(), current_schema()'
    print(sp_session.sql(session_query).first())

    _store_docker_credentials(conn_obj)
    
    return sp_session


def get_conn_obj(conn_file_name: str) -> dict:
    with open(conn_file_name) as conn_f:
        return json.load(conn_f)


def _store_docker_credentials(conn_obj: dict) -> None:
    # Save credentials for Docker login
    os.environ['SNOWFLAKE_USER'] = conn_obj['user']
    os.environ['SNOWFLAKE_PASSWORD'] = conn_obj['password']
    os.environ['SNOWFLAKE_ACCOUNT'] = conn_obj['account']
    os.environ['SNOWFLAKE_WAREHOUSE'] = conn_obj['warehouse']
    os.environ['SNOWFLAKE_DATABASE'] = conn_obj['database']
    os.environ['SNOWFLAKE_SCHEMA'] = conn_obj['schema']
