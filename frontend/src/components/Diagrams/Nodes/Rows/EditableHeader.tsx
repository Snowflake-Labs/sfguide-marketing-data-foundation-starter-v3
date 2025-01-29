import { useState } from 'react';
import { TableModel } from 'dtos/ModelUI';
import { container } from 'ioc/inversify.config';
import { IPubSubService } from 'interfaces/IPubSubService';
import { TYPES } from 'ioc/types';
import { EventData } from 'dtos/EventData';
import getAliasFromTableName, {
  addNewTableToMappingModel,
  countTablesInModelUI,
  findTableObjectInModelUI,
  updateTableFromMappingModel,
} from 'utils/MappingModel/ModelUIHelpers';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';
import { useTranslation } from 'locales/i18n';
import InputNewColumnRow from './AddEditableRow/InputNewColumnRow';
import styles from './Rows.module.scss';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';

interface Props {
  table: TableModel;
  alias: string;
  setAlias: (alias: string) => void;
}

export default function EditableHeader(props: Props) {
  const NEW_TABLE = 'NEW_TABLE';
  const { t } = useTranslation('common');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tableName, setTableName] = useState(props.table.tableName);
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);
  const { model, targetDatabaseSchema } = useMappingContext();
  const { selectTargetObject } = useEditMappingContext();
  const [targetDatabase, targetSchema] = targetDatabaseSchema.split('.');
  const navigate = useNavigate();
  const location = useLocation();

  const saveTableName = (prevTable: TableModel) => {
    if (tableName == prevTable.tableName) return;
    setIsSaving(true);
    const object = `${targetDatabase}.${targetSchema}.${tableName}`;
    if (tableName === NEW_TABLE) {
      pubSubService.emitEvent(EventData.Notification.Show, { severity: 'error', message: t('TableNeedsName') });
      return;
    }
    if (findTableObjectInModelUI(object, model)) {
      pubSubService.emitEvent(EventData.Notification.Show, { severity: 'error', message: t('TableAlreadyExists') });
      return;
    }

    let updatedModel = updateTableFromMappingModel(model, prevTable.object, tableName, object, props.alias);
    if (location.pathname.includes(PathConstants.NEWTABLE)) {
      updatedModel = addNewTableToMappingModel(model, targetDatabase, targetSchema, tableName, object, props.alias);
      navigate('..', { state: { selectedTableName: object } });
    }

    pubSubService.emitEvent(EventData.Model.Save, updatedModel);
    pubSubService.subscribeToEvent(EventData.Model.AfterSave, 'editable-row', () => handleAfterSave(object));
  };

  const handleAfterSave = (object: string) => {
    pubSubService.unsubscribeFromEvent(EventData.Model.AfterSave, 'editable-row');
    selectTargetObject(object, '');
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleClick = () => {
    if (props.table.type != 'target') return;
    setIsEditing(true);
  };

  const handleChange = (newTableName: string) => {
    setTableName(newTableName);
    const index = countTablesInModelUI(model);
    props.setAlias(getAliasFromTableName(newTableName, index ? index + 1 : 1));
  };

  const handleOnExitEditMode = () => {
    setIsEditing(false);
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isEditing || !tableName) return;
    switch (event.key) {
      case 'Enter':
        saveTableName(props.table);
        break;
      case 'Escape':
        handleOnExitEditMode();
        break;
    }
  };

  const handleBlur = () => {
    if (!isEditing || !tableName) handleOnExitEditMode();
    else saveTableName(props.table);
  };

  return (
    <Box onClick={handleClick} className={`${styles.EditableHeader} ${isSaving ? styles.saving : ''}`}>
      {isEditing ? (
        <InputNewColumnRow
          columnName={props.table.tableName}
          onChange={handleChange}
          onKeyUp={handleOnKeyUp}
          onBlur={handleBlur}
        />
      ) : (
        !isSaving && <span className={styles.tableName}>{props.table.tableName}</span>
      )}
    </Box>
  );
}
