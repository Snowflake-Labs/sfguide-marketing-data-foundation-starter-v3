import { IMenuItem } from 'components/CustomSelect/CustomSelect';
import { ICustomTableProps } from 'components/CustomTable/CustomTable';
import { ColumnSchemaInfoTable } from 'dtos/ColumnSchemaInfoTable';
import Source from 'dtos/Source';

export interface IDatabaseService {
  getColumnsSchemaInformation(model_id: string, sourceId: string): Promise<ColumnSchemaInfoTable[]>;
  getDatabases(): Promise<IMenuItem[]>;
  getSchemasByDatabase(databaseSelected: string): Promise<IMenuItem[]>;
  postSaveSource(source: Source): Promise<{ newCustomTable: ICustomTableProps; newSource: Source }>;
}
