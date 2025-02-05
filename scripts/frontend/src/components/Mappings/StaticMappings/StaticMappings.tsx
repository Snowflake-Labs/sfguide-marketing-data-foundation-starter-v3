import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import styles from './StaticMappings.module.scss';
import { useTranslation } from 'locales/i18n';
import ColumnTypeIcon from 'components/ColumnTypeIcon/ColumnTypeIcon';
import { ColumnType } from 'dtos/ModelUI';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import { NullType } from 'dtos/NullType';
import { ColumnTransformationMetadata } from 'components/Diagrams/Drawers/MappingsDrawer/ColumnTransformationMetadata';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';

interface Props {
  onSelectSource: (columnMapping: ColumnTransformationMetadata) => void;
}

export default function StaticMappings({ onSelectSource }: Props) {
  const { t } = useTranslation('common');
  const { sourceDatabaseSchema } = useMappingContext();

  const [type, setType] = useState<ColumnType>(ColumnType.VARCHAR);
  const [bool, setBool] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType((event.target as HTMLInputElement).value as ColumnType);
  };

  function handleSetSource(event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!event) return;
    const value = type == ColumnType.VARCHAR ? `'${event?.target.value}'` : event?.target.value;
    const columnMapping: ColumnTransformationMetadata = {
      transformation: value,
      displayValue: event.target.value,
      columnType: type,
      columns: [{ columnName: NullType, object: sourceDatabaseSchema }],
    };
    onSelectSource(columnMapping);
  }

  function handleSetSourceBoolean(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const columnMapping: ColumnTransformationMetadata = { 
      transformation: checked.toString(), 
      columnType: type,
      columns: [{ columnName: NullType, object: sourceDatabaseSchema }], };
    setBool(checked);
    onSelectSource(columnMapping);
  }

  function handletSetSourceDate(value: Dayjs | null) {
    if (!value) return;
    const valueString = value.toJSON().toString();
    const columnMapping: ColumnTransformationMetadata = {
      transformation: `TO_TIMESTAMP_NTZ('${valueString}')`,
      displayValue: valueString,
      columnType: type,
      columns: [{ columnName: NullType, object: sourceDatabaseSchema }],
    };
    onSelectSource(columnMapping);
  }
  return (
    <>
      <Box className={styles.container} data-testid="static-mappings">
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            defaultValue={ColumnType.VARCHAR}
            value={type}
            onChange={handleChange}
          >
            <FormControlLabel
              data-testid="varchar-radio"
              value={ColumnType.VARCHAR}
              control={<Radio />}
              label={
                <div className={`${styles.mapping}  ${styles.varchar}`}>
                  <ColumnTypeIcon type={ColumnType.VARCHAR} />
                  <span>{t('VARCHAR')}</span>
                </div>
              }
            />
            <FormControlLabel
              data-testid="number-radio"
              value={ColumnType.NUMBER}
              control={<Radio />}
              label={
                <div className={`${styles.mapping}  ${styles.number}`}>
                  <ColumnTypeIcon type={ColumnType.NUMBER} />
                  <span>{t('NUMBER')}</span>
                </div>
              }
            />
            <FormControlLabel
              date-testid="boolean-radio"
              value={ColumnType.BOOLEAN}
              control={<Radio />}
              label={
                <div className={`${styles.mapping}  ${styles.boolean}`}>
                  <ColumnTypeIcon type={ColumnType.BOOLEAN} />
                  <span>{t('BOOLEAN')}</span>
                </div>
              }
              onClick={() => onSelectSource({ transformation: bool.toString(), columnType: ColumnType.BOOLEAN, columns: [{ columnName: NullType, object: sourceDatabaseSchema }] })}
            />
            <FormControlLabel
              data-testid="null-radio"
              value={ColumnType.NULL}
              control={<Radio />}
              label={
                <div className={`${styles.mapping}  ${styles.null}`}>
                  <ColumnTypeIcon type={ColumnType.NULL} />
                  <span>{t('NULL')}</span>
                </div>
              }
              onClick={() => onSelectSource({ transformation: NullType, columns: [{ columnName: NullType, object: sourceDatabaseSchema }] })}
            />
            <FormControlLabel
              data-testid="variant-radio"
              value={ColumnType.VARIANT}
              control={<Radio />}
              label={
                <div className={`${styles.mapping}  ${styles.variant}`}>
                  <ColumnTypeIcon type={ColumnType.VARIANT} />
                  <span>{t('VARIANT')}</span>
                </div>
              }
            />
            <FormControlLabel
              data-testid="date-radio"
              value={ColumnType.DATE}
              control={<Radio />}
              label={
                <div className={`${styles.mapping}  ${styles.date}`}>
                  <ColumnTypeIcon type={ColumnType.DATE} />
                  <span>{t('DATE')}</span>
                </div>
              }
            />
          </RadioGroup>
        </FormControl>
        {type == ColumnType.VARCHAR && (
          <TextField
            id="outlined-basic"
            data-testid="value-input-field"
            label={t('EnterValue')}
            variant="outlined"
            onChange={handleSetSource}
          />
        )}
        {type == ColumnType.BOOLEAN && (
          <>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>False</Typography>
              <Switch
                defaultChecked
                inputProps={{ 'aria-label': 'ant design' }}
                onChange={handleSetSourceBoolean}
                checked={bool}
              />
              <Typography>True</Typography>
            </Stack>
          </>
        )}
        {type == ColumnType.NUMBER && (
          <TextField
            id="number-input"
            data-testid="value-input-field"
            label={t('EnterValue')}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleSetSource}
          />
        )}
        {type == ColumnType.VARIANT && (
          <Input
            id="variant-input"
            data-testid="value-input-field"
            minRows="4"
            className={styles.variantInput}
            aria-label="variant-input"
            multiline
            placeholder={t('EnterValue')}
            onChange={handleSetSource}
          />
        )}
        {type == ColumnType.DATE && <DateTimePicker onAccept={handletSetSourceDate} />}
      </Box>
    </>
  );
}
