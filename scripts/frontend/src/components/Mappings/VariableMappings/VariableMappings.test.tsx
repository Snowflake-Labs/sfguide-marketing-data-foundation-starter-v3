import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import VariableMappings from './VariableMappings';
import * as MappingContext from 'contexts/MappingContext/MappingContext';
import { ColumnType } from 'dtos/ModelUI';

describe('VariableMappings', () => {
  jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

  jest.spyOn(MappingContext, 'useMappingContext').mockImplementation(() => {
    return { model: { id: 'model-id', name: 'model-name' }, sourceDatabaseSchema: 'mockSource' } as any;
  });

  test('renders without error', () => {
    render(<VariableMappings onSelectSource={() => {}} />);
    expect(screen.getByTestId('variable-mappings')).toBeInTheDocument();
  });

  test('calls onSelectSource when a source is selected', () => {
    // arrange
    const onSelectSourceMock = jest.fn();
    const { getByText } = render(<VariableMappings onSelectSource={onSelectSourceMock} />);

    const expectedModelId = {
      transformation: `'${'model-id'}'`,
      displayValue: 'model-id',
      columnType: ColumnType.VARCHAR,
      columns: [{ columnName: 'NULL', object: 'mockSource' }],
    };
    const expectedModelName = {
      transformation: `'${'model-name'}'`,
      displayValue: 'model-name',
      columnType: ColumnType.VARCHAR,
      columns: [{ columnName: 'NULL', object: 'mockSource' }],
    };
    const expectedDate = {
      transformation: "TO_TIMESTAMP_NTZ('2020-01-01T00:00:00.000Z')",
      displayValue: '2020-01-01T00:00:00.000Z',
      columnType: ColumnType.DATE,
      columns: [{ columnName: 'NULL', object: 'mockSource' }],
    };

    // act
    act(() => {
      fireEvent.click(getByText('model-name'));
      fireEvent.click(getByText('model-id'));
      fireEvent.click(getByText('current-timestamp'));
    });

    // assert
    expect(onSelectSourceMock).toHaveBeenNthCalledWith(1, expectedModelName);
    expect(onSelectSourceMock).toHaveBeenNthCalledWith(2, expectedModelId);
    expect(onSelectSourceMock).toHaveBeenNthCalledWith(3, expectedDate);
  });
});
