import { IRequestsService } from 'interfaces/IRequestsService';
import { IDataExplorerService } from 'interfaces/IDataExplorerService';
import { inject, injectable } from 'inversify';
import { TYPES } from 'ioc/types';
import { getHost } from 'utils/host';
import {
  spend,
  reactions,
  impressions,
  combinedMetrics,
  webinarMetrics,
  customersOverview,
  geoGroup,
  browserType,
  deviceType,
  purchaseTime,
  statusCounts,
} from 'dtos/DataExplorer';

@injectable()
export class DataExplorerService implements IDataExplorerService {
  @inject(TYPES.IRequestsService)
  private requestsService!: IRequestsService;
  async get_spend(database: string, schema: string): Promise<spend> {
    const url = `${getHost()}/api/data_explorer/spend`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_reactions(database: string, schema: string): Promise<reactions> {
    const url = `${getHost()}/api/data_explorer/reactions`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_impressions(database: string, schema: string): Promise<impressions> {
    const url = `${getHost()}/api/data_explorer/impressions`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_combined_metrics(database: string, schema: string): Promise<combinedMetrics> {
    const url = `${getHost()}/api/data_explorer/combined_metrics`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_webinar_data(database: string, schema: string): Promise<webinarMetrics> {
    const url = `${getHost()}/api/data_explorer/get_webinar_metrics`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_status_counts(database: string, schema: string): Promise<statusCounts[]> {
    const url = `${getHost()}/api/data_explorer/get_status_counts`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_customers_overview(database: string, schema: string, days: number): Promise<customersOverview> {
    const url = `${getHost()}/api/data_explorer/get_customers_overview`;
    const headers = { database: database, schema: schema, days: days.toString() };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_country_group(database: string, schema: string): Promise<geoGroup[]> {
    const url = `${getHost()}/api/data_explorer/get_country_group`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_purchase_time(database: string, schema: string): Promise<purchaseTime[]> {
    const url = `${getHost()}/api/data_explorer/get_purchase_time`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_device_type(database: string, schema: string): Promise<deviceType[]> {
    const url = `${getHost()}/api/data_explorer/get_device_type`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }

  async get_browser_type(database: string, schema: string): Promise<browserType[]> {
    const url = `${getHost()}/api/data_explorer/get_browser_type`;
    const headers = { database: database, schema: schema };
    const response = await this.requestsService.get(url, headers);
    return response.json();
  }
}
