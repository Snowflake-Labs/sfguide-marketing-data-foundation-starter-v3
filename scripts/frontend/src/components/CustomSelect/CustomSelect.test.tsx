import { render, screen, fireEvent } from '@testing-library/react';
import CustomSelect, { ICustomSelectProps } from './CustomSelect';

const menuItems = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

const renderComponent = (props: Partial<ICustomSelectProps> = {}) => {
  const defaultProps: ICustomSelectProps = {
    menuItems,
    label: 'Test Label',
    value: '',
    onChange: jest.fn(),
    ...props,
  };
  return render(<CustomSelect {...defaultProps} />);
};

describe('CustomSelect Component', () => {
  test('renders the select component with the provided label', () => {
    const { getByLabelText } = renderComponent();
    expect(getByLabelText('Test Label')).toBeInTheDocument();
  });

  test('renders the correct number of menu items', () => {
    const { getAllByRole, getByLabelText } = renderComponent();
    fireEvent.mouseDown(getByLabelText('Test Label'));
    const options = getAllByRole('option');
    expect(options).toHaveLength(menuItems.length);
  });

  test('calls onChange handler when an option is selected', () => {
    const handleChange = jest.fn();
    const { getByLabelText, getByText } = renderComponent({ onChange: handleChange });
    fireEvent.mouseDown(getByLabelText('Test Label'));
    fireEvent.click(getByText('Option 1'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('displays the correct value when an option is selected', () => {
    const { rerender, getByText } = renderComponent({ value: '1' });
    expect(getByText('Option 1')).toBeInTheDocument();

    rerender(<CustomSelect menuItems={menuItems} label="Test Label" value="2" onChange={jest.fn()} />);
    expect(getByText('Option 2')).toBeInTheDocument();
  });
});
