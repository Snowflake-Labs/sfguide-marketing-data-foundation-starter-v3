import Step from '../../../components/Stepper/Step';

export function getAddNewSourceStepsPath(t: (_: string) => string): Step[] {
  return [
    {
      name: t('StepperLinkDataInSnowflake'),
      subSteps: [
        { name: t('StepperSelectedSource') },
        { name: t('StepperLinkYourData') },
        { name: t('StepperSelectConnector') },
        { name: t('StepperConnectorSetup') },
        { name: t('StepperLinkDataAlreadyInSnowflake') },
      ],
    },
    {
      name: t('StepperCustomizeMappings'),
      subSteps: [
        { name: t('StepperSelectTargetModel') }, 
        { name: t('StepperCustomizeTransformations') },
        { name: t('StepperTargetTablesCreated') },
      ],
    },
    { name: t('StepperDataExplorer') },
  ];
}
