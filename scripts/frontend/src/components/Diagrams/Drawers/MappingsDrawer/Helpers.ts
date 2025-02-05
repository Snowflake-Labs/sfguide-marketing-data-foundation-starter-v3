import { ModelUI } from 'dtos/ModelUI';
import { columnByAliasAndColumnName } from 'utils/MappingModel/ModelUIHelpers';
import { ColumnTransformationMetadata } from './ColumnTransformationMetadata';

export default function getColumnsUsedInFormula(value: string | undefined, model: ModelUI) {
  if (value === undefined) return;

  const regex = /([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/g;

  let matches;
  const columns = [];
  while ((matches = regex.exec(value)) !== null) {
    const columnModel = columnByAliasAndColumnName(matches[1], matches[2], model);
    if (!columnModel) continue;
    columns.push({ object: columnModel.object, columnName: matches[2] });
  }

  const columnMapping: ColumnTransformationMetadata = {
    transformation: value,
    columns,
  };
  return columnMapping;
}
