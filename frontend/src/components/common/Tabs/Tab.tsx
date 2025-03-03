import { Tab as MuiTab, SxProps, TabProps } from '@mui/material';
import { Text } from 'components/common/Text/Text';
import styles from './Tabs.module.scss'

interface Props extends TabProps {
  index: number;
  label: string;
}

export default function Tab(props: Props) {
  const { label, index, ...other } = props;
  const tabStyle: SxProps = { px: 0 };
  const textProps = { fontSize: 12, fontWeight: 500 };
  const text = <Text {...textProps}>{props.label}</Text>;

  return <MuiTab label={text} {...a11yProps(props.index)} sx={tabStyle} {...other} className={`${other.className} ${styles.tab}`} />;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
