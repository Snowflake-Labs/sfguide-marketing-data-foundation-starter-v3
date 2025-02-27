import { AssistantInfo, NewAssistantInfo } from "dtos/AssistantInfo";
import { Message } from "dtos/Message";


export interface IAiAssistantService {
  getAssistants(): Promise<AssistantInfo[]>;
  addAssistant(newAssistantValue: NewAssistantInfo): Promise<boolean>
  deleteAssistant(id: string): Promise<boolean>
  renameAssistant(id: string, newName: string): Promise<boolean>
  assistantMessages(id: string): Promise<Message[]>
  sendMessage(id: string, question: string, contextFile: string): Promise<string>
}
