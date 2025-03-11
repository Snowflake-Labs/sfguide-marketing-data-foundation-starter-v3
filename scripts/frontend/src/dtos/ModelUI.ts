import { JoinTypes } from './JoinDefinition';
import { SqlColumnType } from './SqlColumnTypes';

export interface ModelUI {
  id: string;
  name: string;
  databases: DatabaseModel[];
}

export interface DatabaseModel {
  databaseName: string;
  schemas: SchemaModel[];
}

export interface SchemaModel {
  schemaName: string;
  databaseName: string;
  tables: TableModel[];
}

export interface TableModel extends TableCondition {
  type: TableModelType;
  columns: ColumnModel[];
  mappings?: ColumnRelation[];
  joins?: JoinModel[];
  position?: Position;
  targetLag?: TargetLag;
}

export interface TableCondition extends TableMetadata {
  where?: Condition[];
  qualify?: Condition[];
}

export interface TargetLag {
  number: number;
  timeUnit: string;
}

export interface TableMetadata {
  alias: string;
  object: string;
  tableName: string;
  schemaName: string;
  databaseName: string;
}

export interface SimpleTableMetadata {
  alias: string;
  object: string;
}

export interface ColumnModel extends ColumnMetadata {
  type: ColumnType;
  sqlType: SqlColumnType;
}

export interface ColumnMetadata {
  columnName: string;
  object: string;
}

export interface ColumnRelation {
  sources: ColumnMetadata[];
  target: ColumnMetadata;
  type: MappingType;
  mapping: string;
  displayValue?: string;
}

export interface JoinModel {
  target: TableMetadata;
  from: TableMetadata;
  to: TableMetadata;
  type: JoinTypes;
  on: string;
  where?: string;
  qualify?: string;
}

export interface Condition {
  value: string;
  target: SimpleTableMetadata;
}

export type TableModelType = 'source' | 'target' | 'static' | 'variable' | 'formula';

export enum MappingType {
  Column = 'column',
  Static = 'static',
  Variable = 'variable',
  Formula = 'formula',
}

export enum ColumnType {
  VARCHAR = 'VARCHAR',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  VARIANT = 'VARIANT',
  DATE = 'DATE',
  NULL = 'NULL',
}

export enum VariableMappingType {
  ModelId = 'model-id',
  ModelName = 'model-name',
  CurrentTimestamp = 'current-timestamp',
  SyncId = 'sync-id',
  SyncRunId = 'sync-run-id',
}

export enum ConditionType {
  Where = 'Where',
  Qualify = 'Qualify',
}

export interface Position {
  x: number;
  y: number;
}
