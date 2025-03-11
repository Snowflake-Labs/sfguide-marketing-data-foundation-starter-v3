import { Box, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from '@mui/material';
import { Subtitle2 } from 'components/common/Text/TextComponents';
import styles from './SidebarButton.module.scss';
import { Tooltip } from '@mui/material';

interface Props extends ListItemButtonProps {
  text: string;
  hiddenText?: boolean;
  selected?: boolean;
  icon?: React.ReactNode;
}

export default function SidebarButton(props: Props) {
  const buttonClasses = `${styles.button} ${props.selected? styles.selected: ''}`;

  return (
    <Box className={styles.container}>
      <Tooltip className={styles.tooltip} placement='right-end'
        PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -20],
                },
              },
            ],
          }}
        title={props.text}>
        <ListItemButton className={buttonClasses} onClick={props.onClick}>
          <ListItemIcon className={styles.icon}>{props.icon}</ListItemIcon>
          {!props.hiddenText && (
            <ListItemText>
              <Subtitle2>{props.text}</Subtitle2>
            </ListItemText>
          )}
        </ListItemButton>
      </Tooltip>
    </Box>
  );
}
