import { container } from "ioc/inversify.config";
import { TYPES } from "ioc/types";
import { mockDataSourcesService } from "./mocks/mockDataSourcesService";
import { mockDatabaseService } from "./mocks/mockDatabaseService";
import { mockMappingService } from "./mocks/mockMappingService";
import { mockPubSubService } from "./mocks/mockPubSubService";
import { mockAiAssistantService } from "./mocks/mockAiAssistantService";

export function initMockServices() {
  jest.spyOn(container, 'get').mockImplementation((type: any) => {
    return mockServices.get(type as Symbol);
  });
  return mockServices;
}

const mockServices = new Map<Symbol, unknown>([
  [TYPES.IDataSources, mockDataSourcesService],
  [TYPES.IMappingService, mockMappingService],
  [TYPES.IDatabaseService, mockDatabaseService],
  [TYPES.IPubSubService, mockPubSubService],
  [TYPES.IAiAssistantService, mockAiAssistantService],
]);