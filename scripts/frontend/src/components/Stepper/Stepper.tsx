import { Box, Stepper as MuiStepper, Step as MuiStep, StepLabel } from '@mui/material';
import { Subtitle1 } from 'components/common/Text/TextComponents';
import SubSteps from './SubSteps';
import styles from './Stepper.module.scss';
import { useStepsContext } from './StepsContext/StepsContext';
import Step from './Step';

interface Props {}

export default function Stepper(props: Props) {
  const { steps, activeStep, activeSubStep } = useStepsContext();

  const isSubStepsVisible = (step: Step, index: number): boolean => {
    return activeStep == index && Array.isArray(step.subSteps);
  };

  return (
    <Box className={styles.container}>
      <MuiStepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <MuiStep key={index} className={styles.step}>
            <StepLabel>
              <Subtitle1>{step.name}</Subtitle1>
            </StepLabel>
            {isSubStepsVisible(step, index) && (
              <SubSteps steps={step.subSteps} index={index} activeSubStep={activeSubStep} />
            )}
          </MuiStep>
        ))}
      </MuiStepper>
    </Box>
  );
}
