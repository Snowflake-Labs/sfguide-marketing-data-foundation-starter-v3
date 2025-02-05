import styles from './Rows.module.scss';
import { List } from '@mui/material';
import { TableModel } from 'dtos/ModelUI';
import HeaderRows from './HeaderRow';
import { HandleType } from 'reactflow';
import Row from './Row';
import { useState } from 'react';
import AddColumnRow from './AddEditableRow/AddColumnRow';
import HandleSet from './HandleSet';

export interface Props {
  table: TableModel;
  type: HandleType;
  headerClasses?: string[];
}

export default function Rows({ table, ...other }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const collapseNode = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <List className={styles.list}>
        <HeaderRows
          id={`${table.object}`}
          classNames={other.headerClasses}
          table={table}
          collapsed={collapsed}
          onCollapsed={collapseNode}
        />
        {!collapsed ? (
          table.columns.map((column, index) => (
            <Row
              key={`node-row-${index}`}
              id={`${table.object}.${column.columnName}`}
              handlerType={other.type}
              table={table}
              column={column}
            />
          ))
        ) : (
          <HandleSet table={table} />
        )}
        {!collapsed && table.type === 'target' && <AddColumnRow table={table} />}
      </List>
    </>
  );
}
