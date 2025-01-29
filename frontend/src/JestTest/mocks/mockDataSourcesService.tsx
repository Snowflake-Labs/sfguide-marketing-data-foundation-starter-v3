import { IDataSourcesService } from 'interfaces/IDataSourcesService';

export const mockDataSourcesService: IDataSourcesService = {
  getExistingSources: jest.fn().mockResolvedValue([]),
  deleteExistingSources: jest.fn(),
  getSource: jest.fn(),
};
