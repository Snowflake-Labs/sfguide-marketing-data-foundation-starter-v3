import { Box } from '@mui/material';
import styles from './CustomCodeEditor.module.scss';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { PlayArrowOutlined } from '@mui/icons-material';
import Spinner from 'components/common/Spinner/Spinner';
import ReactCodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';

export interface ICustomCodeEditorProps {
  code: string;
  readOnly: boolean;
  isRunning?: boolean;
  onChange?: (value: string | undefined) => void;
  onRun?: () => void;
}

const extensions = [sql()];

export default function CustomCodeEditor({ code, onChange, readOnly, onRun, ...props }: ICustomCodeEditorProps) {
  const handleOnChange = (value: string) => {
    onChange?.(value);
  };

  return (
    <Box className={styles.codeContainer} data-testid="code-editor">
      <ReactCodeMirror
        className={styles.codeEditor}
        lang="sql"
        value={code}
        extensions={extensions}
        editable={!readOnly}
        onChange={handleOnChange}
        basicSetup={{ lineNumbers: false, foldGutter: false }}
      />
      <Box className={styles.buttons}>
        {onRun && (
          <Spinner loading={props.isRunning ?? false} size={20}>
            <Box onClick={onRun} data-testid="onRunContainer">
              <PlayArrowOutlined className={styles.icon} />
            </Box>
          </Spinner>
        )}
        <Box onClick={() => navigator.clipboard.writeText(code)}>
          <ContentCopyIcon className={styles.icon} />
        </Box>
      </Box>
    </Box>
  );
}
