from typing import List
from services.ai_assistant.llm.message import Message
from enums.llm import LLMType


class Assistant:
    def __init__(self, id: str, name: str, type: LLMType, chat: List[Message] = None):
        self.id = id
        self.name = name
        self.chat = chat
        self.type = type
