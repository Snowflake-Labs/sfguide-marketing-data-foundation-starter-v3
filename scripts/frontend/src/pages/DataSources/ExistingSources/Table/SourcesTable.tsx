import styles from './SourcesTable.module.scss';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import SourceColumn from './Columns/SourceColumn';
import { Body2, Subtitle2 } from 'components/common/Text/TextComponents';
import ConnectorColumn from './Columns/ConnectorColumn';
import { useTranslation } from 'locales/i18n';
import { Table } from 'components/common/Table/Table';
import { useExistingSourcesContext } from '../../../../contexts/ExistingSourcesContext/ExistingSourcesContext';
import Spinner from 'components/common/Spinner/Spinner';
import Source from 'dtos/Source';
import { useMemo } from 'react';
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';

export default function SourcesTable() {
  const { t } = useTranslation('common');
  const { existingSources, loading, filter, rowsToDelete } = useExistingSourcesContext();
  const navigate = useNavigate();

  const handleGoToSource = (source: Source) => {
    if (!source.SOURCE_ID) return;
    navigate(`/${PathConstants.DATASOURCES}/${source.SOURCE_ID}/${PathConstants.MODELS}`);
  };

  var header = (
    <TableRow className={styles.table_header}>
      <TableCell className={`${styles.header_cell} ${styles.first_col_radius}`}>
        <Subtitle2 color="text.secondary">{t('Source')}</Subtitle2>
      </TableCell>
      <TableCell className={styles.header_cell}>
        <Subtitle2 color="text.secondary">{t('Connector')}</Subtitle2>
      </TableCell>
      <TableCell className={styles.header_cell}>
        <Subtitle2 color="text.secondary">{t('Model')}</Subtitle2>
      </TableCell>
      <TableCell className={styles.header_cell}>
        <Subtitle2 color="text.secondary">{t('DatabaseAndSchema')}</Subtitle2>
      </TableCell>
      <TableCell className={`${styles.header_cell} ${styles.last_col_radius}`}>
        <Subtitle2 color="text.secondary">{t('CreatedAt')}</Subtitle2>
      </TableCell>
    </TableRow>
  );
  var memoBody = useMemo(
    () =>
      existingSources
        .filter(
          (row) =>
            row.PROVIDER_NAME.toLowerCase().includes(filter) ||
            row.CONNECTOR_NAME.toLowerCase().includes(filter) ||
            row.MODEL_NAME?.toLowerCase().includes(filter) ||
            row.DATABASE.toLowerCase().includes(filter) ||
            row.SCHEMA.toLowerCase().includes(filter) ||
            row.CREATED_TIMESTAMP?.toString().toLowerCase().includes(filter)
        )
        .map((row, index) => (
          <TableRow key={row.PROVIDER_NAME + row.CONNECTOR_NAME + index} className={styles.table_row}>
            <TableCell className={`${styles.table_cell} ${styles.source_cell}`}>
              <SourceColumn provider_name={row.PROVIDER_NAME} source={row}></SourceColumn>
            </TableCell>
            <TableCell className={`${styles.table_cell} ${styles.connector_cell}`}>
              <ConnectorColumn connector_name={row.CONNECTOR_NAME}></ConnectorColumn>
            </TableCell>
            <TableCell className={`${styles.table_cell} ${styles.connector_cell}`}>
              <Body2> {row.MODEL_NAME}</Body2>
            </TableCell>
            <TableCell
              className={`${styles.table_cell} ${styles.db_schema_cell}`}
              onClick={() => handleGoToSource(row)}
            >
              <Link className={styles.link}>
                <Body2>
                  {row.DATABASE}.{row.SCHEMA}
                </Body2>{' '}
              </Link>
            </TableCell>
            <TableCell className={`${styles.table_cell} ${styles.date_cell}`}>
              <Body2>{row.CREATED_TIMESTAMP?.toString()}</Body2>
            </TableCell>
          </TableRow>
        )),
    [existingSources, filter, rowsToDelete]
  );
  return (
    <Spinner loading={loading}>
      {existingSources.length > 0 && (
        <Table className={styles.table} bodyClassName={styles.table_body} header={header} body={memoBody}></Table>
      )}
    </Spinner>
  );
}
