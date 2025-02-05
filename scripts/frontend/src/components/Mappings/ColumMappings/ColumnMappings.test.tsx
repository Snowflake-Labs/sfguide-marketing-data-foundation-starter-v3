import { fireEvent, render, screen } from '@testing-library/react';
import ColumnMappings from './ColumnMappings';
import { ColumnType, TableModel } from 'dtos/ModelUI';
import { act } from 'react';

const tableModel: TableModel[] = [
  {
    type: 'source',
    columns: [
      {
        columnName: 'column01',
        type: ColumnType.VARCHAR,
        sqlType: 'VARCHAR',
        object: 'database.schema.table01',
      },
    ],
    alias: 'TAB01',
    object: 'database.schema.table01',
    tableName: 'table01',
    schemaName: 'schema',
    databaseName: 'database',
  },
];

jest.mock('../DragGhost/DragGhost', () => ({
  DragGhost: () => {
    return <div />;
  },
}));

describe('ColumnMappings', () => {
  it('renders without errors', () => {
    render(<ColumnMappings tableModel={tableModel} onSelectSource={() => {}} />);
    expect(screen.getByTestId('column-mappings')).toBeInTheDocument();
  });

  it('calls onSelectSource when a column mapping is selected', () => {
    // arrange
    const onSelectSourceMock = jest.fn();
    const { getByText } = render(<ColumnMappings tableModel={tableModel} onSelectSource={onSelectSourceMock} />);
    const expected = {
      columns: [{ columnName: 'column01', object: 'database.schema.table01' }],
      transformation: 'TAB01.column01',
      columnType: ColumnType.VARCHAR,
    };

    // act
    act(() => {
      fireEvent.click(getByText('column01'));
    });

    // assert
    expect(onSelectSourceMock).toHaveBeenCalledWith(expected);
  });
});
