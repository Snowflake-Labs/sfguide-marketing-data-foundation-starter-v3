import { render, screen, waitFor } from '@testing-library/react';
import FiltersDrawer, { IFilterDrawerProps } from './FiltersDrawer';
import { JoinTypes } from 'dtos/JoinDefinition';
import { ColumnType, ConditionType, MappingType } from 'dtos/ModelUI';

const renderComponent = (props: Partial<IFilterDrawerProps> = {}) => {
  const defaultProps: IFilterDrawerProps = {
    type: ConditionType.Qualify,
    table: {
      alias: 'mockAlias',
      object: 'mockObject',
      tableName: 'mockTableName',
      schemaName: 'mockSchemaName',
      databaseName: 'mockDatabaseName',
      type: 'source',
      columns: [
        {
          columnName: 'mockColumnName',
          object: 'mockObject',
          type: ColumnType.VARCHAR,
          sqlType: 'VARCHAR',
        },
      ],
      mappings: [
        {
          sources: [
            {
              columnName: 'mockSourceColumnName',
              object: 'mockObject',
            },
          ],
          target: {
            columnName: 'mockTargetColumnName',
            object: 'mockObject',
          },
          type: MappingType.Column,
          mapping: 'mockMapping',
        },
      ],
      joins: [
        {
          target: {
            alias: 'TAB01',
            object: 'database.schema.table01',
            tableName: 'table01',
            databaseName: 'database',
            schemaName: 'schema',
          },
          from: {
            alias: 'mockAlias',
            object: 'mockObject',
            tableName: 'mockTableName',
            schemaName: 'mockSchemaName',
            databaseName: 'mockDatabaseName',
          },
          to: {
            alias: 'mockAlias',
            object: 'mockObject',
            tableName: 'mockTableName',
            schemaName: 'mockSchemaName',
            databaseName: 'mockDatabaseName',
          },
          type: JoinTypes.INNER,
          on: 'mockOn',
        },
      ],
      where: [{ value: 'mockWhere', target: { alias: 'mockAlias', object: 'mockObject' } }],
      qualify: [{ value: 'mockQualify', target: { alias: 'mockAlias', object: 'mockObject' } }],
      position: {
        x: 0,
        y: 0,
      },
    },
    open: true,
    onClose: () => {},
    ...props,
  };
  return render(<FiltersDrawer {...defaultProps} />);
};

jest.mock('../../../Mappings/DragGhost/DragGhost', () => ({
  DragGhost: () => {
    return <div />;
  },
}));

jest.mock('@uiw/react-codemirror', () => {
  const FakeEditor = jest.fn((props) => {
    return (
      <textarea
        role="editor-textarea"
        data-auto={props.wrapperClassName}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
      />
    );
  });

  return FakeEditor;
});

describe('FiltersDrawer', () => {
  test('renders without crashing', () => {
    renderComponent();
  });

  test('handleOnChange updates the condition state', () => {
    renderComponent();
    const columnElement = screen.getByText('mockColumnName');
    const FakeEditor = screen.getByRole('editor-textarea');

    columnElement.click();

    waitFor(() => expect(FakeEditor).toHaveTextContent('mockAlias.mockColumnName'));
  });
});
