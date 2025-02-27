import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import styles from './CustomMarkdown.module.scss';
import { Box } from '@mui/material';

export interface ICustomMarkdownProps {
  children: string;
}

export default function CustomMarkdown({ children }: ICustomMarkdownProps) {
  return (
    <Box className={styles.custom_markdown_container}>
      <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    </Box>
  );
}
