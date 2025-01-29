import { render, fireEvent } from '@testing-library/react';
import CustomCard, { ICustomCardProps } from './CustomCard';
import styles from './CustomCard.module.scss';
import userEvent from '@testing-library/user-event';

const renderComponent = (props: ICustomCardProps) => render(<CustomCard {...props} />);

describe('CustomCard Component', () => {
  test('renders children', () => {
    const { getByText } = renderComponent({ children: <div>Child Content</div> });
    expect(getByText('Child Content')).toBeInTheDocument();
  });

  test('applies selected class', () => {
    const { getByText } = renderComponent({ selected: true, children: <div>Child Content</div> });
    expect(getByText('Child Content').parentElement).toHaveClass(styles.source_card_selected);
  });

  test('applies disabled class', () => {
    const { getByText } = renderComponent({ disabled: true, children: <div>Child Content</div> });
    expect(getByText('Child Content').parentElement).toHaveClass(styles.source_card_disabled);
  });

  test('applies default class', () => {
    const { getByText } = renderComponent({ children: <div>Child Content</div> });
    expect(getByText('Child Content').parentElement).toHaveClass(styles.source_card);
  });

  test('handles onClick event', () => {
    const handleClick = jest.fn();
    const { getByText } = renderComponent({ onClick: handleClick, children: <div>Child Content</div> });
    fireEvent.click(getByText('Child Content'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not handle onClick event when disabled', () => {
    const handleClick = jest.fn();
    const { getByText } = renderComponent({
      disabled: true,
      onClick: handleClick,
      children: <div>Child Content</div>,
    });
    userEvent.click(getByText('Child Content'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
