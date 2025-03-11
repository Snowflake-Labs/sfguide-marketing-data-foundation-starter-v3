import { IMappingService } from 'interfaces/IMappingService';

export const mockMappingService: IMappingService = {
  getModelById: jest.fn().mockResolvedValue([]),
  executeModelUI: jest.fn(),
  updateDataModel: jest.fn(),
  getAllModels: jest.fn(),
  validateSql: jest.fn(),
  validateMapping: jest.fn(),
  createModel: jest.fn(),
  updateSourceModelID: jest.fn(),
  createProcess: jest.fn(),
  updateProcess: jest.fn(),
  getModelStatus: jest.fn(),
  getProcessStatus: jest.fn(),
};
