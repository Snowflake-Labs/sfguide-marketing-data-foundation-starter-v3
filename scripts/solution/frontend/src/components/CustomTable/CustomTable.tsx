import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from './CustomTable.module.scss';
import { useTranslation } from 'locales/i18n';
import { Subtitle1 } from 'components/common/Text/TextComponents';
import { HTMLAttributes } from 'react';

export interface ITableData {
  name: string;
  metric?: number;
}

export interface ICustomTableProps extends HTMLAttributes<HTMLElement> {
  columns?: string[];
  data: ITableData[];
  header: string;
  title?: string;
}

export default function CustomTable({ columns, data, header, title, ...other }: ICustomTableProps) {
  const { t } = useTranslation('common');
  return (
    <TableContainer component={Paper} className={`${styles.tableContainer} ${other.className}`}>
      {title && <Subtitle1>{t(title)}</Subtitle1>}

      <Table size="small">
        <TableHead>
          <TableRow sx={{ '.MuiTableCell-sizeSmall': { border: 1, borderColor: '#CFD6E2', background: '#F3F6FA' } }}>
            <TableCell>{t(header)}</TableCell>
            {columns?.map((col) => {
              return <TableCell align="right">{col}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            return (
              <TableRow
                sx={{
                  '.MuiTableCell-alignRight': { border: 1, borderColor: '#CFD6E2' },
                  '.MuiTableCell-sizeSmall': { border: 1, borderColor: '#CFD6E2' },
                }}
                key={row.name}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                {columns?.map((col) => {
                  for (const [key, value] of Object.entries(row)) {
                    if (key.toUpperCase() == col.toUpperCase()) {
                      return <TableCell align="right">{value}</TableCell>;
                    }
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
