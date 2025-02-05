import Checkbox from '@mui/material/Checkbox/Checkbox';
import styles from './SourceColumn.module.scss';
import Image from 'components/common/Image/Image';
import { Body2 } from 'components/common/Text/TextComponents';
import { useExistingSourcesContext } from '../../../../../contexts/ExistingSourcesContext/ExistingSourcesContext';
import Source from 'dtos/Source';

interface ISourceColumnProps {
  source: Source;
  provider_name: string;
}

export default function SourceColumn({ source, provider_name }: ISourceColumnProps) {
  const { check, rowsToDelete } = useExistingSourcesContext();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    check(source, event.target.checked);
  };
  return (
    <div className={styles.source_cell}>
      <Checkbox onChange={onChange} className={styles.checkbox} />
      <Image image_name={provider_name.toLowerCase()} image_height={24} image_width={24}></Image>
      <Body2>{provider_name}</Body2>
    </div>
  );
}
