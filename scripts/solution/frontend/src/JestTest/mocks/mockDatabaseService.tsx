import { IDatabaseService } from 'interfaces/IDatabaseService';

export const mockDatabaseService: IDatabaseService = {
  getSchemasByDatabase: jest.fn(),
  getColumnsSchemaInformation: jest.fn().mockResolvedValue([]),
  getDatabases: jest.fn(),
  postSaveSource: jest.fn(),
};