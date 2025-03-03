import { ColumnType } from './ModelUI';

const ColumnNumericMappings = {
  NUMBER: ColumnType.NUMBER,

  DECIMAL: ColumnType.NUMBER,
  NUMERIC: ColumnType.NUMBER,

  INT: ColumnType.NUMBER,
  INTEGER: ColumnType.NUMBER,
  BIGINT: ColumnType.NUMBER,
  SMALLINT: ColumnType.NUMBER,
  TINYINT: ColumnType.NUMBER,
  BYTEINT: ColumnType.NUMBER,

  FLOAT: ColumnType.NUMBER,
  FLOAT4: ColumnType.NUMBER,
  FLOAT8: ColumnType.NUMBER,

  DOUBLE: ColumnType.NUMBER,
  REAL: ColumnType.NUMBER,
  'DOUBLE PRECISION': ColumnType.NUMBER,
};

const ColumnTextMappings = {
  VARCHAR: ColumnType.VARCHAR,
  CHAR: ColumnType.VARCHAR,
  CHARACTER: ColumnType.VARCHAR,
  STRING: ColumnType.VARCHAR,
  TEXT: ColumnType.VARCHAR,
  BINARY: ColumnType.VARCHAR,
  VARBINARY: ColumnType.VARCHAR,
};

const ColumnDateMappings = {
  DATE: ColumnType.DATE,
  DATETIME: ColumnType.DATE,
  TIME: ColumnType.DATE,
  TIMESTAMP: ColumnType.DATE,
  TIMESTAMP_LTZ: ColumnType.DATE,
  TIMESTAMP_NTZ: ColumnType.DATE,
  TIMESTAMP_TZ: ColumnType.DATE,
};

const ColumnStructuredMappings = {
  VARIANT: ColumnType.VARIANT,
  OBJECT: ColumnType.VARIANT,
  ARRAY: ColumnType.VARIANT,
};

export const ColumnMappings = {
  ...ColumnNumericMappings,
  ...ColumnTextMappings,
  ...ColumnDateMappings,
  ...ColumnStructuredMappings,
  BOOLEAN: ColumnType.BOOLEAN,
  NULL: ColumnType.NULL,
};

export type SqlColumnType = keyof typeof ColumnMappings;

export function sqlTypetoColumnType(column: string): ColumnType {
  return ColumnMappings[column as keyof typeof ColumnMappings] ?? ColumnType.VARIANT;
}
