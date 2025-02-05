import re
import os
import json
from .llm.llm_base import LLM
from .llm.engineering_prompts import system_prompt, result_system_prompt, result_prompt
from .llm.message import Message, json_parse_list
from typing import List
from globals import APPLICATION, LLM_SCHEMA


class CortexComplete(LLM):
    def __init__(self, sp_session):
        self.sp_session = sp_session


    def chat_complete(self, chat_history: List[Message], system_prompt: Message) -> List[Message]:
        chat_history = self._trim_context(chat_history, last_n=3) 
        chat_history = self._ignore_errors(chat_history)
        chat_history.insert(0, system_prompt)
        response = self._cortex_chat_complete(chat_history)
        message = self._process_message(response)
        result = [message]
        if message.content.sql is not None:
            sqlResponse = self.process_sql(message)
            result.append(sqlResponse)
        return result


    def analyse_sql_result(self, context: Message, result: str) -> str:
        if not result: return None
        messages = self._get_analyse_sql_result_messages(self.context_file, context, result)
        chat_complete = self.sp_session.call(f'{APPLICATION}.{LLM_SCHEMA}.GET_CHAT_COMPLETE', 'mistral-7b', messages)
        response = chat_complete.first()[0]
        return response


    def get_system_prompt(self, context_file: str) -> str:
        return system_prompt(self.sp_session, context_file)
    

    def _cortex_chat_complete(self, chat_history: List[Message]) -> str:
        messages = json_parse_list(chat_history)
        chat_complete = self.sp_session.call(f'{APPLICATION}.{LLM_SCHEMA}.GET_CHAT_COMPLETE', 'mistral-7b', messages)
        response = chat_complete.first()[0]
        return response


    def _process_message(self, content: str) -> Message:
        message = Message(role='assistant', text=content)
        message = self._process_message_suggestions(message)
        message = self._process_message_sql(message)
        return message
    

    def _process_message_suggestions(self, message: Message) -> Message:
        content = message.content.text
        pattern = re.compile(r'<suggestions>(.*?)</suggestions>',flags=re.DOTALL)
        match = re.search(pattern, content)
        message.content.text = re.sub(pattern, '', content)
        
        if match:
            match = match.group()
            match = re.sub(r'</?suggestions>', '', match)
            try:
                suggestions = json.loads(match)
                message.content.suggestions = suggestions
            except:
                message.content.text += match

        return message
    

    def _process_message_sql(self, message: Message) -> Message:
        content = message.content.text
        pattern = re.compile(r'```(sql)?(.*?)```',flags=re.DOTALL)
        match = re.search(pattern, content)
        message.content.text = re.sub(pattern, '', content)

        if match:
            match = match.group()
            match = re.sub(r'```(sql)?', '', match)
            message.content.sql = match

        return message


    def _get_analyse_sql_result_sys_prompt_message(self, context_file: str) -> Message:
        sys_prompt = result_system_prompt(self.sp_session, context_file)
        return Message(role="system", text=sys_prompt)
    

    def _get_analyse_sql_result_messages(self, context_file: str, context: Message, result: str) -> str:
        sys_message = self._get_analyse_sql_result_sys_prompt_message(context_file)
        prompt_message = Message(role='user', text=result_prompt(result))
        return json_parse_list([sys_message, context, prompt_message])
    