import Stepper from 'components/Stepper/Stepper';
import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';

export default function AddNewSource() {
  const { setSteps } = useStepsContext();
  useEffect(() => {
    setSteps(0, 0);
  }, []);
  return (
    <Stack direction="column" spacing={6} mt={3}>
      <Stepper />
      <Outlet />
    </Stack>
  );
}
