import { Stack } from '@mui/material';
import MessageArea from './Subsections/MessageArea/MessageArea';
import AddAssistant from './Subsections/AddAssistant/AddAssistant';
import DefaultAssistantMessage from './Subsections/DefaultMessage/DefaultAssistantMessage';
import { useAIAssistantContext } from 'contexts/AIAssistantContext/AIAssistantContext';
import AssistantSideBar from '../SideBar/AssistantSideBar';
import Loading from 'components/common/Spinner/Loading';

export default function ChatSection() {
    const { addAssistant, assistants, assistantLoading } = useAIAssistantContext();

    return (
        <Stack direction="row">
            <AssistantSideBar />
            { 
                assistantLoading ?  <Loading label={assistantLoading} />
                : addAssistant ? <AddAssistant /> 
                : assistants.length > 0 ? <MessageArea /> 
                : <DefaultAssistantMessage />
            }
        </Stack>
    );
}
