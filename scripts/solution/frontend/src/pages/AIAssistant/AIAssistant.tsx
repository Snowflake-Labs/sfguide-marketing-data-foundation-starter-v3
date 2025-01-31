import { Stack } from '@mui/material';
import ChatSection from './ChatSection/ChatSection';
import { AIAssistantContextWrapper } from 'contexts/AIAssistantContext/AIAssistantContext';

export default function AIAssistant() {
    return (
    <AIAssistantContextWrapper>
        <Stack direction="column">
            <ChatSection/>
        </Stack>
    </AIAssistantContextWrapper>
    )
}
