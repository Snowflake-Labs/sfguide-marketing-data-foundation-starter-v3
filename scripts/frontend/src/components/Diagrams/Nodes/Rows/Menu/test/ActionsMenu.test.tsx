import { render, screen, fireEvent } from '@testing-library/react';
import ActionsMenu from '../ActionsMenu';

describe('ActionsMenu', () => {
  it('should render without errors', () => {
    render(<ActionsMenu open={true} />);
    const menuElement = screen.getByRole('menu');
    expect(menuElement).toBeInTheDocument();
  });

  it('should call onClickDelete when delete button is clicked', () => {
    const onClickDelete = jest.fn();
    const { getByTestId } = render(<ActionsMenu onClickDelete={onClickDelete} open={true} />);
    const deleteButton = getByTestId('delete-button');

    fireEvent.click(deleteButton);

    expect(onClickDelete).toHaveBeenCalled();
  });

  it('should call onClickChangeType when change type button is clicked', () => {
    const onClickChangeType = jest.fn();
    const { getByTestId } = render(<ActionsMenu onClickChangeType={onClickChangeType} open={true} />);
    const changeTypeButton = getByTestId('change-type-button');

    fireEvent.click(changeTypeButton);

    expect(onClickChangeType).toHaveBeenCalled();
  });
});
