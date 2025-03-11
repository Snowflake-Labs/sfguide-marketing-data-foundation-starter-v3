import { IMenuItem } from 'components/CustomSelect/CustomSelect';
import { JoinQuery } from 'dtos/JoinQuery';
import { TableModel } from 'dtos/ModelUI';

export function getColumnsOptionsOfTable(table: TableModel, tableMatch: string): IMenuItem[] {
  const options: IMenuItem[] =
    table.columns.map((column) => ({
      value: column.columnName,
      label: column.columnName,
    })) ?? [];
  return options;
}

export function buildSqlQuery(query: JoinQuery): string {
  return `${query.clauses
    .map(
      (clause) =>
        (clause.condition ? `${clause.condition}\n` : '') +
        `${query.source?.alias}.${clause.sourceColumn} ${clause.relation} ${query.target?.alias}.${clause.targetColumn}`
    )
    .join('\n')}`;
}
