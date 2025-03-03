import * as React from 'react';
import styles from './FormulaMappings.module.scss';
import Box from '@mui/material/Box';
import CustomCodeEditor from 'components/CustomCodeEditor/CustomCodeEditor';
import CustomTable from 'components/CustomTable/CustomTable';
import { ColumnTransformationMetadata } from 'components/Diagrams/Drawers/MappingsDrawer/ColumnTransformationMetadata';
import { Caption } from 'components/common/Text/TextComponents';
import { useState } from 'react';
import { IMappingService } from 'interfaces/IMappingService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { formulaCodeToProcessDefinition } from 'utils/MappingModel/ModelValidations';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { TableModel } from 'dtos/ModelUI';
import getColumnsUsedInFormula from 'components/Diagrams/Drawers/MappingsDrawer/Helpers';

export interface IFormulaMappingsProps extends React.HTMLAttributes<HTMLElement> {
  code: string;
  targetTable: TableModel;
  onCodeChange?: (columnMapping: ColumnTransformationMetadata) => void;
  onRun?: () => void;
  transformation?: ColumnTransformationMetadata;
}

export default function FormulaMappings({
  className,
  onCodeChange,
  code,
  targetTable,
  onRun,
  transformation,
  ...props
}: IFormulaMappingsProps) {
  const classes = `${styles.container} ${className}`;

  const { model } = useMappingContext();

  const [preview, setPreview] = useState<{ name: string }[]>();
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const mappingService = container.get<IMappingService>(TYPES.IMappingService);

  const handleOnChange = (value: string | undefined) => {
    const columnMapping: ColumnTransformationMetadata = { transformation: `${value}` };
    onCodeChange?.(columnMapping);
  };

  const handleSetPreview = (value: [string[]]) => {
    const result = value.map((row) => ({ name: row[0] }));
    setPreview(result);
  };

  const handleRun = () => {
    if (!transformation) return;
    setIsRunning(true);
    setErrorMessage(undefined);
    setPreview(undefined);
    const columnTransformation = getColumnsUsedInFormula(transformation.transformation, model);
    if (!columnTransformation) {
      setIsRunning(false);
      return;
    }
    const definition = formulaCodeToProcessDefinition(model, targetTable, columnTransformation);
    if (!definition) {
      setIsRunning(false);
      return;
    }
    mappingService
      .validateSql(definition)
      .then((result) => {
        handleSetPreview(result.data);
      })
      .catch((e: { message: string }) => setErrorMessage(e.message))
      .finally(() => setIsRunning(false));
    onRun?.();
  };

  return (
    <Box {...props} className={classes}>
      <Box className={styles.codeEditorContainer}>
        <CustomCodeEditor
          code={code}
          readOnly={false}
          isRunning={isRunning}
          onChange={handleOnChange}
          onRun={handleRun}
        />
      </Box>
      {errorMessage && <Caption color="error">{errorMessage}</Caption>}
      {preview && (
        <Box className={styles.tableContainer}>
          <CustomTable header="ResultsPreview" data={preview}></CustomTable>
        </Box>
      )}
    </Box>
  );
}
