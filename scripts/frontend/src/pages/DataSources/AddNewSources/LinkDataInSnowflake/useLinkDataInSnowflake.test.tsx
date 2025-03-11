import { renderHook, act } from '@testing-library/react-hooks';
import useLinkDataInSnowflake, {
  ConnectionState,
  initCustomSelect,
  initCustomTableProps,
  initLinkDataLoading,
} from './useLinkDataInSnowflake';
import { SelectChangeEvent } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { IDatabaseService } from 'interfaces/IDatabaseService';
import { container } from 'ioc/inversify.config';

const generateEventSelect = (value: unknown) => {
  return { target: { value } } as SelectChangeEvent<{ value: unknown; name: string }>;
};

const mockDatabases = [
  { value: 'db1', label: 'Database 1' },
  { value: 'db2', label: 'Database 2' },
];

const mockSchemas = [
  { value: 's1', label: 'Schema 1' },
  { value: 's2', label: 'Schema 2' },
];

const mockCustomTableProps = {
  colums: [],
  data: [
    {
      name: 'T1',
    },
    {
      name: 'T2',
    },
  ],
  header: 'TablesNames',
  title: '',
};

const mockWrapper = {
  wrapper: Router,
};

const initializeMockDatabaseService = () => {
  const mockDatabaseService: IDatabaseService = {
    getDatabases: jest.fn().mockResolvedValue(mockDatabases),
    getSchemasByDatabase: jest.fn().mockResolvedValue(mockSchemas),
    postSaveSource: jest.fn().mockResolvedValue({ newCustomTable: mockCustomTableProps, newSource: {} }),
    getColumnsSchemaInformation: jest.fn(),
  };

  container.get = jest.fn().mockReturnValue(mockDatabaseService);

  return mockDatabaseService;
};

describe('useLinkDataInSnowflake', () => {
  test('should initialize with default values', async () => {
    initializeMockDatabaseService();
    const { result, waitForValueToChange } = renderHook(() => useLinkDataInSnowflake(), mockWrapper);

    expect(result.current.databases).toEqual(initCustomSelect);
    expect(result.current.databaseSelected).toBe('');
    expect(result.current.schemas).toEqual(initCustomSelect);
    expect(result.current.schemaSelected).toBe('');
    expect(result.current.connectorUsedSelected).toBe('');
    expect(result.current.open).toBe(false);
    expect(result.current.databases).toEqual(initCustomSelect);
    expect(result.current.connectionState).toBe(ConnectionState.isNotConnected);
    expect(result.current.customTableProps).toEqual(initCustomTableProps);
    expect(result.current.linkDataLoading).toEqual(initLinkDataLoading);

    await waitForValueToChange(() => result.current.databases);

    expect(result.current.databases).toEqual(mockDatabases);
  });

  test('should update databaseSelected and schemas when onChangeDataBase is called', async () => {
    initializeMockDatabaseService();
    const { result, waitForValueToChange } = renderHook(() => useLinkDataInSnowflake(), mockWrapper);
    const database1 = mockDatabases[0].value;

    expect(result.current.databaseSelected).toBe('');
    expect(result.current.schemas).toEqual(initCustomSelect);

    act(() => {
      const event = generateEventSelect(database1);
      result.current.onChangeDataBase(event);
    });
    await waitForValueToChange(() => result.current.schemas);

    expect(result.current.databaseSelected).toBe(database1);
    expect(result.current.schemas).toEqual(mockSchemas);
  });

  test('should update schemaSelected when onChangeSchema is called', () => {
    const { result } = renderHook(() => useLinkDataInSnowflake(), mockWrapper);
    const schema1 = mockSchemas[0].value;

    act(() => {
      const event = generateEventSelect(schema1);
      result.current.onChangeSchema(event);
    });

    expect(result.current.schemaSelected).toBe(schema1);
  });

  test('should update connectorUsedSelected when onChangeConnectorUsed is called', () => {
    const { result } = renderHook(() => useLinkDataInSnowflake(), mockWrapper);
    const connector1 = 'connector1';

    act(() => {
      const event = generateEventSelect(connector1);
      result.current.onChangeConnectorUsed(event);
    });

    expect(result.current.connectorUsedSelected).toBe(connector1);
  });

  test('should update open state when toggleDrawer is called', () => {
    const { result } = renderHook(() => useLinkDataInSnowflake(), mockWrapper);
    expect(result.current.open).toBe(false);

    act(() => {
      result.current.toggleDrawer();
    });

    expect(result.current.open).toBe(true);
  });

  test('should update linkDataLoading and connectionState when onClickConnect is called', async () => {
    initializeMockDatabaseService();
    const { result, waitForValueToChange } = renderHook(() => useLinkDataInSnowflake(), mockWrapper);

    expect(result.current.linkDataLoading.isLoadingData).toBe(false);
    expect(result.current.connectionState).toBe(ConnectionState.isNotConnected);

    act(() => {
      result.current.onClickConnect();
    });

    expect(result.current.linkDataLoading.isLoadingData).toBe(true);

    await waitForValueToChange(() => result.current.connectionState);

    expect(result.current.customTableProps).toEqual(mockCustomTableProps);
    expect(result.current.connectionState).toBe(ConnectionState.isConnected);
  });

  test('should handle error when onClickConnect is called and postSaveSource fails', async () => {
    const mockDatabaseService = initializeMockDatabaseService();
    mockDatabaseService.postSaveSource = jest.fn().mockRejectedValue(new Error('Failed to connect'));
    const { result, waitForValueToChange } = renderHook(() => useLinkDataInSnowflake(), mockWrapper);

    expect(result.current.linkDataLoading.isLoadingData).toBe(false);
    expect(result.current.connectionState).toBe(ConnectionState.isNotConnected);

    act(() => {
      result.current.onClickConnect();
    });

    expect(result.current.linkDataLoading.isLoadingData).toBe(true);

    await waitForValueToChange(() => result.current.connectionState);

    expect(result.current.customTableProps).toEqual(initCustomTableProps);
    expect(result.current.connectionState).toBe(ConnectionState.noGrantAccess);
  });
});
