import { AssistantInfo, NewAssistantInfo } from 'dtos/AssistantInfo';
import { Message } from 'dtos/Message';
import { IAiAssistantService } from 'interfaces/IAiAssistantService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useTranslation } from 'locales/i18n';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

type AIAssistantContext = {
  addAssistant: boolean;
  setAddAssistant: (value: boolean) => void;
  assistants: AssistantInfo[];
  addNewAssistant: (assistant: NewAssistantInfo) => void;
  selectedAssistant: AssistantInfo  | undefined;
  setSelectedAssistant: (assistant: AssistantInfo | undefined) => void;
  chat: Message[];
  updateChat: (messageType: string) => void;
  deleteAssistant: (assistantId: string) => void;
  renameAssistant: (assistantId: string, newName: string) => void;
  setAssistantContextFile: (contextFile: string) => void;
  contextFile: string;
  conversationLoading: boolean;
  assistantLoading: string;
  sidebarLoading: boolean;
  setAssistantLoading: (value: string) => void;
  setShouldReload: (value: boolean) => void;
};

const defaultContext: AIAssistantContext = {
  addAssistant: false,
  setAddAssistant: () => {},
  assistants: [],
  addNewAssistant: () => {},
  selectedAssistant: { id: "", name: "", chat: [], type: "" },
  setSelectedAssistant: () => {},
  chat: [],
  updateChat: () => {},
  deleteAssistant: () => {},
  renameAssistant: () => {},
  setAssistantContextFile: () => {},
  contextFile: "",
  conversationLoading: true,
  assistantLoading: '',
  sidebarLoading: false,
  setAssistantLoading: () => {},
  setShouldReload: () => {},
};

const AIAssistantContext = createContext<AIAssistantContext>(defaultContext);

interface Props {
  children: ReactNode;
}

export function AIAssistantContextWrapper(props: Props) {
  const { t } = useTranslation('comun');
  const aiAssistantService = container.get<IAiAssistantService>(TYPES.IAiAssistantService);
  const [addAssistant, setAddAssistant] = useState<boolean>(false);
  const [assistants, setAssistants] = useState<AssistantInfo[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<AssistantInfo>();
  const [chat, setChat] = useState<Message[]>([]);
  const [contextFile, setContextFile] = useState<string>("");
  const [conversationLoading, setConversationLoading] = useState<boolean>(true);
  const [assistantLoading, setAssistantLoading] = useState<string>('');
  const [sidebarLoading, setSidebarLoading] = useState<boolean>(false);
  const [shouldReload, setShouldReload] = useState<boolean>(true);

  const get_assistants =  async (currentAssistantId: string = "") => { 
    await aiAssistantService.getAssistants().then((assistants) => { 
      setAssistants(assistants); 
      if (assistants) {
        setSelectedAssistant(currentAssistantId 
          ? assistants.find(assistant => assistant.id === currentAssistantId) 
          : assistants[assistants.length - 1]);
      }
      setSidebarLoading(false);
      setAssistantLoading('');
    });
  }

  const get_assistant_messages =  async () => {
    if (selectedAssistant) {
      aiAssistantService.assistantMessages(selectedAssistant.id).then((messages) => {
        messages.unshift({ role: "assistant", content: { text: t('TextChatBotWelcome'), sql: "", suggestions: [] }, result: "", error: "" });
        setChat(messages);
        setConversationLoading(false);
        setAssistantLoading('');
      });
    }
  }

  useEffect(() => {
    if (selectedAssistant && shouldReload) {
      setAssistantLoading(t('LoadingAssistant'));
      get_assistant_messages();
    }
    setShouldReload(true);
  }, [selectedAssistant]);

  useEffect(() => {
    setAssistantLoading(t('LoadingAssistants'));
    get_assistants();
  }, []);

  const addNewAssistant = async (assistant: NewAssistantInfo) => {
    setAssistantLoading(t('CreatingAssistant'));
    setAddAssistant(false);
    await aiAssistantService.addAssistant(assistant);
    get_assistants();
  };

  const deleteAssistant = async (assistantId: string) => {
    setSidebarLoading(true);
    setAssistantLoading(t('DeletingAssistant'));
    await aiAssistantService.deleteAssistant(assistantId);
    setShouldReload(false);
    get_assistants();
  };

  const renameAssistant = async (assistantId: string, newName: string) => {
    setShouldReload(false);
    setSidebarLoading(true);
    await aiAssistantService.renameAssistant(assistantId, newName);
    await get_assistants(assistantId);
  };

  const updateChat = async (message: string) => {
    if (selectedAssistant) {
      setConversationLoading(true);
      let tempChat = [...chat];
      tempChat.push({ role: "user", content: { text: message, sql: "", suggestions: [] }, result: "", error: "" });
      tempChat.push({ role: "assistant", content: { text: t('AssistantIsTyping'), sql: "", suggestions: [] }, result: "", error: "" });
      setChat(tempChat);
      await aiAssistantService.sendMessage(selectedAssistant.id, message, contextFile);
      get_assistant_messages();
    }
  }

  const setAssistantContextFile = (contextFile: string) => {
    setContextFile(contextFile);
  }

  const sharedState: AIAssistantContext = useMemo(
    () => ({
      addAssistant,
      setAddAssistant,
      assistants,
      addNewAssistant,
      selectedAssistant,
      setSelectedAssistant,
      chat,
      updateChat,
      deleteAssistant,
      renameAssistant,
      setAssistantContextFile,
      contextFile,
      conversationLoading,
      assistantLoading,
      sidebarLoading,
      setAssistantLoading,
      setShouldReload,
    }),
    [
      assistants, 
      contextFile, 
      addAssistant, 
      selectedAssistant, 
      setAddAssistant, 
      chat, 
      conversationLoading, 
      assistantLoading, 
      sidebarLoading
    ]
  );

  return <AIAssistantContext.Provider value={sharedState}>{props.children}</AIAssistantContext.Provider>;
}

export function useAIAssistantContext() {
  return useContext(AIAssistantContext);
}
