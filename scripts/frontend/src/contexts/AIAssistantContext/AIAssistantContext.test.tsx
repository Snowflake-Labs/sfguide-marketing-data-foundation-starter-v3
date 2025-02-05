import { AIAssistantContextWrapper, useAIAssistantContext } from "./AIAssistantContext";
import { waitFor, screen } from "@testing-library/react";
import { initMockServices } from "JestTest/mocks";
import { renderWithContext } from "JestTest/utils";
import { AssistantInfo } from "dtos/AssistantInfo";
import { mockAiAssistantService } from "JestTest/mocks/mockAiAssistantService";
import { Message } from "dtos/Message";

describe('AIAssistantContext', () => {

  beforeAll(() => {
    initMockServices();
  });

  it('AssistantsList', async () => {
    jest.spyOn(mockAiAssistantService, 'getAssistants').mockResolvedValue(Promise.resolve([{
      id: "1010",
      name: "MyAssistant",
      chat: [],
      type: "CortexCopilot"
    }]));
    jest.spyOn(mockAiAssistantService, 'assistantMessages').mockResolvedValue(Promise.resolve([
      {
        role: "assistant",
        content: { text: "Assistant Answer", sql: "", suggestions: [] },
        result: "Assistant Result",
        error: ""
      }
    ]));
    renderWithContext(
      <AIAssistantContextWrapper>
        <MockLoading/>
      </AIAssistantContextWrapper>
    );
    await waitFor(() => {
      const assistantInfo = JSON.parse(screen.getByTestId('assistants').textContent || '[]')[0] as AssistantInfo;
      expect(assistantInfo.id).toStrictEqual("1010");
      expect(assistantInfo.name).toStrictEqual("MyAssistant");
      expect(assistantInfo.chat).toStrictEqual([]);
      expect(assistantInfo.type).toStrictEqual("CortexCopilot");

      const selectedAssistant = JSON.parse(screen.getByTestId('selectedAssistant').textContent || '[]') as AssistantInfo;
      expect(selectedAssistant).toEqual(assistantInfo);

      const chat = JSON.parse(screen.getByTestId('chat').textContent || '[]')[1] as Message;
      expect(chat.role).toStrictEqual("assistant");
      expect(chat.content.text).toStrictEqual("Assistant Answer");
      expect(chat.result).toStrictEqual("Assistant Result");
      expect(chat.error).toStrictEqual("");

      const conversationLoading = screen.getByTestId('conversationLoading').textContent;
      expect(conversationLoading).toBe('false');

      const assistantLoading = screen.getByTestId('assistantLoading').textContent;
      expect(assistantLoading).toBe('');

      const sidebarLoading = screen.getByTestId('sidebarLoading').textContent;
      expect(sidebarLoading).toBe('false');
    });
  });

});

const MockLoading = () => {
  const { assistants, selectedAssistant, chat, conversationLoading, assistantLoading, sidebarLoading } = useAIAssistantContext();
  return (
    <>
      <p data-testid='assistants'>{JSON.stringify(assistants)}</p>
      <p data-testid='selectedAssistant'>{JSON.stringify(selectedAssistant)}</p>
      <p data-testid='chat'>{JSON.stringify(chat)}</p>
      <p data-testid='conversationLoading'>{String(conversationLoading)}</p>
      <p data-testid='assistantLoading'>{assistantLoading}</p>
      <p data-testid='sidebarLoading'>{String(sidebarLoading)}</p>
    </>
  );
};

