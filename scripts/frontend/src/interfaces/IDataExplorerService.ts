import {
  combinedMetrics,
  reactions,
  spend,
  impressions,
  webinarMetrics,
  customersOverview,
  geoGroup,
  purchaseTime,
  deviceType,
  browserType,
  statusCounts,
} from 'dtos/DataExplorer';

export interface IDataExplorerService {
  get_spend(database: string, schema: string): Promise<spend>;
  get_reactions(database: string, schema: string): Promise<reactions>;
  get_combined_metrics(database: string, schema: string): Promise<combinedMetrics>;
  get_impressions(database: string, schema: string): Promise<impressions>;
  get_webinar_data(database: string, schema: string): Promise<webinarMetrics>;
  get_status_counts(database: string, schema: string): Promise<statusCounts[]>;
  get_customers_overview(database: string, schema: string, days: number): Promise<customersOverview>;
  get_country_group(database: string, schema: string): Promise<geoGroup[]>;
  get_purchase_time(database: string, schema: string): Promise<purchaseTime[]>;
  get_device_type(database: string, schema: string): Promise<deviceType[]>;
  get_browser_type(database: string, schema: string): Promise<browserType[]>;
}
