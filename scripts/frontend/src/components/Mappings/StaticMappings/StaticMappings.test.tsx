import { act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import StaticMappings from './StaticMappings';
import { ColumnType } from 'dtos/ModelUI';

jest.mock('locales/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('StaticMappings', () => {
  test('renders without error', () => {
    const { getByTestId } = render(<StaticMappings onSelectSource={() => {}} />);
    expect(getByTestId('static-mappings')).toBeInTheDocument();
  });

  it('calls onSelectSource when BOOLEAN is selected', () => {
    // arrange
    const onSelectSourceMock = jest.fn();
    const { getByText } = render(<StaticMappings onSelectSource={onSelectSourceMock} />);
    const expected = { transformation: 'true', columnType: ColumnType.BOOLEAN, columns: [{columnName: "NULL", object: ""}] };

    // act
    act(() => {
      fireEvent.click(getByText('BOOLEAN'));
    });

    // assert
    expect(onSelectSourceMock).toHaveBeenCalledWith(expected);
  });

  it('calls onSelectSource when NULL is selected', () => {
    // arrange
    const onSelectSourceMock = jest.fn();
    const { getByTestId } = render(<StaticMappings onSelectSource={onSelectSourceMock} />);
    const expected = { transformation: 'NULL', columns: [{columnName: "NULL", object: ""}] };

    // act
    act(() => {
      fireEvent.click(getByTestId('null-radio'));
    });

    // assert
    expect(onSelectSourceMock).toHaveBeenCalledWith(expected);
  });
});
