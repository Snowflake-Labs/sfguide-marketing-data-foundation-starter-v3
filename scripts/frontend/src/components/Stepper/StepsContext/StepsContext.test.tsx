import { StepsContextWrapper, useStepsContext } from "./StepsContext";
import { waitFor, screen } from "@testing-library/react";
import { renderWithContext } from "JestTest/utils";
import { getAddNewSourceStepsPath } from "pages/DataSources/AddNewSources/AddNewSourceStepsPath";
import { useEffect } from "react";

describe('StepsContext', () => {

  const steps = getAddNewSourceStepsPath(String);

  it('SetStepsTest', async () => {
    renderWithContext(
      <StepsContextWrapper stepsPath={steps}>
        <MockSet/>
      </StepsContextWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('stepValue').textContent).toBe('2');
      expect(screen.getByTestId('subStepValue').textContent).toBe('3');
    });
  });

  it('NextStepsTest', async () => {
    renderWithContext(
      <StepsContextWrapper stepsPath={steps}>
        <MockNextActions/>
      </StepsContextWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('stepValue').textContent).toBe('1');
      expect(screen.getByTestId('subStepValue').textContent).toBe('1');
    });
  });

  it('PreviousStepsTest', async () => {
    renderWithContext(
      <StepsContextWrapper stepsPath={steps}>
        <MockPreviousActions/>
      </StepsContextWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('stepValue').textContent).toBe('0');
      expect(screen.getByTestId('subStepValue').textContent).toBe('0');
    });
  });
});

const MockSet = () => {
  const { activeStep, activeSubStep, setSteps } = useStepsContext();
  useEffect(() => {
    setSteps(2, 3);
  }, []);
  return (
    <>
      <p data-testid='stepValue'>{activeStep}</p>
      <p data-testid='subStepValue'>{activeSubStep}</p>
    </>
  );
};

const MockNextActions = () => {
  const { activeStep, activeSubStep, nextStep, nextSubStep } = useStepsContext();
  useEffect(() => {
    nextStep();
    nextSubStep();
  }, []);
  return (
    <>
      <p data-testid='stepValue'>{String(activeStep)}</p>
      <p data-testid='subStepValue'>{String(activeSubStep)}</p>
    </>
  );
};

const MockPreviousActions = () => {
  const { activeStep, activeSubStep, previousStep, previousSubStep, setSteps } = useStepsContext();
  useEffect(() => {
    const executeSteps = async () => {
      await setSteps(1, 1);
      previousStep();
      previousSubStep();
    };
    executeSteps();
  }, []);

  return (
    <>
      <p data-testid='stepValue'>{String(activeStep)}</p>
      <p data-testid='subStepValue'>{String(activeSubStep)}</p>
    </>
  );
};