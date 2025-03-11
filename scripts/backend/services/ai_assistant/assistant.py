import json
import snowflake.connector

from services.ai_assistant.copilot import CortexCopilot
from globals import *
from uuid import uuid4
from snowflake.snowpark.functions import col
from snowflake.snowpark.table import Table
from typing import List
from dtos.assistant import Assistant
from services.ai_assistant.llm.message import Message, json_parse_list
from services.ai_assistant.cortex_complete import CortexComplete
from enums.llm import LLMType
from services.ai_assistant.llm.llm_base import LLM

def getUser(sp_session):
    user = sp_session.get_current_user()
    return user.replace('"', '')


def get_assistants_names(sp_session) -> List[Assistant]:
    user = getUser(sp_session)
    dataframe = assistant_table(sp_session).select(col(ASSISTANT_TABLE_ID_COL), col(ASSISTANT_TABLE_NAME_COL), col(ASSISTANT_TABLE_TYPE_COL)).where(col(ASSISTANT_TABLE_USER_COL) == user).collect()
    assistants = list(map(lambda row: Assistant(id=row[0], name=row[1], type=row[2]), dataframe))
    return assistants

def get_assistant_type(sp_session, id:str) -> Assistant:
    dataframe = assistant_table(sp_session).select(col(ASSISTANT_TABLE_ID_COL), col(ASSISTANT_TABLE_TYPE_COL)).where(col(ASSISTANT_TABLE_ID_COL) == id)
    type = dataframe.first().asDict()[ASSISTANT_TABLE_TYPE_COL]
    return getattr(LLMType, type)

def assistant_table(sp_session) -> Table:
    return sp_session.table([LLM_SCHEMA, ASSISTANT_TABLE])

def chat_complete(sp_session, prompt:str, id:str, context_file:str):
    assistant_instance =  CortexComplete(sp_session)
    type = get_assistant_type(sp_session, id)
    if type == LLMType.CortexCopilot:
        assistant_instance = CortexCopilot(sp_session)
    assistant_instance.set_context_file(context_file)
    chat_history = get_messages(sp_session, id)
    message = Message(role='user', text=prompt)
    system_message = get_current_system_message(sp_session, id, assistant_instance, context_file)
    chat_history.append(message)
    llmresponse = assistant_instance.chat_complete(chat_history, system_message)
    chat_history+=llmresponse
    update_chat(sp_session, id, chat_history)
    return llmresponse

def get_current_system_message(sp_session, id:str, chatbot: LLM, context_file:str) -> Message:
    existingSystemPrompt = obtain_system_prompt(sp_session, id)
    if existingSystemPrompt: return Message(role='system', text=existingSystemPrompt)
    system_prompt = chatbot.get_system_prompt(context_file)
    if system_prompt: update_sys_prompt(sp_session, id, system_prompt)
    return Message(role='system', text=system_prompt)
        
def update_sys_prompt(sp_session, id: str, sys_prompt: str) -> None:
    table = assistant_table(sp_session)
    table.update(
        { ASSISTANT_TABLE_SYS_PROMPT_COL: sys_prompt },
        table[ASSISTANT_TABLE_ID_COL] == id)
    
def obtain_system_prompt(sp_session, id:str) -> str:
    dataframe = assistant_table(sp_session).select(col(ASSISTANT_TABLE_ID_COL), col(ASSISTANT_TABLE_SYS_PROMPT_COL)).where(col(ASSISTANT_TABLE_ID_COL) == id)
    sys_prompt = dataframe.first().asDict()[ASSISTANT_TABLE_SYS_PROMPT_COL]
    return sys_prompt


def list_semantic_files(sp_session) -> List[str]:
    query = f'LIST @{APPLICATION}.{LLM_SCHEMA}.{LLM_SEMANTIC_MODEL_STAGE}'
    semantic_models =  sp_session.sql(query)
    return semantic_models.select('"name"').collect() if semantic_models.count() > 0 else []

def add_assistant(sp_session, name: str, type: LLMType) -> str:
    cols = assistant_table(sp_session).columns
    id = f'assistant-{uuid4()}'
    user = getUser(sp_session)
    df = sp_session.create_dataframe([[id, name, None, user, type.value, None]], schema=cols)
    df.write.mode('append').save_as_table(table_name=[LLM_SCHEMA, ASSISTANT_TABLE])
    return id

def delete_assistant(sp_session, name: str) -> bool:
    table = assistant_table(sp_session)
    table.delete(table[ASSISTANT_TABLE_ID_COL] == name )
    return True

def rename_assistant(sp_session, id: str, new_name: str) -> bool:
    table = assistant_table(sp_session)
    table.update(
        { ASSISTANT_TABLE_NAME_COL: new_name },
        table[ASSISTANT_TABLE_ID_COL] == id)
    return True

def update_chat(sp_session, id: str, new_chat: List[Message]) -> None:
    new_chat = json_parse_list(new_chat)
    table = assistant_table(sp_session)
    table.update(
        { ASSISTANT_TABLE_CHAT_COL: new_chat },
        table[ASSISTANT_TABLE_ID_COL] == id)


def update_sys_prompt(sp_session, id: str, sys_prompt: str) -> None:
    table = assistant_table(sp_session)
    table.update(
        { ASSISTANT_TABLE_SYS_PROMPT_COL: sys_prompt },
        table[ASSISTANT_TABLE_ID_COL] == id)


def get_messages(sp_session,  id: str) -> List[Message]:
    messages = assistant_table(sp_session)\
        .select(col(ASSISTANT_TABLE_CHAT_COL))\
        .where(col(ASSISTANT_TABLE_ID_COL) == id)\
        .first()[0]
    if not messages: return []
    obj = json.loads(messages)
    return list(map(lambda m: Message(**m), obj))