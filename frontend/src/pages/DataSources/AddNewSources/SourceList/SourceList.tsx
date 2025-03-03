import ListWithSection from 'components/ListWithSection/ListWithSection';
import sourceCardModels from './sourceCardModels.json';
import { useEffect } from 'react';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';

export interface ISourceListProps {}

export default function SourceList(props: ISourceListProps) {
  const { setSteps } = useStepsContext();
  useEffect(() => {
    setSteps(0, 0);
  }, []);
  return <ListWithSection sectionSource={sourceCardModels} />;
}
