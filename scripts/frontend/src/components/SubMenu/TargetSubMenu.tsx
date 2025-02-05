import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Styles from './SubMenu.module.scss';
import { Box, Menu, SvgIcon } from '@mui/material';
import { ReactComponent as DataPreview } from 'assets/icons/DataPreview.svg';
import { ReactComponent as Delete } from 'assets/icons/Delete.svg';
import { ReactComponent as DateTime } from 'assets/icons/DateTime.svg';
import { Body1 } from 'components/common/Text/TextComponents';
import { useState } from 'react';
import { TableModel } from 'dtos/ModelUI';
import { useTranslation } from 'locales/i18n';
import { IMappingService } from 'interfaces/IMappingService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { getTargetTablesInModelUI } from 'utils/MappingModel/ModelUIHelpers';
import { IPubSubService } from 'interfaces/IPubSubService';
import { EventData } from 'dtos/EventData';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import { targetTableToProcessAttributes } from 'utils/MappingModel/toStandardMappingModel';
import MappingTableDeleteDialog from 'components/Mappings/MappingTable/MappingTableDeleteDialog';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';
import { useNavigate } from 'react-router-dom';
import TargetLagModal from 'components/TargetLag/TargetLagModal';
import { IMenu } from 'interfaces/IMenu';

interface Props extends IMenu {
  table: TableModel;
  anchorEl: HTMLElement | null;
}

let targetTableToSetLag: TableModel;

export default function TargetSubMenu(props: Props) {
  const PREVIEW_ROWS = 100;
  const { t } = useTranslation('common');
  const { setModelLoading, setOverlapSpinner, model, saving } = useMappingContext();
  const { selectTargetObject } = useEditMappingContext();
  const navigate = useNavigate();

  const [openDelete, setOpenDelete] = useState(false);

  const mappingService = container.get<IMappingService>(TYPES.IMappingService);
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const openPreview = () => {
    setOverlapSpinner(true);
    setModelLoading(true);
    props.onClose?.();
    const processAttribute = targetTableToProcessAttributes(props.table, model);
    mappingService
      .validateSql(processAttribute.definitions[0])
      .then((response) => {
        pubSubService.emitEvent(EventData.Diagram.Node.ShowPreview, { table: props.table, data: response });
      })
      .catch((error) => {
        setOverlapSpinner(false);
        setModelLoading(false);
        pubSubService.emitEvent(EventData.Notification.Show, { severity: 'error', message: t('ErrorPreviewData') });
      });
  };

  const deleteTarget = () => {
    pubSubService.emitEvent(EventData.Diagram.Node.DeleteTarget, props.table);
    props.onClose?.();
  };

  const toggleDeleteModel = () => setOpenDelete((prev) => !prev);

  const handleOnDeleteSucess = () => {
    const targets = getTargetTablesInModelUI(model);
    const firstTarget = targets.length > 0 ? targets[0].object : undefined;
    if (firstTarget) selectTargetObject(firstTarget, '');
    else navigate('..');
  };
  const [openTargetLag, setOpenTargetLag] = useState(false);

  const onClickTargetLag = (table: TableModel) => (): void => {
    if (!table) return;
    targetTableToSetLag = table;
    setOpenTargetLag(true);
    props.onClose?.();
  };

  return (
    <>
      <Menu className={Styles.container} open={props.open} anchorEl={props.anchorEl} onClose={props.onClose}>
        <MenuList>
          <MenuItem>
            <Box className={Styles.options} onClick={openPreview}>
              <SvgIcon component={DataPreview} fontSize="small" className={Styles.optionIcon} />
              <Body1>{t('PreviewData')}</Body1>
            </Box>
          </MenuItem>
          <MenuItem onClick={toggleDeleteModel}>
            <Box className={Styles.options} onClick={deleteTarget}>
              <SvgIcon component={Delete} fontSize="small" className={Styles.optionIcon} />
              <Body1>{t('Delete')}</Body1>
            </Box>
          </MenuItem>
          <MenuItem>
            <Box className={Styles.options} onClick={onClickTargetLag(props.table)}>
              <SvgIcon component={DateTime} fontSize="small" className={Styles.optionIcon} />
              <Body1>{t('TargetLag')}</Body1>
            </Box>
          </MenuItem>
        </MenuList>
      </Menu>
      <MappingTableDeleteDialog
        openDelete={openDelete}
        toggleDeleteModel={toggleDeleteModel}
        targetTableObjectToDelete={props.table.object}
        saving={saving}
        onDeleteSucess={handleOnDeleteSucess}
      />
      <TargetLagModal openModal={openTargetLag} table={props.table} setOpen={setOpenTargetLag} />
    </>
  );
}
