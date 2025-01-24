import Model from 'dtos/Model';
import { ModelStatus } from 'dtos/ModelStatus';
import { ProcessDefinition } from 'dtos/Process';
import { ProcessProgress } from 'dtos/ProcessProgress';
import { ProcessStatus } from 'dtos/ProcessStatus';
import { StandardMappingModel } from 'dtos/StandardMappingModel';

export interface IMappingService {
  executeModelUI(modelId: string): Promise<ProcessProgress[]>;
  updateDataModel(modelId: number, model: Model): Promise<void>;
  getAllModels(sourceId: string): Promise<Model[]>;
  getModelById(modelId: number): Promise<Model>;
  validateSql(process: ProcessDefinition): Promise<{ data: [string[]]; total_row_count: string }>;
  validateMapping(mapping: StandardMappingModel, sourceDatabase?: string, sourceSchema?: string): Promise<void>;
  createModel(targetModel: Model): Promise<Model>;
  createProcess(model: StandardMappingModel): Promise<void>;
  updateProcess(model: StandardMappingModel, modelId: string): Promise<void>;
  updateSourceModelID(sourceId: number, modelId: number): Promise<void>;
  getModelStatus(modelId: string): Promise<ModelStatus[]>;
  getProcessStatus(modelId: string): Promise<ProcessStatus[]>;
}
