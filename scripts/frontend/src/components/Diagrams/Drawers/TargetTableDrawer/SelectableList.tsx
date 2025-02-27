import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { TableModel } from 'dtos/ModelUI';
import styles from './TargetTableDrawer.module.scss';

interface Props {
  items: TableModel[];
  handleClick: (value: TableModel | undefined) => void;
}

export default function SelectableList({ items, handleClick }: Props) {
  const handleListItemClick = (index: number, selectedItem: TableModel) => {
    handleClick(selectedItem);
  };

  return (
    <List component="nav" aria-label="secondary mailbox folder">
      {items.map((item, index) => {
        return (
          <Box key={`box-item-${index}`}>
            <ListItemButton
              key={`ls-item-${index}`}
              onClick={() => handleListItemClick(index, items[index])}
              className={styles.listItem}
            >
              <ListItemText primary={item.tableName} />
            </ListItemButton>
          </Box>
        );
      })}
    </List>
  );
}
