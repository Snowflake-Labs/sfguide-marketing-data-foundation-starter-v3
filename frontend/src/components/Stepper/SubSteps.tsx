import styles from './Stepper.module.scss';
import { Box, Breadcrumbs } from '@mui/material';
import { Subtitle2 } from 'components/common/Text/TextComponents';
import { ArrowForward } from '@mui/icons-material';
import Step from './Step';

interface Props {
  steps?: Step[];
  index: number;
  activeSubStep?: number;
}

export default function SubSteps({ steps, index, activeSubStep }: Props) {
  const divider = '-';

  return (
    <Box className={styles.subStepsContainer}>
      {divider}
      <Breadcrumbs className={styles.subSteps} separator={<ArrowForward fontSize="small" />}>
        {steps?.map((subStep, subIndex) => (
          <Subtitle2
            key={`st-${index}.${subIndex}`}
            color={activeSubStep == subIndex ? 'text.primary' : 'text.secondary'}
          >
            {index + 1}.{subIndex + 1} {activeSubStep == subIndex && subStep.name}
          </Subtitle2>
        ))}
      </Breadcrumbs>
    </Box>
  );
}
