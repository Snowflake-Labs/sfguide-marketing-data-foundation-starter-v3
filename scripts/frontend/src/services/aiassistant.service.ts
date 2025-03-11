import { AssistantInfo, NewAssistantInfo } from 'dtos/AssistantInfo';
import { Message } from 'dtos/Message';
import { IAiAssistantService } from 'interfaces/IAiAssistantService';
import { IRequestsService } from 'interfaces/IRequestsService';
import { inject, injectable } from 'inversify';
import { TYPES } from 'ioc/types';
import { getHost } from 'utils/host';

@injectable()
export class AiAssistantService implements IAiAssistantService {
  @inject(TYPES.IRequestsService)
  private requestsService!: IRequestsService;

  async getAssistants(): Promise<AssistantInfo[]> {
    const url = `${getHost()}/api/assistants`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async addAssistant(newAssistant: NewAssistantInfo): Promise<boolean> {
    const url = `${getHost()}/api/assistant/create_chat`;
    const json = { "name": newAssistant.NAME, "type": newAssistant.TYPE }
    const response = await this.requestsService.post(url, JSON.stringify(json));
    return response.json();
  }

  async deleteAssistant(id: string): Promise<boolean> {
    const url = `${getHost()}/api/assistant/${id}`;
    const response = await this.requestsService.delete(url);
    return response.json();
  }

  async renameAssistant(id: string, newName: string): Promise<boolean> {
    const url = `${getHost()}/api/assistant/${id}`;
    const json = { "name": newName }
    const response = await this.requestsService.patch(url, JSON.stringify(json));
    return response.json();
  }

  async assistantMessages(id: string): Promise<Message[]> {
    const url = `${getHost()}/api/assistant/${id}`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async sendMessage(id: string, question: string, contextFile: string): Promise<string> {
    const url = `${getHost()}/api/assistant/cortex_complete`;
    const json = { "id": id, "prompt": question, "context_file": contextFile }
    const response = await this.requestsService.post(url, JSON.stringify(json));
    return response.json();
  }
}
