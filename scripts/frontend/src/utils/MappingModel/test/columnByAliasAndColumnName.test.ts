import { ColumnType, ModelUI } from 'dtos/ModelUI';
import { columnByAliasAndColumnName } from '../ModelUIHelpers';

describe('columnByAliasAndColumnName', () => {
  test('should return the column if found', () => {
    // arrange
    const alias = 'testAlias';
    const columnName = 'testColumn';
    const model: ModelUI = {
      databases: [
        {
          databaseName: 'testDatabase',
          schemas: [
            {
              schemaName: 'testSchema',
              tables: [
                {
                  type: 'source',
                  columns: [
                    {
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                      columnName: 'testColumn',
                      object: 'testObject',
                    },
                  ],
                  alias: 'testAlias',
                  object: 'testObject',
                  tableName: 'testTable',
                  schemaName: 'testSchema',
                  databaseName: 'testDatabase',
                },
              ],
              databaseName: 'testDatabase',
            },
          ],
        },
      ],
      id: 'testId',
      name: 'testName',
    };

    // act
    const result = columnByAliasAndColumnName(alias, columnName, model);

    // assert
    expect(result).toEqual({
      type: ColumnType.VARCHAR,
      sqlType: 'VARCHAR',
      columnName: 'testColumn',
      object: 'testObject',
    });
  });

  test('should return undefined if column not found', () => {
    // arrange
    const alias = 'testAlias';
    const columnName = 'nonExistentColumn';
    const model: ModelUI = {
      databases: [
        {
          databaseName: 'testDatabase',
          schemas: [
            {
              schemaName: 'testSchema',
              tables: [
                {
                  type: 'source',
                  columns: [
                    {
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                      columnName: 'testColumn',
                      object: 'testObject',
                    },
                  ],
                  alias: 'testAlias',
                  object: 'testObject',
                  tableName: 'testTable',
                  schemaName: 'testSchema',
                  databaseName: 'testDatabase',
                },
              ],
              databaseName: 'testDatabase',
            },
          ],
        },
      ],
      id: 'testId',
      name: 'testName',
    };

    // act
    const result = columnByAliasAndColumnName(alias, columnName, model);

    // assert
    expect(result).toBeUndefined();
  });
});
