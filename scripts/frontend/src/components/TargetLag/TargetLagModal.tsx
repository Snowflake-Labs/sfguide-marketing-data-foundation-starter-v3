import { Body2, Subtitle1 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import styles from './TargetLagModal.module.scss';
import { Button } from 'components/common/Button/Button';
import ModalComponent from 'components/Modal/ModalComponent';
import { TableModel } from 'dtos/ModelUI';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { EventData } from 'dtos/EventData';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { editTableModelToModelUI } from 'utils/MappingModel/ModelUIHelpers';

interface SelectProps {
  label: string;
  options: string[];
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  selectedOption: string;
  className: string;
}

function OptionSelect(props: SelectProps) {
  const handleSetSelectedOption = (event: SelectChangeEvent) => {
    props.setSelectedOption(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }} className={props.className}>
      <FormControl fullWidth>
        <InputLabel id={`target-lag-select-id-${props.label}`}>{props.label}</InputLabel>
        <Select
          labelId={`target-lag-select-id-${props.label}`}
          id={`target-lag-select-${props.label}`}
          value={props.selectedOption ?? ''}
          label={props.label}
          onChange={handleSetSelectedOption}
        >
          {props.options.map((option) => (
            <MenuItem key={option} value={option} id={`target-lag-option-${props.label}-${option}`}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

interface Props {
  openModal: boolean;
  table: TableModel;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TargetLagModal(props: Props) {
  const { t } = useTranslation('common');
  const timeUnits = ['seconds', 'minutes', 'hours'];
  const numbers = Array.from({ length: 60 }, (_, i) => (i + 1).toString());
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);
  const { model } = useMappingContext();

  const handleSetTargetLag = () => {
    if (!selectedUnit || !selectedNumber) return;
    props.table.targetLag = { number: Number(selectedNumber), timeUnit: selectedUnit };
    pubSubService.emitEvent(EventData.Model.Save, editTableModelToModelUI(model, props.table, props.table));
    props.setOpen(false);
  };

  const handleCancel = () => {
    setSelectedUnit(props.table.targetLag?.timeUnit ?? '');
    setSelectedNumber(props.table.targetLag?.number?.toString() ?? '');
    props.setOpen(false);
  };

  useEffect(() => {
    setSelectedUnit(props.table?.targetLag?.timeUnit ?? '');
    setSelectedNumber(props.table?.targetLag?.number?.toString() ?? '');
  }, [props.table]);

  return (
    <ModalComponent open={props.openModal}>
      <Box className={styles.container}>
        <Subtitle1 className={styles.header}>{t('DefineTargetLag')} </Subtitle1>
        <Body2 className={styles.textBody}>{`${t('TargetTable')}: ${props.table?.tableName ?? ''}`}</Body2>
        <Box className={styles.selectContainer}>
          <OptionSelect
            className={styles.selectNumber}
            label={t('Number')}
            options={numbers}
            setSelectedOption={setSelectedNumber}
            selectedOption={selectedNumber}
          />
          <OptionSelect
            className={styles.selectUnit}
            label={t('TimeUnit')}
            options={timeUnits}
            setSelectedOption={setSelectedUnit}
            selectedOption={selectedUnit}
          />
        </Box>
        <Box className={styles.actionsContainer}>
          <Button className={styles.cancelButton} onClick={handleCancel}>
            {t('BtnCancel')}
          </Button>
          <Button
            className={styles.saveButton}
            onClick={handleSetTargetLag}
            disabled={!selectedUnit || !selectedNumber}
          >
            {t('BtnSave')}
          </Button>
        </Box>
      </Box>
    </ModalComponent>
  );
}