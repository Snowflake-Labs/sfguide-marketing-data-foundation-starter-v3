import styles from './ConnectorColumn.module.scss'
import { Body2 } from 'components/common/Text/TextComponents';
import Image from 'components/common/Image/Image';

interface Props {
  connector_name: string;
}

export default function ConnectorColumn(props: Props) {
  return (
    <div className={styles.connector_cell}>
      <Image image_name={props.connector_name.toLowerCase()} image_height={24} image_width={24}></Image>
      <Body2>{props.connector_name}</Body2>
    </div>
  );
}
