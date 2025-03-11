import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import styles from './Paginator.module.scss';

interface Props {
  ItemsCount: number;
  onPageChange: (newPage: number, page: number) => void;
}

export default function Paginator({ ItemsCount, ...other }: Props) {
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    other.onPageChange(newPage, page);
  };

  return (
    <TablePagination
      className={styles.Paginator}
      onPageChange={handleChangePage}
      sx={{
        '.MuiTablePagination-selectLabel': { display: 'none' },
        '.MuiInputBase-root': { display: 'none' },
        '.MuiTablePagination-spacer': { display: 'none' },
      }}
      component="div"
      count={Math.ceil(ItemsCount / 4)}
      page={page}
      rowsPerPage={1}
      showFirstButton
      showLastButton
    />
  );
}
