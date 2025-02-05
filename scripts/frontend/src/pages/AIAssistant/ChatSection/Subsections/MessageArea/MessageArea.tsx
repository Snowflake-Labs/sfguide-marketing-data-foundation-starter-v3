import { Stack } from '@mui/material';
import styles from './MessageArea.module.scss';
import ChatBar from 'components/ChatBar/ChatBar';
import Conversation from './Conversation';
import TitleActions from './TitleActions';

export default function MessageArea() {
    return (
        <Stack direction='column' className={styles.spacing}>
            <TitleActions></TitleActions>
            <Conversation></Conversation>
            <ChatBar/>
        </Stack>
    );
}
