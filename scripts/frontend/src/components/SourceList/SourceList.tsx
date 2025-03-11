import ListWithSection from 'components/ListWithSection/ListWithSection';
import sourceCardModels from '../../data/sourceCardModels.json';

export interface ISourceListProps {}

export default function SourceList(props: ISourceListProps) {
  return <ListWithSection sectionSource={sourceCardModels} />;
}
