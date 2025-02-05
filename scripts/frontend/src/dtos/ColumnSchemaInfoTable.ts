import { SqlColumnType } from './SqlColumnTypes';

export interface ColumnSchemaInfoTable {
  TABLE_CATALOG: string;
  TABLE_SCHEMA: string;
  TABLE_NAME: string;
  COLUMNS: { COLUMN_NAME: string; DATA_TYPE: SqlColumnType }[];
}
