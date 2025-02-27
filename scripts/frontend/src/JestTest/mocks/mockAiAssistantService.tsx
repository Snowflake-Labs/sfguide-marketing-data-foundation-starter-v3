import { IAiAssistantService } from "interfaces/IAiAssistantService";

export const mockAiAssistantService: IAiAssistantService = {
    getAssistants: jest.fn().mockResolvedValue([]),
    addAssistant: jest.fn(),
    deleteAssistant: jest.fn(),
    renameAssistant: jest.fn(),
    assistantMessages: jest.fn().mockResolvedValue([]),
    sendMessage: jest.fn(),
};