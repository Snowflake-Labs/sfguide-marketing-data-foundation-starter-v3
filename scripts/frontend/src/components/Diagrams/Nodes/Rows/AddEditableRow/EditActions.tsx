import styles from '../Rows.module.scss';
import { useState } from 'react';
import { ColumnModel, ColumnType } from 'dtos/ModelUI';
import InputNewColumnRow from './InputNewColumnRow';
import { container } from 'ioc/inversify.config';
import { IPubSubService } from 'interfaces/IPubSubService';
import { TYPES } from 'ioc/types';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { AddColumnModelInModelUI, UpdateColumnModelInModelUI } from 'utils/MappingModel/ModelUIHelpers';
import { RowProps } from '../Row';
import { Box } from '@mui/material';
import { EventData } from 'dtos/EventData';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';
import ActionsMenu from '../Menu/ActionsMenu';
import TypesMenu from '../Menu/TypesMenu';
import { DeleteColumnModal } from 'components/Diagrams/Modals/DeleteColumnModal/DeleteColumnModal';

interface Props extends RowProps {
  isNewColumn?: boolean;
  onExitEditMode?: () => void;
}

export default function EditActions({ column, table, ...props }: Props) {
  const [openTypesMenu, setOpenTypesMenu] = useState(false);
  const [openActionsMenu, setOpenActionsMenu] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [newColumn, setNewColumn] = useState(column);
  const [openDeleteColumnModal, setOpenDeleteColumnModal] = useState(false);

  const { model } = useMappingContext();
  const { setColumnToEdit, addColumnDefault } = useEditMappingContext();

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const editId = `${column.object}.${column.columnName}-edit`;

  const handleSaveChanges = (newColumn: ColumnModel) => {
    setIsSaving(true);
    const updatedModel =
      column == addColumnDefault
        ? AddColumnModelInModelUI(newColumn, model)
        : UpdateColumnModelInModelUI(column, newColumn, model);
    pubSubService.emitEvent(EventData.Model.Save, updatedModel);
    pubSubService.subscribeToEvent(EventData.Model.AfterSave, editId, handleAfterSave);
  };

  const handleAfterSave = () => {
    pubSubService.unsubscribeFromEvent(EventData.Model.AfterSave, editId);
    setIsSaving(false);
    handleOnExitEditMode();
  };

  const handleOnTypeChange = (type: ColumnType) => {
    setNewColumn((prev) => {
      const newCol = { ...prev, object: table.object, type: type, sqlType: type };
      const isDuplicatedColumn = table.columns.find(
        (col) => col.columnName != column.columnName && col.columnName === newColumn.columnName
      );
      if (!props.isNewColumn && !isDuplicatedColumn) handleSaveChanges(newCol);
      return newCol;
    });
  };

  const handleOnColumnNameChange = (newColumnName: string) => {
    setNewColumn((prev) => ({ ...prev, columnName: newColumnName }));
  };

  const handleOnCommitChanges = () => {
    const isDuplicatedColumn = table.columns.find(
      (col) => col.columnName != column.columnName && col.columnName === newColumn.columnName
    );
    const isValidColumn = newColumn.columnName && !isDuplicatedColumn;
    const isChanged = column.columnName != newColumn.columnName || column.type != newColumn.type;
    if (isValidColumn && isChanged) handleSaveChanges(newColumn);
    else handleOnExitEditMode();
  };

  const handleOnExitEditMode = () => {
    setColumnToEdit(undefined);
    props.onExitEditMode?.();
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        if (newColumn.type === 'NULL') {
          setOpenTypesMenu(true);
        } else {
          handleOnCommitChanges();
        }
        break;
      case 'Escape':
        handleOnExitEditMode();
        break;
    }
  };

  const handleOnDeleteColumn = () => {
    setOpenDeleteColumnModal(true);
  };

  const handleOnChangeType = () => {
    setOpenActionsMenu(false);
    setOpenTypesMenu(true);
  };

  const handleOnInputBlur = (event: React.FocusEvent) => {
    const isChild = event.currentTarget.contains(event.relatedTarget);
    const isValidColumn = newColumn.type != 'NULL' && newColumn.columnName;
    if (!isValidColumn || isChild || openActionsMenu || openTypesMenu) return;
    handleOnCommitChanges();
  };

  return (
    <Box className={`${styles.row} ${styles.editing} ${isSaving ? styles.saving : ''}`} onBlur={handleOnInputBlur}>
      <InputNewColumnRow columnName={column.columnName} onChange={handleOnColumnNameChange} onKeyUp={handleOnKeyUp} />
      <>
        {props.isNewColumn || openTypesMenu ? (
          <TypesMenu
            open={openTypesMenu}
            column={newColumn}
            onClick={() => setOpenTypesMenu(true)}
            onClose={() => setOpenTypesMenu(false)}
            onChangeType={handleOnTypeChange}
          />
        ) : (
          <ActionsMenu
            open={openActionsMenu}
            onClick={() => setOpenActionsMenu(true)}
            onClose={() => setOpenActionsMenu(false)}
            onClickDelete={handleOnDeleteColumn}
            onClickChangeType={handleOnChangeType}
          />
        )}
      </>
      <DeleteColumnModal column={column} open={openDeleteColumnModal} onClose={() => setOpenDeleteColumnModal(false)} />
    </Box>
  );
}
