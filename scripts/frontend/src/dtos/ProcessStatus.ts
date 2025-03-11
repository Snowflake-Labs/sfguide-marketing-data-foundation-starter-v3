export interface ProcessStatus {
    MODEL_ID: number;
    PROCESS_ID: number;
    PROCESS_NAME: string;
    STATUS: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'DRAFT';
  }
  