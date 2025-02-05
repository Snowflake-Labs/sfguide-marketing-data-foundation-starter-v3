import { IMappingService } from 'interfaces/IMappingService';
import { inject, injectable } from 'inversify';
import { TYPES } from 'ioc/types';
import { IRequestsService } from 'interfaces/IRequestsService';
import { getHost } from 'utils/host';
import Model from 'dtos/Model';
import { StandardMappingModel } from 'dtos/StandardMappingModel';
import { ProcessDefinition } from 'dtos/Process';
import { ModelStatus } from 'dtos/ModelStatus';
import { ProcessStatus } from 'dtos/ProcessStatus';
import { ProcessProgress } from 'dtos/ProcessProgress';

@injectable()
export class MappingService implements IMappingService {
  @inject(TYPES.IRequestsService)
  private requestsService!: IRequestsService;

  async executeModelUI(modelId: string): Promise<ProcessProgress[]> {
    if (!modelId) return Promise.reject('Model ID is required');
    const url = `${getHost()}/api/mappings/${modelId}`;
    const response = await this.requestsService.post(url, '');
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  }

  async updateDataModel(modelId: number, model: Model): Promise<void> {
    const url = `${getHost()}/api/mappings/${modelId}`;
    const json = JSON.stringify(model);
    const response = await this.requestsService.put(url, json);
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  }

  async getAllModels(sourceId: string): Promise<Model[]> {
    const url = `${getHost()}/api/mappings/source/${sourceId}`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async getModelById(modelId: number): Promise<Model> {
    const url = `${getHost()}/api/mappings/${modelId}`;
    const response = await this.requestsService.get(url);
    const result: Model = await response.json();
    return response.ok ? this.processModelUI(result) : Promise.reject(result);
  }

  async validateSql(process: ProcessDefinition): Promise<{ data: [any[]]; total_row_count: string }> {
    const url = `${getHost()}/api/mappings/sql_validation/`;
    const json = JSON.stringify(process);
    const response = await this.requestsService.post(url, json);
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  }

  async validateMapping(mapping: StandardMappingModel, sourceDatabase?: string, sourceSchema?: string): Promise<void> {
    const url = `${getHost()}/api/mappings/source_validation/`;
    const json = JSON.stringify(mapping);
    const response = await this.requestsService.post(url, json);
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  }

  processModelUI(model: Model): Model {
    if (typeof model?.MODEL_UI == 'string') model.MODEL_UI = JSON.parse(model.MODEL_UI);
    return model;
  }

  async createModel(targetModel: Model): Promise<Model> {
    const url = `${getHost()}/api/mappings/`;
    const json = JSON.stringify(targetModel);
    const response = await this.requestsService.post(url, json);
    const result = await response.json();
    return response.ok ? this.processModelUI(result) : Promise.reject(result);
  }

  async updateSourceModelID(sourceId: number, modelId: number): Promise<void> {
    const url = `${getHost()}/api/mappings/source/${sourceId}/model/${modelId}`;
    const response = await this.requestsService.put(url, '');
    return response.json();
  }

  async createProcess(model: StandardMappingModel): Promise<void> {
    const url = `${getHost()}/api/process/`;
    const json = JSON.stringify(model);
    const response = await this.requestsService.post(url, json);
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  }

  async getProcessStatus(modelId: string): Promise<ProcessStatus[]> {
    const url = `${getHost()}/api/process/${modelId}`;
    const response = await this.requestsService.get(url);
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  }

  async updateProcess(model: StandardMappingModel, modelId: string): Promise<void> {
    const url = `${getHost()}/api/process/${modelId}`;
    const json = JSON.stringify(model);
    const response = await this.requestsService.put(url, json);
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  }

  async getModelStatus(modelId: string): Promise<ModelStatus[]> {
    const url = `${getHost()}/api/mappings/${modelId}/status`;
    const response = await this.requestsService.get(url);
    return response.json();
  }
}
