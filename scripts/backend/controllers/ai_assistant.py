from api import app
from flask import request, jsonify, make_response
from snowflake.snowpark.functions import col, lit
from utils.model_helpers import connect_to_snowflake
from exceptions.invalid_model_id import InvalidModelId
from services.ai_assistant.cortex_complete import CortexComplete
from services.ai_assistant.llm.message import Message
from services.ai_assistant.assistant import add_assistant, list_semantic_files, chat_complete, get_assistants_names, get_messages, delete_assistant, rename_assistant, update_chat
from globals import *
import jsonpickle
from enums.llm import LLMType

# json request
# {
#    "id": "assistant_123",
#    "prompt": "Tell me a joke"
#    "context_file": "Context.yaml"
# }
@app.post("/api/assistant/cortex_complete")
def complete():
    content = request.get_json()
    sp_session = connect_to_snowflake()
    prompt = content['prompt']
    id = content['id']
    context_file = content['context_file']
    result = chat_complete(sp_session,prompt, id, context_file)
    response = make_response(jsonpickle.encode(result, unpicklable=False))
    return response

# Expected creation json
# {
#    "name": "My Chat Name",
#    "type": "CortexCopilot" | "DataEngineering"
# }
@app.post("/api/assistant/create_chat")
def create_chat():
    content = request.get_json()
    name = content["name"]
    type = getattr(LLMType, content["type"])
    sp_session = connect_to_snowflake()
    result = add_assistant(sp_session, name, type)
    response = make_response(jsonpickle.encode(result, unpicklable=False))
    response.headers['Content-type'] = 'application/json; charset=utf-8'
    return response


@app.get("/api/assistants")
def assistant_names():
    sp_session = connect_to_snowflake()
    result = get_assistants_names(sp_session)
    response = make_response(jsonpickle.encode(result, unpicklable=False))
    response.headers['Content-type'] = 'application/json; charset=utf-8'
    return response

@app.get("/api/assistant/<chat_id>")
def get_chat_messages(chat_id):
    sp_session = connect_to_snowflake()
    result = get_messages(sp_session, chat_id)
    response = make_response(jsonpickle.encode(result, unpicklable=False))
    response.headers['Content-type'] = 'application/json; charset=utf-8'
    return response

@app.get("/api/semantic_models")
def get_semantic_model():
    sp_session = connect_to_snowflake()
    result = list_semantic_files(sp_session)
    response = make_response(jsonpickle.encode(result, unpicklable=False))
    response.headers['Content-type'] = 'application/json; charset=utf-8'
    return response

@app.delete("/api/assistant/<chat_id>")
def delete_chat(chat_id):
    sp_session = connect_to_snowflake()
    result = delete_assistant(sp_session, chat_id)
    response = make_response(jsonpickle.encode(result, unpicklable=False))
    response.headers['Content-type'] = 'application/json; charset=utf-8'
    return response

@app.patch("/api/assistant/<chat_id>")
def rename_chat(chat_id):
    sp_session = connect_to_snowflake()
    content = request.get_json()
    result = rename_assistant(sp_session, chat_id, content['name'])
    response = make_response(jsonpickle.encode(result, unpicklable=False))
    response.headers['Content-type'] = 'application/json; charset=utf-8'
    return response