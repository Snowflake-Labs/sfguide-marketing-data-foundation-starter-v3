import { JoinTypes } from './JoinDefinition';
import { NullType } from './NullType';
import { SqlColumnType } from './SqlColumnTypes';

interface Settings {
  target_interval: string;
  target_lag: number;
  warehouse: string;
}

interface Target extends ProcessTableMetadata {
  columns: { name: string; type: SqlColumnType }[];
}

export interface ProcessDefinition {
  columns?: (string | NullType)[];
  group_by?: string[];
  join?: ProcessDefinitionJoin[];
  order_by?: string[];
  source: SourceProcessTable;
  limit?: number;
}

export interface ProcessDefinitionJoin extends SourceProcessTable {
  on: string;
  type: JoinTypes;
}

export interface SourceProcessTable extends ProcessTableMetadata {
  where?: string;
  qualify?: string;
}

export interface ProcessAttributes {
  labels: string[];
  process_name: string;
  process_type_id: number;
  settings: Settings;
  target: Target;
  definitions: ProcessDefinition[];
}

export interface ProcessTableMetadata {
  alias: string;
  object: string;
}

export default interface Process {
  PROCESS_ID?: number;
  MODEL_ID?: number;
  PROCESS_TYPE_ID: number;

  PROCESS_NAME: string;
  PROCESS_ATTRIBUTES: ProcessAttributes;

  CREATED_TIMESTAMP: Date;
  MODIFIED_TIMESTAMP: Date;

  STATUS: string;
}
