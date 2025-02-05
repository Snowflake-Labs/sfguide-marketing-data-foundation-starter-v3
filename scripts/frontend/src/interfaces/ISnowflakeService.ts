import { IMenuItem } from 'components/CustomSelect/CustomSelect';

export interface ISnowflakeService {
  get_current_database(): Promise<{ current_database: string }>;
  get_account_name(): Promise<{ account_name: string }>;
  get_organization_name(): Promise<{ organization_name: string }>;
  get_databases(): Promise<IMenuItem[]>;
  get_schemas(database: string | undefined): Promise<IMenuItem[]>;
  get_account_identifier(): Promise<{ organization_name: string; account_name: string }>;
}
