import { initMockServices } from 'JestTest/mocks';
import { MappingContextWrapper, useMappingContext } from './MappingContext';
import { waitFor, screen } from '@testing-library/react';
import { renderWithContext } from 'JestTest/utils';
import { ModelUI } from 'dtos/ModelUI';

describe('MappingContext', () => {
  beforeAll(() => {
    initMockServices();
  });

  it('SetStepsTest', async () => {
    renderWithContext(
      <MappingContextWrapper>
        <MockModel />
      </MappingContextWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('loadingValue').textContent).toBe('true');
      const model = JSON.parse(screen.getByTestId('modelValue').textContent || '') as ModelUI;
      expect(model).toBeTruthy();
    });
  });
});

const MockModel = () => {
  const { modelLoading, model, setModelLoading } = useMappingContext();
  setModelLoading(true);
  return (
    <>
      <p data-testid="loadingValue">{String(modelLoading)}</p>
      <p data-testid="modelValue">{JSON.stringify(model)}</p>
    </>
  );
};
