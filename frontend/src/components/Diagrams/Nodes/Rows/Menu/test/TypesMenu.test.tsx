import { render, screen, fireEvent } from '@testing-library/react';
import TypesMenu from '../TypesMenu';
import { ColumnModel, ColumnType } from 'dtos/ModelUI';

describe('TypesMenu', () => {
  const column: ColumnModel = {
    type: ColumnType.VARCHAR,
    sqlType: 'VARCHAR',
    columnName: 'mock-column',
    object: 'db.schema.table',
  };

  const onChangeType = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    render(<TypesMenu open={true} column={column} onChangeType={onChangeType} onClose={onClose} />);
  });

  it('renders the menu', () => {
    const menuElement = screen.getByRole('menu');
    expect(menuElement).toBeInTheDocument();
  });

  it('renders the menu items', () => {
    const menuItemElements = screen.getAllByRole('menuitem');
    expect(menuItemElements.length).toBe(6);
  });

  it('calls onChangeType when a menu item is clicked', () => {
    const menuItemElement = screen.getByText('NUMBER');
    fireEvent.click(menuItemElement);
    expect(onChangeType).toHaveBeenCalledWith('NUMBER');
  });
});
