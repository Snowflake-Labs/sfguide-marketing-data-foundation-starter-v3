import Container from "@mui/material/Container/Container";
import Stack from "@mui/material/Stack/Stack";
import AddAssistantButton from "components/AddAssistant/AddAssistantButton";
import { Subtitle2 } from "components/common/Text/TextComponents";
import { useAIAssistantContext } from "contexts/AIAssistantContext/AIAssistantContext";
import styles from './AssistantSideBar.module.scss';
import ExistingAssistant from "./ExistingAssistant";
import { useTheme } from "@mui/material";

export default function AssistantSideBar() {

    const { setAddAssistant, assistants } = useAIAssistantContext();
    const theme = useTheme();
    function newAssistant(){
        setAddAssistant(true);
    }

    return (
        <Stack direction="column" className={styles.sideBar}>
            <Container className={styles.container}>
                <AddAssistantButton onClick={newAssistant}></AddAssistantButton>
            </Container>
            <Container className={styles.spacing}>
                <Subtitle2 color={theme.palette.text.disabled}>Recent assistants</Subtitle2>
                <div className={styles.assistants}>
                    {assistants.map((assistant) =>
                        <ExistingAssistant key={`${assistant.id} ${assistant.name}`} assistant={assistant}></ExistingAssistant>
                    )}
                </div>
            </Container>
        </Stack>
    );
}
