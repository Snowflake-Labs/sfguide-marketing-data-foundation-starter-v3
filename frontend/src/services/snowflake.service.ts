import { IRequestsService } from 'interfaces/IRequestsService';
import { ISnowflakeService } from 'interfaces/ISnowflakeService';
import { inject, injectable } from 'inversify';
import { TYPES } from 'ioc/types';
import { getHost } from 'utils/host';

@injectable()
export class SnowflakeService implements ISnowflakeService {
  @inject(TYPES.IRequestsService)
  private requestsService!: IRequestsService;

  async get_current_database(): Promise<{current_database: string}> {
    const url = `${getHost()}/account/current_database`;
    const response = await this.requestsService.get(url);
    return response.json();
  }
  async get_account_name(): Promise<{account_name: string}> {
    const url = `${getHost()}/account/account_name`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async get_organization_name(): Promise<{organization_name: string}> {
    const url = `${getHost()}/account/organization_name`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async get_account_identifier(): Promise<{organization_name: string, account_name:string}> {
    const url = `${getHost()}/account/account_identifier`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async get_databases(): Promise<[{value:string, label:string}]> {
    const url = `${getHost()}/account/databases`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async get_schemas(database: string): Promise<[{value:string, label:string}]> {
    const url = `${getHost()}/account/schemas/${database}`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

}



