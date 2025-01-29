import { Box } from '@mui/material';
import { Handle, NodeProps, Position } from 'reactflow';
import styles from './FormulaNode.module.scss';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { styles as colors } from 'styles/styles';

interface IFormulaNodeProps {
  id: string;
}

const fxmarkdown = `$fx$`;

const handlerStyle = {
  background: colors.diagram.edge.mapping.primary,
  border: `1px solid ${colors.diagram.edge.mapping.primary}`,
};
const hiddenHandlerStyle = { background: 'transparent', border: 'transparent' };

export default function FormulaNode({ id }: NodeProps<IFormulaNodeProps>) {
  return (
    <Box className={styles.container}>
      <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {fxmarkdown}
      </Markdown>
      <Handle
        id={`${id}-target.handler`}
        style={hiddenHandlerStyle}
        type="target"
        position={Position.Left}
        isConnectable={false}
      />
      <Handle
        id={`${id}-source.handler`}
        style={handlerStyle}
        type="source"
        position={Position.Right}
        isConnectable={false}
      />
    </Box>
  );
}
