import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Styles from './SubMenu.module.scss';
import { Box, Menu, SvgIcon } from '@mui/material';
import { ReactComponent as DataPreview } from 'assets/icons/DataPreview.svg';
import { ReactComponent as Delete } from 'assets/icons/Delete.svg';
import { ReactComponent as Filter } from 'assets/icons/Filter.svg';
import { Body1 } from 'components/common/Text/TextComponents';
import FiltersDrawer from 'components/Diagrams/Drawers/FiltersDrawer/FiltersDrawer';
import { useState } from 'react';
import { ConditionType, TableModel } from 'dtos/ModelUI';
import { useTranslation } from 'locales/i18n';
import { IMappingService } from 'interfaces/IMappingService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { conditionToProcessDefinition } from 'utils/MappingModel/ModelUIHelpers';
import { IPubSubService } from 'interfaces/IPubSubService';
import { EventData } from 'dtos/EventData';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';
import MappingTableDeleteDialog from 'components/Mappings/MappingTable/MappingTableDeleteDialog';
import { IMenu } from 'interfaces/IMenu';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';

interface Props extends IMenu {
  table: TableModel;
  anchorEl: HTMLElement | null;
}

export default function SourceSubMenu(props: Props) {
  const PREVIEW_ROWS = 100;
  const { setModelLoading, setOverlapSpinner, saving } = useMappingContext();
  const { target } = useEditMappingContext();
  const { t } = useTranslation('common');

  const [openFilterDrawer, setopenFilterDrawer] = useState(false);
  const [type, setType] = useState<ConditionType | undefined>(undefined);
  const [openDelete, setOpenDelete] = useState(false);

  const renderFiltersDrawer = (type: ConditionType | undefined) => {
    if (!type) return;
    return (
      <FiltersDrawer
        open={openFilterDrawer}
        onClose={() => setopenFilterDrawer(false)}
        type={type}
        table={props.table}
      />
    );
  };
  const mappingService = container.get<IMappingService>(TYPES.IMappingService);
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const openPreview = () => {
    setOverlapSpinner(true);
    setModelLoading(true);
    const processDefinition = conditionToProcessDefinition(
      props.table,
      target,
      undefined,
      undefined,
      false,
      PREVIEW_ROWS
    );
    mappingService.validateSql(processDefinition.targets[0].definitions[0]).then((response) => {
      pubSubService.emitEvent(EventData.Diagram.Node.ShowPreview, { table: props.table, data: response });
    });
    props.onClose?.();
  };

  const toggleDeleteModel = () => {
    setOpenDelete((prev) => !prev);
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
            <Box className={Styles.options}>
              <SvgIcon component={Delete} fontSize="small" className={Styles.optionIcon} />
              <Body1>{t('Delete')}</Body1>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setopenFilterDrawer(true);
              setType(ConditionType.Where);
              props.onClose?.();
            }}
          >
            <Box className={Styles.options}>
              <SvgIcon component={Filter} fontSize="small" className={Styles.optionIcon} />
              <Body1>{t('Where')}</Body1>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setopenFilterDrawer(true);
              setType(ConditionType.Qualify);
              props.onClose?.();
            }}
          >
            <Box className={Styles.options}>
              <SvgIcon component={Filter} fontSize="small" className={Styles.optionIcon} />
              <Body1>{t('Qualify')}</Body1>
            </Box>
          </MenuItem>
        </MenuList>
      </Menu>
      {renderFiltersDrawer(type)}
      <MappingTableDeleteDialog
        openDelete={openDelete}
        toggleDeleteModel={toggleDeleteModel}
        targetTableObjectToDelete={props.table.object}
        saving={saving}
      />
    </>
  );
}
