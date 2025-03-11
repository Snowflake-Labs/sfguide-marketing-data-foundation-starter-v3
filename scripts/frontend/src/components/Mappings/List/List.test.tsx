import { fireEvent, render } from '@testing-library/react';
import List from './List';
import { act } from 'react';
import { ColumnType, TableModel } from 'dtos/ModelUI';

const mockElements: TableModel[] = [
  {
    object: 'p1',
    tableName: 'p1',
    type: 'source',
    schemaName: '',
    databaseName: '',
    alias: 'alias',
    columns: [
      { columnName: 'e1', type: ColumnType.VARCHAR, sqlType: 'BOOLEAN', object: '' },
      { columnName: 'e2', type: ColumnType.VARCHAR, sqlType: 'BOOLEAN', object: '' },
    ],
  },
];

jest.mock('../DragGhost/DragGhost', () => ({
  DragGhost: () => {
    return <div />;
  },
}));

describe('List Component', () => {
  test('renders children', () => {
    const { getByText, getByTestId } = render(<List elements={mockElements} />);
    expect(getByTestId('label').textContent).toEqual('p1- alias');
    expect(getByText('e1')).toBeInTheDocument();
    expect(getByText('e2')).toBeInTheDocument();
  });

  test('handles onClickAccordion header event', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<List elements={mockElements} onClickAccordion={handleClick} />);

    act(() => {
      fireEvent.click(getByText('p1'));
    });

    expect(handleClick).toHaveBeenNthCalledWith(1, 'p1', undefined, undefined);
  });

  test('handles onClickAccordion item event', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<List elements={mockElements} onClickAccordion={handleClick} />);

    act(() => {
      fireEvent.click(getByText('e1'));
    });

    expect(handleClick).toHaveBeenNthCalledWith(1, 'p1', 'e1', 'alias');
  });
});
