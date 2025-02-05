export default interface Source {
  SOURCE_ID?: number;
  MODEL_ID?: number;
  PROVIDER_NAME: string;
  CONNECTOR_NAME: string;
  DATABASE: string;
  SCHEMA: string;
  CREATED_TIMESTAMP?: Date;
  MODEL_NAME?: string;
}
