import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import styles from './VariableMappings.module.scss';
import ColumnTypeIcon from 'components/ColumnTypeIcon/ColumnTypeIcon';
import { ColumnType, VariableMappingType } from 'dtos/ModelUI';
import Box from '@mui/material/Box';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { ColumnTransformationMetadata } from 'components/Diagrams/Drawers/MappingsDrawer/ColumnTransformationMetadata';
import { NullType } from 'dtos/NullType';

interface Props {
  onSelectSource: (columnMapping: ColumnTransformationMetadata) => void;
}

export default function VariableMappings({ onSelectSource }: Props) {
  const { model, sourceDatabaseSchema } = useMappingContext();

  const [value, setValue] = React.useState<VariableMappingType>(VariableMappingType.ModelId);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as VariableMappingType;
    setValue(value);

    let columnMapping: ColumnTransformationMetadata | null = null;
    if (value == VariableMappingType.CurrentTimestamp) {
      const currentTimestamp = new Date().toJSON();
      columnMapping = {
        transformation: `TO_TIMESTAMP_NTZ('${currentTimestamp}')`,
        displayValue: currentTimestamp,
        columnType: ColumnType.DATE,
      };
    } else if (value == VariableMappingType.ModelId) {
      columnMapping = { transformation: `'${model.id}'`, displayValue: model.id, columnType: ColumnType.VARCHAR };
    } else if (value == VariableMappingType.ModelName) {
      columnMapping = { transformation: `'${model.name}'`, displayValue: model.name, columnType: ColumnType.VARCHAR };
    }
    if (columnMapping) {
      columnMapping.columns = [{ columnName: NullType, object: sourceDatabaseSchema }];
      onSelectSource(columnMapping);
    }
  };

  return (
    <>
      <Box className={styles.container} data-testid="variable-mappings">
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            defaultValue={VariableMappingType.ModelId}
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value={VariableMappingType.ModelId}
              control={<Radio />}
              label={
                <div className={styles.mapping}>
                  <ColumnTypeIcon type={ColumnType.VARCHAR} />
                  <span>{VariableMappingType.ModelId}</span>
                </div>
              }
            />

            <FormControlLabel
              value={VariableMappingType.ModelName}
              control={<Radio />}
              label={
                <div className={styles.mapping}>
                  <ColumnTypeIcon type={ColumnType.VARCHAR} />
                  <span>{VariableMappingType.ModelName}</span>
                </div>
              }
            />

            <FormControlLabel
              value={VariableMappingType.CurrentTimestamp}
              control={<Radio />}
              label={
                <div className={styles.mapping}>
                  <ColumnTypeIcon type={ColumnType.DATE} />
                  <span>{VariableMappingType.CurrentTimestamp}</span>
                </div>
              }
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </>
  );
}
