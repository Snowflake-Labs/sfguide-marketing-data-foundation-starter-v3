import styles from './AssistantCard.module.scss'
import { Body2, Subtitle1 } from 'components/common/Text/TextComponents';
import Image from 'components/common/Image/Image';
import { MouseEventHandler } from 'react';
import { useAIAssistantContext } from 'contexts/AIAssistantContext/AIAssistantContext';

interface Props {
  imageName: string;
  title: string;
  body: string;
}

export default function AssistantCard( props: Props ) {

  const { addNewAssistant } = useAIAssistantContext();

  const handleClick = () => {
    addNewAssistant({ TYPE: props.imageName as ("CortexCopilot" | "DataEngineering"), NAME:  `${props.imageName}-${Date.now()}` });
  };

  return (
    <div className={styles.container} onClick={handleClick}>
        <div className={styles.title}>
            <Image image_name={props.imageName.toLowerCase()} image_height={32} image_width={32}></Image>
            <Subtitle1>{props.title}</Subtitle1>
        </div>
        <Body2 color='secondary'>{props.body}</Body2>
    </div>
  );
}
