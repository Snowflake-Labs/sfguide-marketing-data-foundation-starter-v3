import { fireEvent, render, screen } from '@testing-library/react';
import TableModelsExtraSection, { ITableModelsExtraSectionProps } from './TableModelsExtraSection';
import { ColumnType, TableModel as OriginalTableModel, TableModel } from 'dtos/ModelUI';

jest.mock('../../../Mappings/DragGhost/DragGhost', () => ({
  DragGhost: () => {
    return <div />;
  },
}));

describe('TableModelsExtraSection', () => {
  const mockSources = [
    {
      object: 'FOO',
      columns: [
        { columnName: 'VARCHAR', object: 'FOO', type: ColumnType.VARCHAR },
        { columnName: 'NUMBER', object: 'FOO', type: ColumnType.NUMBER },
      ],
    },
    {
      object: 'GOO',
      columns: [
        { columnName: 'BOOLEAN', object: 'GOO', type: ColumnType.BOOLEAN },
        { columnName: 'VARIANT', object: 'GOO', type: ColumnType.VARIANT },
      ],
    },
  ];

  const mockOnClickElement = jest.fn();
  const mockOnDragStart = jest.fn();

  const renderComponent = (props: ITableModelsExtraSectionProps) => {
    return render(
      <TableModelsExtraSection
        tableModels={props.tableModels}
        draggable={props.draggable}
        onClickElement={props.onClickElement}
        onDragStart={props.onDragStart}
      />
    );
  };

  test('renders without error', () => {
    renderComponent({
      tableModels: mockSources as OriginalTableModel[],
      draggable: false,
      onClickElement: mockOnClickElement,
      onDragStart: mockOnDragStart,
    });
  });

  test('handles search change', () => {
    renderComponent({
      tableModels: mockSources as OriginalTableModel[],
      draggable: false,
      onClickElement: mockOnClickElement,
      onDragStart: mockOnDragStart,
    });

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'V' } });

    expect(searchInput).toHaveValue('V');
    expect(screen.getByText('VARCHAR')).toBeInTheDocument();
    expect(screen.getByText('VARIANT')).toBeInTheDocument();
  });
});
