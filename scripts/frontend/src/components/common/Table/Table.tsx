import {Table as MuiTable, TableProps, TableRow, TableHead, TableBody} from '@mui/material';

interface Props extends TableProps {
  header: JSX.Element;
  body: JSX.Element[];
  bodyClassName: string;
}

export const Table = (props: Props) => {
  return (
    <MuiTable className={props.className}>
      <TableHead>
        {props.header}
      </TableHead>
      <TableBody className={props.bodyClassName}>
        {props.body}
      </TableBody>
    </MuiTable>
  );
};
