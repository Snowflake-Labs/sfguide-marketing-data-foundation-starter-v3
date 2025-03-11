import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MappingTable from './MappingTable';
import { MemoryRouter } from 'react-router-dom';
import { container } from 'ioc/inversify.config';
import { IMappingService } from 'interfaces/IMappingService';
import { TYPES } from 'ioc/types';
import { IPubSubService } from 'interfaces/IPubSubService';
import { IDatabaseService } from 'interfaces/IDatabaseService';
import Model from 'dtos/Model';
import { ProcessProgress } from 'dtos/ProcessProgress';
import { mockMappingService } from 'JestTest/mocks/mockMappingService';

jest.mock('locales/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('ioc/inversify.config', () => ({
  container: {
    get: (type: Symbol) => {
      switch (type) {
        case TYPES.IMappingService:
          const mockMapping: IMappingService = mockMappingService;
          return mockMapping;
        case TYPES.IPubSubService:
          const mockPubSub: IPubSubService = {
            subscribeToEvent: jest.fn(),
            unsubscribeFromEvent: jest.fn(),
            emitEvent: jest.fn(),
          };
          return mockPubSub;
        case TYPES.IDatabaseService:
          const mock: IDatabaseService = {
            getColumnsSchemaInformation: jest.fn().mockResolvedValue([]),
            getDatabases: jest.fn(),
            getSchemasByDatabase: jest.fn(),
            postSaveSource: jest.fn(),
          };
          return mock;
      }
    },
  },
}));

const mappingService = container.get<IMappingService>(TYPES.IMappingService);

describe('MappingTable Component', () => {
  test('renders the table title', () => {
    render(
      <MemoryRouter>
        <MappingTable onClickCreateSet={() => {}} />
      </MemoryRouter>
    );

    waitFor(() => expect(screen.getByText('MappingsTableHeader')).toBeInTheDocument());
  });

  test('renders the search bar', () => {
    render(
      <MemoryRouter>
        <MappingTable onClickCreateSet={() => {}} />
      </MemoryRouter>
    );

    waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());
  });

  test('renders the add transformation set button', () => {
    render(
      <MemoryRouter>
        <MappingTable onClickCreateSet={() => {}} />
      </MemoryRouter>
    );

    waitFor(() => expect(screen.getByText('AddTransformationSet')).toBeInTheDocument());
  });

  test('calls onClickCreateSet when add transformation set button is clicked', () => {
    const onClickCreateSet = jest.fn();
    render(
      <MemoryRouter>
        <MappingTable onClickCreateSet={onClickCreateSet} />
      </MemoryRouter>
    );

    waitFor(() => expect(screen.getByText('MappingsTableHeader')).toBeInTheDocument());

    waitFor(() => fireEvent.click(screen.getByText('AddTransformationSet')));

    waitFor(() => expect(onClickCreateSet).toHaveBeenCalled());
  });
});
