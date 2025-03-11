import { Stack } from '@mui/material';
import Stepper from 'components/Stepper/Stepper';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function DataExplorerPage() {
  const { setSteps } = useStepsContext();

  useEffect(() => {
    setSteps(2, 0);
  }, []);

  return (
    <Stack direction="column" spacing={6} mt={3}>
      <Stepper />
      <Outlet />
    </Stack>
  );
}
