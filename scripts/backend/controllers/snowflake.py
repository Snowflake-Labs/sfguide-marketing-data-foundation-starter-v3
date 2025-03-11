from api import app
from flask import jsonify
from utils.model_helpers import connect_to_snowflake
from flask import request


@app.get("/account/current_database")
def get_current_database():
    sp_session = connect_to_snowflake()
    current_database = sp_session.sql("SELECT CURRENT_DATABASE();").collect()
    return jsonify({"current_database": current_database[0][0]})

@app.get("/account/account_name")
def get_account_name():
    sp_session = connect_to_snowflake()
    account_name = sp_session.sql("SELECT CURRENT_ACCOUNT_NAME()").collect()[0].__getitem__("CURRENT_ACCOUNT_NAME()")
    return jsonify({"account_name": account_name})

@app.get("/account/organization_name")
def get_organization_name():
    sp_session = connect_to_snowflake()
    org_name = sp_session.sql("SELECT CURRENT_ORGANIZATION_NAME()").collect()[0].__getitem__("CURRENT_ORGANIZATION_NAME()")
    return jsonify({"organization_name": org_name})

@app.get("/account/account_identifier")
def get_account_identifier():
    sp_session = connect_to_snowflake()
    account_name = sp_session.sql("SELECT CURRENT_ACCOUNT_NAME()").collect()[0].__getitem__("CURRENT_ACCOUNT_NAME()")
    org_name = sp_session.sql("SELECT CURRENT_ORGANIZATION_NAME()").collect()[0].__getitem__("CURRENT_ORGANIZATION_NAME()")
    return jsonify({"organization_name": org_name, "account_name": account_name})

@app.get("/account/databases")
def get_explorer_databases():
    sp_session = connect_to_snowflake()
    response = sp_session.sql('SHOW DATABASES').select('"name"').collect()
    databases =  [{"value": database[0], "label" : database[0]} for database in response]
    return databases


@app.get("/account/schemas/<database>")
def get_schemas(database):
    sp_session = connect_to_snowflake()
    if database =='' or database is None:
        return [{"value": None, "label" : ''} ]
    response = sp_session.sql(f'SHOW SCHEMAS IN {database}').select('"name"').collect()
    schemas =  [{"value": schema[0], "label" : schema[0]} for schema in response]
    return schemas