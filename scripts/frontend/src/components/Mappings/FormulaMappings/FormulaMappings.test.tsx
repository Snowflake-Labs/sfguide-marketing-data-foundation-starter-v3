import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormulaMappings, { IFormulaMappingsProps } from './FormulaMappings';
import { ColumnType, MappingType, TableModel } from 'dtos/ModelUI';
import { JoinTypes } from 'dtos/JoinDefinition';

const mockCode = "REPLACE(OBJ1.NAME,'l','')";
const mockTargetTable: TableModel = {
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
  qualify: [{ value: 'mockQualify', target: { alias: 'alias', object: 'database.schema.table01' } }],
  where: [{ value: 'mockWhere', target: { alias: 'alias', object: 'database.schema.table01' } }],
};
const mockOnCodeChange = jest.fn();
const mockOnRun = jest.fn();

const renderComponent = (props: Partial<IFormulaMappingsProps> = {}) => {
  const defaultProps: IFormulaMappingsProps = {
    code: mockCode,
    targetTable: mockTargetTable,
    onCodeChange: mockOnCodeChange,
    onRun: mockOnRun,
    ...props,
  };
  render(<FormulaMappings {...defaultProps} />);
};

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

describe('FormulaMappings', () => {
  test('renders the code editor', () => {
    renderComponent();
    const codeEditor = screen.getByRole('editor-textarea');

    expect(codeEditor).toBeInTheDocument();
    expect(codeEditor).toHaveValue(mockCode);
  });

  test('calls onCodeChange when code is changed', () => {
    renderComponent();
    const newCode = 'console.log("New code!");';
    const codeEditor = screen.getByRole('editor-textarea');

    fireEvent.change(codeEditor, { target: { value: newCode } });

    waitFor(() => expect(mockOnCodeChange).toHaveBeenCalledWith(expect.objectContaining({ transformation: newCode })));
  });

  test('calls onRun when run button is clicked', () => {
    renderComponent();
    const runButton = screen.getByTestId('onRunContainer');

    fireEvent.click(runButton);

    waitFor(() => expect(mockOnRun).toHaveBeenCalled());
  });

  test('calls onCodeChange with the correct column mapping when value is provided', () => {
    const mockCode = "REPLACE(OBJ1.NAME,'l','');";
    const mockColumnMapping = {
      transformation: mockCode,
      columns: [
        {
          object: 'OBJ1',
          columnName: 'NAME',
        },
      ],
    };
    const mockOnCodeChange = jest.fn();
    renderComponent({ code: mockCode, onCodeChange: mockOnCodeChange });

    const codeEditor = screen.getByRole('editor-textarea');
    fireEvent.change(codeEditor, { target: { value: mockCode } });

    waitFor(() => expect(mockOnCodeChange).toHaveBeenCalledWith(mockColumnMapping));
  });
});
