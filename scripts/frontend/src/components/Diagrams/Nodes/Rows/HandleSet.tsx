import { styles as colors } from 'styles/styles';
import { TableModel } from 'dtos/ModelUI';
import { HtmlHTMLAttributes } from 'react';
import { Handle, Position } from 'reactflow';

export interface RowProps extends HtmlHTMLAttributes<HTMLElement> {
  table: TableModel;
}

export default function HandleSet({ table }: RowProps) {
  const style = {
    background: colors.diagram.edge.mapping.primary,
    border: `1px solid ${colors.diagram.edge.mapping.primary}`,
  };

  return (
    <>
      {table.columns.map((column) => (
        <Handle
          key={`${table.object}.${column.columnName}`}
          id={`${table.object}.${column.columnName}`}
          type={'source'}
          isConnectable={false}
          position={Position.Right}
          style={style}
        />
      ))}
    </>
  );
}
