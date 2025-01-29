import { render, screen } from '@testing-library/react';
import FormulaNode from './FormulaNode';
import { ReactFlowProvider } from 'reactflow';

const renderComponent = () => {
  render(
    <ReactFlowProvider>
      <FormulaNode
        id="test-id"
        type="formula"
        data={{ id: 'test-id' }}
        dragHandle={''}
        selected={false}
        zIndex={0}
        isConnectable={false}
        xPos={0}
        yPos={0}
        dragging={false}
      />
    </ReactFlowProvider>
  );
};

describe('FormulaNode', () => {
  test('renders the formula markdown', () => {
    renderComponent();

    const formulaMarkdown = screen.getByText('$fx$');

    expect(formulaMarkdown).toBeInTheDocument();
  });

  test('renders the source handle', () => {
    renderComponent();

    const Node = screen.getByText('$fx$');
    const targeteHandler = Node.querySelector('div.react-flow__handle-left');

    expect(targeteHandler).toBeInTheDocument();
    expect(targeteHandler).toHaveStyle({
      background: 'transparent',
      border: 'transparent',
    });
  });

  test('renders the target handle', () => {
    renderComponent();

    const Node = screen.getByText('$fx$');
    const sourceHandler = Node.querySelector('div.react-flow__handle-right');

    expect(sourceHandler).toBeInTheDocument();
    expect(sourceHandler).toHaveStyle({
      background: 'rgb(26, 108, 231)',
      border: '1px solid #1a6ce7',
    });
  });
});
