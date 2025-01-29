import { Box } from '@mui/material';
import styles from './ModelsPage.module.scss';
import Stepper from 'components/Stepper/Stepper';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';
import { EditMappingContextWrapper } from 'contexts/MappingContext/EditMappingContext';
import { ProcessProgressContextWrapper } from 'contexts/MappingContext/ProcessProgressContext';
import { MappingContextWrapper } from 'contexts/MappingContext/MappingContext';
import { Outlet } from 'react-router-dom';

export default function ModelsPage() {
  const { steps } = useStepsContext();
  return (
    <MappingContextWrapper>
      <EditMappingContextWrapper>
        <ProcessProgressContextWrapper>
          <Box className={styles.container}>
            {steps.length > 0 && <Stepper />}
            <Outlet />
          </Box>
        </ProcessProgressContextWrapper>
      </EditMappingContextWrapper>
    </MappingContextWrapper>
  );
}
