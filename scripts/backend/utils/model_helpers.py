
from services.session import session
from snowflake.snowpark import Session

def execute_sql_query(_sp_session, query):
    result = _sp_session.sql(query)
    return result.collect()  

def connect_to_snowflake() -> Session:
    sp_session = session()
    sp_session.query_tag = {
        "origin": "sf_sit-is", 
        "name": "marketing_data_foundation_starter_spcs", 
        "version": {"major": 3, "minor": 0},
        "attributes": {"is_quickstart": 0, "source": "native_app"}
    }
    return sp_session
