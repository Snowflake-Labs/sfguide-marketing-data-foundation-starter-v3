import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import styles from './MappingTypeSelector.module.scss';
import { useTranslation } from 'locales/i18n';
import { MappingType } from 'dtos/ModelUI';
import Box from '@mui/material/Box';

interface Props {
  defaultValue?: MappingType;
  onselect: (e: MappingType) => void;
}

export default function MappingTypeSelector(props: Props) {
  const { t } = useTranslation('common');
  const [value, setValue] = React.useState<MappingType>(props.defaultValue ?? MappingType.Column);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let result = (event.target as HTMLInputElement).value as MappingType;
    setValue(result);
    props.onselect(result);
  };
  return (
    <>
      <Box className={styles.container}>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            defaultValue={MappingType.Column}
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value={MappingType.Column}
              control={<Radio />}
              label={
                <div className={styles.mapping}>
                  <span>{t('ColumnValue')}</span>
                </div>
              }
            />

            <FormControlLabel
              value={MappingType.Static}
              control={<Radio />}
              label={
                <div className={styles.mapping}>
                  <span>{t('StaticValue')}</span>
                </div>
              }
            />

            <FormControlLabel
              value={MappingType.Variable}
              control={<Radio />}
              label={
                <div className={styles.mapping}>
                  <span>{t('VariableValue')}</span>
                </div>
              }
            />

            <FormControlLabel
              value={MappingType.Formula}
              control={<Radio />}
              label={
                <div className={styles.mapping}>
                  <span>{t('Formula')}</span>
                </div>
              }
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </>
  );
}
