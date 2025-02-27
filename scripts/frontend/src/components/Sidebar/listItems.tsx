import * as React from 'react';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlineOutlined';
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined';
import ChatBubbleOutlined from '@mui/icons-material/ChatOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import { PathConstants } from "routes/pathConstants";
import { useTranslation } from 'locales/i18n';
import SidebarButton from './SidebarButton/SidebarButton';
import { useLocation } from 'react-router-dom';

interface Props {
  open: boolean;
  navigate: (page: string) => void;
}

export default function MainListItems({ open, navigate }: Props) {
  const { t } = useTranslation('common');
  const location = useLocation();
  const hiddenText = !open;

  const isSelected = (path: string): boolean => {
    let url = location.pathname.replace(/^\/+/, '');
    return url.startsWith(path);
  };

  return (
    <React.Fragment>
      <SidebarButton
        text={t('SidebarDataSources')}
        hiddenText={hiddenText}
        icon={<AddCircleOutlined />}
        selected={isSelected(PathConstants.DATASOURCES)}
        onClick={() => navigate(PathConstants.DATASOURCES)}
      />
      <SidebarButton
        text={t('SidebarDataQuality')}
        hiddenText={hiddenText}
        icon={<CheckBoxOutlined />}
        selected={isSelected(PathConstants.DATAQUALITY)}
        onClick={() => navigate(PathConstants.DATAQUALITY)}
      />
      <SidebarButton
        text={t('SidebarDataExplorer')}
        hiddenText={hiddenText}
        icon={<BarChartIcon />}
        selected={isSelected(PathConstants.DATAEXPLORER)}
        onClick={() => navigate(PathConstants.DATAEXPLORER)}
      />
      <SidebarButton
        text={t('SidebarAIAssistant')}
        hiddenText={hiddenText}
        icon={<ChatBubbleOutlined />}
        selected={isSelected(PathConstants.AIASSISTANT)}
        onClick={() => navigate(PathConstants.AIASSISTANT)}
      />
      <SidebarButton
        text={t('SidebarMarketingExecution')}
        hiddenText={hiddenText}
        icon={<WorkOutlineOutlinedIcon />}
        selected={isSelected(PathConstants.MARKETINGEXECUTION)}
        onClick={() => navigate(PathConstants.MARKETINGEXECUTION)}
      />
    </React.Fragment>
  );
}
