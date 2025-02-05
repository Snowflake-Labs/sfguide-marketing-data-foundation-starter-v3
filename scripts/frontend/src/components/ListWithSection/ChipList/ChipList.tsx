import { Box, Stack } from '@mui/material';
import { useTranslation } from 'locales/i18n';
import styles from './ChipList.module.scss';

enum ChipLabel {
  PaidMedia = 'PaidMedia',
  ComingSoon = 'ComingSoon',
  Analytics = 'Analytics',
  CRM = 'CRM',
  OwnedMedia = 'OwnedMedia',
  NativeApp = 'NativeAppConnector',
  External = 'ExternalConnector',
  DemandSidePlatforms = 'Demand Side Platforms (DSPs)',
  CustomerSidePlatforms = 'Customer Side Platforms (CSPs)'
}

enum ChipColor {
  PaidMedia_NativeApp = '#DCEAFF',
  ComingSoon = '#0000000A',
  Analytics_External = '#FFF3DC',
  CRM = '#E7DCFF',
  OwnedMedia = '#E9FFDC',
}

interface Chip {
  label: ChipLabel;
  color: ChipColor;
}

const Chips: { [key: string]: Chip } = {
  PaidMediaChip: {
    label: ChipLabel.PaidMedia,
    color: ChipColor.PaidMedia_NativeApp,
  },
  ComingSoonChip: {
    label: ChipLabel.ComingSoon,
    color: ChipColor.ComingSoon,
  },
  AnalyticsChip: {
    label: ChipLabel.Analytics,
    color: ChipColor.Analytics_External,
  },
  CRMChip: {
    label: ChipLabel.CRM,
    color: ChipColor.CRM,
  },
  OwnedMediaChip: {
    label: ChipLabel.OwnedMedia,
    color: ChipColor.OwnedMedia,
  },
  //Connector
  NativeAppChip: {
    label: ChipLabel.NativeApp,
    color: ChipColor.PaidMedia_NativeApp,
  },
  ExternalChip: {
    label: ChipLabel.External,
    color: ChipColor.Analytics_External,
  },
  DemandSidePlatformsChip: {
    label: ChipLabel.DemandSidePlatforms,
    color: ChipColor.PaidMedia_NativeApp,
  },
  CustomerSidePlatformsChip: {
    label: ChipLabel.CustomerSidePlatforms,
    color: ChipColor.PaidMedia_NativeApp,
  },
};

export interface IChipListProps {
  chips: string[];
}

export default function ChipList({ chips }: IChipListProps) {
  const { t } = useTranslation('common');

  return (
    <Stack direction="row" spacing={1}>
      {chips.map((chiplabel, index) => {
        const { label, color } = Chips[chiplabel];
        return (
          <Box key={`chip-${index}`} className={styles.chip} sx={{ bgcolor: color }}>
            {t(label)}
          </Box>
        );
      })}
    </Stack>
  );
}
