export interface ProcessProgress {
  status: string;
  status_code: ProcessProgressStatus;
  message: string;
  name: string;
}

export enum ProcessProgressStatus {
  Created = 1,
  Deleted = 2,
  Updated = 3,
  Error = 4,
}
