import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslation } from 'locales/i18n';
import TargetLagModal from './TargetLagModal';
import { TableModel } from 'dtos/ModelUI';

jest.mock('locales/i18n', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }));

describe('TargetLagModal', () => {
  const mockTranslation = jest.fn();

  const mockTable: TableModel = {
      tableName: 'Mock Table',
      targetLag: {
          number: 5,
          timeUnit: 'minutes',
      },
      type: 'source',
      columns: [],
      alias: '',
      object: '',
      schemaName: '',
      databaseName: ''
  };

  const mockSetOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the modal with correct title and table name', () => {
    render(<TargetLagModal openModal={true} table={mockTable} setOpen={mockSetOpen} />);

    expect(screen.getByText('DefineTargetLag')).toBeInTheDocument();
    expect(screen.getByText('TargetTable: Mock Table')).toBeInTheDocument();
  });

  test('renders the number and time unit select options', () => {
    render(<TargetLagModal openModal={true} table={mockTable} setOpen={mockSetOpen} />);

    expect(screen.getByLabelText('Number')).toBeInTheDocument();
    expect(screen.getByLabelText('TimeUnit')).toBeInTheDocument();
  });

  test('calls the handleSetTargetLag function when save button is clicked', () => {
    render(<TargetLagModal openModal={true} table={mockTable} setOpen={mockSetOpen} />);

    const saveButton = screen.getByText('BtnSave');
    fireEvent.click(saveButton);

    expect(mockSetOpen).toHaveBeenCalledTimes(1);
  });

  test('calls the handleCancel function when cancel button is clicked', () => {
    render(<TargetLagModal openModal={true} table={mockTable} setOpen={mockSetOpen} />);

    const cancelButton = screen.getByText('BtnCancel');
    fireEvent.click(cancelButton);

    expect(mockSetOpen).toHaveBeenCalledTimes(1);
  });
});