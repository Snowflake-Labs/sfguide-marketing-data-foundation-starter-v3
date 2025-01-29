export interface ModelStatus {
  MODEL_ID: number;
  PROCESS_ID: number;
  PROCESS_NAME: string;
  STATUS: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'DRAFT';
  CREATED_TIMESTAMP: number;
  MODIFIED_TIMESTAMP: number;
}
