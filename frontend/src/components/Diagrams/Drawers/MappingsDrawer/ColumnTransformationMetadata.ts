import { ColumnMetadata, ColumnType } from 'dtos/ModelUI';

export interface ColumnTransformationMetadata {
  columns?: ColumnMetadata[];
  columnType?: ColumnType;
  displayValue?: string;
  transformation: string;
}
