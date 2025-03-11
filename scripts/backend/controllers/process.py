
from api import app
from utils.model_helpers import connect_to_snowflake
from flask import request, jsonify, make_response
from services.process import save_process,get_processes



@app.put("/api/process/<model_id>")
def update_process(model_id):
    content = request.get_json()
    result = save_process(content, model_id)
    return result


@app.post("/api/process/")
def post_new_process():
    content = request.get_json()
    result = save_process(content)
    return result


@app.get("/api/process/<model_id>")
def get_process(model_id):
    sp_session = connect_to_snowflake()
    result = get_processes(sp_session, model_id)
    return result, 200