import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import Step from '../Step';

type StepsContext = {
  steps: Step[];
  activeStep: number;
  activeSubStep: number;
  nextStep: () => void;
  nextSubStep: () => void;
  previousStep: () => void;
  previousSubStep: () => void;
  resetContext: () => void;
  setSteps: (step: number, subStep: number) => void;
};

const defaultContext: StepsContext = {
  steps: [],
  activeStep: 0,
  activeSubStep: 0,
  nextStep: () => {},
  nextSubStep: () => {},
  previousStep: () => {},
  previousSubStep: () => {},
  resetContext: () => {},
  setSteps: (step: number, subStep: number) => {},
};

const StepsContext = createContext<StepsContext>(defaultContext);

interface Props {
  children: ReactNode;
  stepsPath: Step[];
}

export function StepsContextWrapper({ children, stepsPath }: Props) {
  const [steps] = useState(stepsPath);
  const [activeStep, setActiveStep] = useState(defaultContext.activeStep);
  const [activeSubStep, setActiveSubStep] = useState(defaultContext.activeSubStep);

  const nextStep = () => {
    setActiveStep(Math.min(steps.length - 1, activeStep + 1));
    setActiveSubStep(0);
  };

  const nextSubStep = () => {
    const subStepsCount: number = steps[activeStep].subSteps?.length ?? 0;
    setActiveSubStep(Math.min(subStepsCount - 1, activeSubStep + 1));
  };

  const previousStep = () => {
    const prevStep = Math.max(0, activeStep - 1);
    const subStepsCount: number = steps[prevStep].subSteps?.length ?? 0;
    setActiveStep(prevStep);
    setActiveSubStep(subStepsCount - 1);
  };

  const setSteps = (step: number, subStep: number) => {
    setActiveStep(step);
    setActiveSubStep(subStep);
  };

  const previousSubStep = () => setActiveSubStep(Math.max(0, activeSubStep - 1));

  const resetContext = () => {
    setActiveStep(defaultContext.activeStep);
    setActiveSubStep(defaultContext.activeSubStep);
  };

  const sharedState: StepsContext = useMemo(
    () => ({
      steps,
      activeStep,
      activeSubStep,
      nextStep,
      nextSubStep,
      previousStep,
      previousSubStep,
      resetContext,
      setSteps,
    }),
    [steps, activeStep, activeSubStep]
  );

  return <StepsContext.Provider value={sharedState}>{children}</StepsContext.Provider>;
}

export function useStepsContext() {
  return useContext(StepsContext);
}
