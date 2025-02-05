import { ExistingSourcesContextWrapper, useExistingSourcesContext } from './ExistingSourcesContext';
import { waitFor, screen } from '@testing-library/react';
import { renderWithContext } from 'JestTest/utils';
import { initMockServices } from 'JestTest/mocks';
import { mockDataSourcesService } from 'JestTest/mocks/mockDataSourcesService';
import Source from 'dtos/Source';

describe('ExistingSourcesContext', () => {
  beforeAll(() => {
    initMockServices();
  });

  it('LoadingValueTest', async () => {
    renderWithContext(
      <ExistingSourcesContextWrapper>
        <MockLoading />
      </ExistingSourcesContextWrapper>
    );
    await waitFor(() => {
      const loadingValue = screen.getByTestId('loadingValue').textContent;
      expect(loadingValue).toBe('false');
    });
  });

  it('RowsToDeleteValueTest', async () => {
    renderWithContext(
      <ExistingSourcesContextWrapper>
        <MockRowsToDelete />
      </ExistingSourcesContextWrapper>
    );
    await waitFor(() => {
      const rowsToDeleteValue = JSON.parse(screen.getByTestId('rowsToDeleteValue').textContent || '[]')[0] as Source;
      expect(rowsToDeleteValue).toBeFalsy();
    });
  });

  it('ExistingsSourcesValueTest', async () => {
    jest.spyOn(mockDataSourcesService, 'getExistingSources').mockResolvedValue([
      {
        SOURCE_ID: 1,
        PROVIDER_NAME: 'Facebook',
        CONNECTOR_NAME: 'Fivetran',
        DATABASE: 'MYDB',
        SCHEMA: 'MYSCHEMA',
        CREATED_TIMESTAMP: new Date('2024-06-11'),
        MODEL_ID: 1,
        MODEL_NAME: 'Model1',
      },
    ]);
    renderWithContext(
      <ExistingSourcesContextWrapper>
        <MockExistingSources />
      </ExistingSourcesContextWrapper>
    );
    await waitFor(() => {
      const existingSourcesValue = JSON.parse(
        screen.getByTestId('existingSourcesValue').textContent || '[]'
      )[0] as Source;
      expect(existingSourcesValue.SOURCE_ID).toBe(1);
      expect(existingSourcesValue.PROVIDER_NAME).toBe('Facebook');
      expect(existingSourcesValue.CONNECTOR_NAME).toBe('Fivetran');
      expect(existingSourcesValue.DATABASE).toBe('MYDB');
      expect(existingSourcesValue.SCHEMA).toBe('MYSCHEMA');
      expect(existingSourcesValue.CREATED_TIMESTAMP).toBe('2024-06-11T00:00:00.000Z');
      expect(existingSourcesValue.MODEL_ID).toBe(1);
    });
  });
});

const MockLoading = () => {
  const { loading } = useExistingSourcesContext();
  return <p data-testid="loadingValue">{String(loading)}</p>;
};

const MockRowsToDelete = () => {
  const { rowsToDelete } = useExistingSourcesContext();
  return <p data-testid="rowsToDeleteValue">{JSON.stringify(rowsToDelete)}</p>;
};

const MockExistingSources = () => {
  const { existingSources } = useExistingSourcesContext();
  return <p data-testid="existingSourcesValue">{JSON.stringify(existingSources)}</p>;
};
