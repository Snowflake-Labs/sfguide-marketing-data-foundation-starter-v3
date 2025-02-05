import { ModelUI } from './ModelUI';

export default interface Model {
  MODEL_ID?: number;
  MODEL_NAME: string;
  TARGET_DATABASE: string;
  TARGET_SCHEMA: string;
  MODEL_UI?: ModelUI;
}
