import Source from 'dtos/Source';

export interface IDataSourcesService {
  getSource(sourceId: string): Promise<Source>;
  getExistingSources(): Promise<Source[]>;
  deleteExistingSources(rowsToDelete: Source[]): Promise<string>;
}
