import json
import pandas as pd
import requests
import time

from globals import *
from snowflake.snowpark import Session
from services.session import connection, is_local, is_docker
from services.ai_assistant.llm.llm_base import LLM
from services.ai_assistant.llm.message import Message
from typing import List
from requests.exceptions import HTTPError
from services.ai_assistant.llm.message import Message, json_parse_list


class CortexCopilot(LLM):
    def __init__(self, sp_session):
        self.sp_session = sp_session
        self.use_cloud_udf = True

    
    def chat_complete(self, chat_history: List[Message], system_prompt: Message) -> List[Message]:
        last_message: Message = chat_history[-1]
        chat_history = self._trim_context(chat_history, last_n=1) 
        chat_history = self._ignore_errors(chat_history)
        formatted = list(map(lambda m: self.convertMessageToCortexMessage(m), chat_history))
        try:
            response = self._send_message(self.sp_session, json.dumps(formatted), self.context_file)
            last_message = response["message"]["content"]
            responseMessages = self._get_message(last_message)
            iterResponse = responseMessages
            for message in iterResponse:
                if message.content.sql is not None:
                    sqlResponse = self.process_sql(message)
                    responseMessages.append(sqlResponse)
            return responseMessages
        except HTTPError as e:
            return [Message(role='assistant', error=e.response.text)]
        except Exception as e:
            return [Message(role='assistant', error=str(e))]


    def _send_message(self, sp_session, prompt: str, file: str) -> dict:
        # if not self.use_cloud_udf and (is_docker() or is_local()):
        #     return self._send_message_local(sp_session, prompt, file)
        # else:
        return self._send_message_cloud(sp_session, prompt, file)


    def _send_message_cloud(self, sp_session, prompt: str, file: str) -> dict:
        file_path = f'{APPLICATION}.{LLM_SCHEMA}.{LLM_SEMANTIC_MODEL_STAGE}'
        response = sp_session.call(f'{APPLICATION}.{LLM_SCHEMA}.GET_CHAT_RESPONSE', prompt, file, file_path)
        response = json.loads(response)
        if response['status'] >= 400: 
            raise Exception(response)
        content = json.loads(response['content'])
        return content


    def _send_message_local(self, conn, prompt: str, file: str) -> dict:
        local = connection()
        """Calls the REST API and returns the response."""
        request_body = prompt
        max_retries = 10
        for retry in range(max_retries):
            
            resp = requests.post(
                (
                    f"https://{API}/api/v2/databases/{APPLICATION}/"
                    f"schemas/{LLM_SCHEMA}/copilots/{LLM_SEMANTIC_MODEL_STAGE}/chats/-/messages"
                ),
                json=request_body,
                headers={
                    "Authorization": f'Snowflake Token="{local.rest.token}"',
                    "Content-Type": "application/json",
                },
            )
            if resp.status_code < 400:
                return resp.json()
            time.sleep(1)
        resp.raise_for_status()


    def _get_message(self, content: list) -> List[Message]:
        messages = []
        for item in content:
            message = Message(role='assistant')
            if item["type"] == "text":
                message.content.text = item["text"]
            elif item["type"] == "suggestions":
                message.content.suggestions = item["suggestions"]
            elif item["type"] == "sql":
                message.content.sql = item["statement"]
            else:
                # TODO handle unexpected cases
                pass
            messages.append(message)
        return messages

    def convertMessageToCortexMessage(self, message: Message) -> dict:
        return {
            "role": message.role,
            "content": [{
            "type": "text",
            "text": message.content.text
            }]
        }
    