import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DataSources from './DataSources';
import { container } from 'ioc/inversify.config';
import { IDataSourcesService } from 'interfaces/IDataSourcesService';
import { act } from 'react';
import { FullPathConstants } from 'routes/pathConstants';

const mockExistingSources = [
  {
    SOURCE_ID: 1,
    PROVIDER_NAME: 'Provider 1',
    CONNECTOR_NAME: 'Connector 1',
    DATABASE_NAME: 'Database 1',
    SCHEMA_NAME: 'Schema 1',
    CREATED_TIMESTAMP: '2022-01-01 00:00:00',
    MODEL_ID: null,
  },
  {
    SOURCE_ID: 2,
    PROVIDER_NAME: 'Provider 2',
    CONNECTOR_NAME: 'Connector 2',
    DATABASE_NAME: 'Database 2',
    SCHEMA_NAME: 'Schema 2',
    CREATED_TIMESTAMP: '2022-01-02 00:00:00',
    MODEL_ID: null,
  },
  {
    SOURCE_ID: 3,
    PROVIDER_NAME: 'Provider 3',
    CONNECTOR_NAME: 'Connector 3',
    DATABASE_NAME: 'Database 3',
    SCHEMA_NAME: 'Schema 3',
    CREATED_TIMESTAMP: '2022-01-03 00:00:00',
    MODEL_ID: null,
  },
  {
    SOURCE_ID: 4,
    PROVIDER_NAME: 'Provider 4',
    CONNECTOR_NAME: 'Connector 4',
    DATABASE_NAME: 'Database 4',
    SCHEMA_NAME: 'Schema 4',
    CREATED_TIMESTAMP: '2022-01-04 00:00:00',
    MODEL_ID: null,
  },
];

const initializeMockDataSourcesService = () => {
  const mockDataSourcesService: IDataSourcesService = {
    getExistingSources: jest.fn().mockResolvedValue(mockExistingSources),
    deleteExistingSources: jest.fn(),
    getSource: jest.fn(),
  };

  container.get = jest.fn().mockReturnValue(mockDataSourcesService);

  return mockDataSourcesService;
};

jest.mock('locales/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DataSources', () => {
  beforeEach(() => {
    initializeMockDataSourcesService();
  });

  test('renders tabs correctly', () => {
    render(
      <MemoryRouter>
        <DataSources />
      </MemoryRouter>
    );

    const existingSourcesTab = screen.getByText('TabPanelExistingSources');
    const addNewSourceTab = screen.getByText('TabPanelAddNewSource');

    expect(existingSourcesTab).toBeInTheDocument();
    expect(addNewSourceTab).toBeInTheDocument();
  });

  test('navigates to existing sources tab on initial load', () => {
    render(
      <MemoryRouter initialEntries={[FullPathConstants.toExistingSources]}>
        <DataSources />
      </MemoryRouter>
    );

    const existingSourcesTab = screen.getByRole('tab', { name: 'TabPanelExistingSources' });
    const addNewSourceTab = screen.getByRole('tab', { name: 'TabPanelAddNewSource' });

    expect(existingSourcesTab).toHaveAttribute('aria-selected', 'true');
    expect(addNewSourceTab).toHaveAttribute('aria-selected', 'false');
  });

  test('navigates to add new source tab when tab is clicked', () => {
    render(
      <MemoryRouter initialEntries={[FullPathConstants.toExistingSources]}>
        <DataSources />
      </MemoryRouter>
    );

    const existingSourcesTab = screen.getByRole('tab', { name: 'TabPanelExistingSources' });
    const addNewSourceTab = screen.getByRole('tab', { name: 'TabPanelAddNewSource' });

    expect(existingSourcesTab).toHaveAttribute('aria-selected', 'true');
    expect(addNewSourceTab).toHaveAttribute('aria-selected', 'false');

    act(() => {
      addNewSourceTab.click();
    });

    waitFor(() => {
      expect(existingSourcesTab).toHaveAttribute('aria-selected', 'false');
      expect(addNewSourceTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  test('renders existing sources only if the path is /datasources/existing', () => {
    render(
      <MemoryRouter initialEntries={[FullPathConstants.toModel]}>
        <DataSources />
      </MemoryRouter>
    );

    const existingSourcesTab = screen.getByRole('tab', { name: 'TabPanelExistingSources' });
    const addNewSourceTab = screen.getByRole('tab', { name: 'TabPanelAddNewSource' });

    expect(existingSourcesTab).toHaveAttribute('aria-selected', 'false');
    expect(addNewSourceTab).toHaveAttribute('aria-selected', 'true');
  });
});
