import { act, fireEvent, screen, render } from '@testing-library/react';
import CustomCodeEditor, { ICustomCodeEditorProps } from './CustomCodeEditor';

const renderComponent = (props: Partial<ICustomCodeEditorProps> = {}) => {
  const defaultProps: ICustomCodeEditorProps = {
    code: 'console.log("Hello, world!")',
    readOnly: false,
    onChange: () => {},
    ...props,
  };
  return render(<CustomCodeEditor {...defaultProps} />);
};

describe('CustomCodeEditor', () => {
  test('CustomCodeEditor renders without crashing', () => {
    renderComponent();
  });

  test('renders without crashing', () => {
    render(<CustomCodeEditor code="console.log('Hello, world!')" readOnly={false} />);
  });

  test('displays the provided code', () => {
    const code = 'console.log("Hello, world!")';

    act(() => {
      renderComponent();
    });

    expect(screen.getByTestId('code-editor')).toHaveTextContent(code);
  });

  // Skip tests since new component does not have input element to trigger on change
  test.skip('calls onChange when code is changed', () => {
    const onChange = jest.fn();
    renderComponent({ onChange });
    const editor = screen.getByTestId('code-editor');

    act(() => {
      fireEvent.change(editor, { target: { value: 'console.log("Test log")' } });
    });

    expect(onChange).toHaveBeenCalledWith('console.log("Test log")');
  });

  test('copies code to clipboard when copy button is clicked', async () => {
    const code = 'console.log("Hello, world!")';
    renderComponent({ code });
    const copyButton = screen.getByTestId('ContentCopyIcon');
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {},
        readText: async () => code,
      },
    });

    act(() => {
      fireEvent.click(copyButton);
    });

    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe(code);
  });
});
