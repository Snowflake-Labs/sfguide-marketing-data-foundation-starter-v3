
from services.session import session
from snowflake.snowpark import Session

def execute_sql_query(_sp_session, query):
    result = _sp_session.sql(query)
    return result.collect()  

def connect_to_snowflake() -> Session:
    return session()