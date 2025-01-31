import 'reflect-metadata';
import { addAliasToTable } from './Helpers';
import { ModelUIMock } from 'utils/MappingModel/test/ModelUIMock';
import { ColumnType, TableModel } from 'dtos/ModelUI';

describe('Helpers test', () => {
  test('should addAliasToTable return table already in Model', () => {
    // arrange
    const modelMock = ModelUIMock;
    const tableMock: TableModel = {
      alias: '',
      type: 'source',
      object: 'database.schema.table01',
      tableName: 'table01',
      databaseName: 'database',
      schemaName: 'schema',
      columns: [],
    };
    const expected: TableModel = {
      alias: 'TAB01',
      type: 'source',
      object: 'database.schema.table01',
      tableName: 'table01',
      databaseName: 'database',
      schemaName: 'schema',
      columns: [
        {
          columnName: 'number_column',
          type: ColumnType.NUMBER,
          sqlType: 'NUMBER',
          object: 'database.schema.table01',
        },
        {
          columnName: 'varchar_column',
          type: ColumnType.VARCHAR,
          sqlType: 'VARCHAR',
          object: 'database.schema.table01',
        },
      ],
    };

    // act
    const result = addAliasToTable(modelMock, tableMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should addAliasToTable return table in Model', () => {
    // arrange
    const modelMock = ModelUIMock;
    const tableMock: TableModel = {
      alias: '',
      type: 'source',
      object: 'database.schema.new_table',
      tableName: 'new_table',
      databaseName: 'database',
      schemaName: 'schema',
      columns: [],
    };
    const expected: TableModel = {
      alias: 'NEW04',
      type: 'source',
      object: 'database.schema.new_table',
      tableName: 'new_table',
      databaseName: 'database',
      schemaName: 'schema',
      columns: [],
    };

    // act
    const result = addAliasToTable(modelMock, tableMock);

    // assert
    expect(result).toEqual(expected);
  });
});
