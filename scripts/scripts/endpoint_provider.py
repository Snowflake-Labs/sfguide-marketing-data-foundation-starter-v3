import time

def get_endpoint(sp_session, service_name: str) -> str:
    show_endpoint_query = f"SHOW ENDPOINTS IN SERVICE {service_name};"
    is_endpoint = False
    while not is_endpoint:
        result = sp_session.sql(show_endpoint_query).first()['ingress_url']
        if ('provisioning' not in result): break
        print(result, end='\r')
        time.sleep(5)
    print()
    return result

def get_public_url_na(appName, executeStatement) -> str:
    show_endpoint_query = f"call {appName}.app_public.app_url();"
    is_endpoint = False
    while not is_endpoint:
        result = executeStatement(show_endpoint_query)
        if ('provisioning' not in result): break
        time.sleep(5)
    return result
