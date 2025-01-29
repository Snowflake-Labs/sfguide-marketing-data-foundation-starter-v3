import { ModelUI, TableModel } from 'dtos/ModelUI';
import { findTableModelInModelUI, getAliasFromTableMetadata } from 'utils/MappingModel/ModelUIHelpers';

export function addAliasToTable(model: ModelUI, table: TableModel): TableModel {
  const source = findTableModelInModelUI(table, model) || table;
  const alias = getAliasFromTableMetadata(model, source);
  return { ...source, alias: alias };
}
