import { inject, injectable } from 'inversify';
import { TYPES } from 'ioc/types';
import { IRequestsService } from 'interfaces/IRequestsService';
import { getHost } from 'utils/host';
import { ColumnSchemaInfoTable } from 'dtos/ColumnSchemaInfoTable';
import { IDatabaseService } from 'interfaces/IDatabaseService';
import { IMenuItem } from 'components/CustomSelect/CustomSelect';
import { ICustomTableProps } from 'components/CustomTable/CustomTable';
import Source from 'dtos/Source';

@injectable()
export class DatabaseService implements IDatabaseService {
  @inject(TYPES.IRequestsService)
  private requestsService!: IRequestsService;

  async getColumnsSchemaInformation(modelId: string, sourceId: string): Promise<ColumnSchemaInfoTable[]> {
    const url = `${getHost()}/api/tables/source/${sourceId}/model/${modelId}/`;
    const response = await this.requestsService.get(url);
    const result = await response.json();
    return response.ok ? result : [];
  }

  async getDatabases(): Promise<IMenuItem[]> {
    const url = `${getHost()}/api/database/databases/`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async getSchemasByDatabase(databaseSelected: string): Promise<IMenuItem[]> {
    const url = `${getHost()}/api/database/schema/${databaseSelected}/`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async postSaveSource(source: Source): Promise<{ newCustomTable: ICustomTableProps; newSource: Source }> {
    const url = `${getHost()}/api/sources/`;
    const response = await this.requestsService.post(url, JSON.stringify(source));
    return response.ok ? response.json() : Promise.reject(await response.json());
  }
}
