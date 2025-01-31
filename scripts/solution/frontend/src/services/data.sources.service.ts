import Source from 'dtos/Source';
import { IDataSourcesService } from 'interfaces/IDataSourcesService';
import { IRequestsService } from 'interfaces/IRequestsService';
import { inject, injectable } from 'inversify';
import { TYPES } from 'ioc/types';
import { getHost } from 'utils/host';

@injectable()
export class DataSourcesService implements IDataSourcesService {
  @inject(TYPES.IRequestsService)
  private requestsService!: IRequestsService;

  async getSource(sourceId: string): Promise<Source> {
    if (!sourceId) return Promise.reject('Source ID is required');
    const url = `${getHost()}/api/sources/${sourceId}`;
    const response = await this.requestsService.get(url);
    return response.ok ? await response.json() : Promise.reject(response.statusText);
  }

  async getExistingSources(): Promise<Source[]> {
    const url = `${getHost()}/api/sources/`;
    const response = await this.requestsService.get(url);
    return response.json();
  }

  async deleteExistingSources(rowsToDelete: Source[]): Promise<string> {
    const url = `${getHost()}/api/sources/`;
    const ids = rowsToDelete.map((row) => row.SOURCE_ID);
    const response = await this.requestsService.delete(url, { SOURCES: JSON.stringify(ids) });
    return response.json();
  }
}
