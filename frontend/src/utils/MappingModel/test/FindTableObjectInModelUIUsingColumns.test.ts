import { ColumnMetadata, ModelUI, TableModel } from 'dtos/ModelUI';
import { findTableObjectInModelUIUsingColumns } from '../ModelUIHelpers';

describe('FindTableObjectInModelUIUsingColumns', () => {
  test('should return the correct table object', () => {
    const columns: ColumnMetadata[] = [
      {
        columnName: 'column1',
        object: 'db.schema.table1',
      },
      {
        columnName: 'column2',
        object: 'db.schema.table2',
      },
    ];

    const model: ModelUI = {
      databases: [
        {
          databaseName: 'db',
          schemas: [
            {
              schemaName: 'schema',
              tables: [
                {
                  type: 'source',
                  columns: [],
                  alias: 'obj1',
                  object: 'db.schema.table1',
                  tableName: 'table1',
                  schemaName: 'schema',
                  databaseName: 'db',
                },
                {
                  type: 'source',
                  columns: [],
                  alias: 'obj2',
                  object: 'db.schema.table2',
                  tableName: 'table2',
                  schemaName: 'schema',
                  databaseName: 'db',
                },
              ],
              databaseName: 'db',
            },
          ],
        },
      ],
      id: 'id',
      name: 'name',
    };

    const expectedTable: TableModel = {
      type: 'source',
      columns: [],
      alias: 'obj1',
      object: 'db.schema.table1',
      tableName: 'table1',
      schemaName: 'schema',
      databaseName: 'db',
    };

    const result = findTableObjectInModelUIUsingColumns(columns, model);

    expect(result).toEqual(expectedTable);
  });

  test('should return undefined if table object is not found', () => {
    const columns: ColumnMetadata[] = [
      {
        columnName: 'column1',
        object: 'db.schema.table3',
      },
      {
        columnName: 'column2',
        object: 'db.schema.table4',
      },
    ];

    const model: ModelUI = {
      databases: [
        {
          databaseName: 'db',
          schemas: [
            {
              schemaName: 'schema',
              tables: [
                {
                  type: 'source',
                  columns: [],
                  alias: 'obj1',
                  object: 'db.schema.table1',
                  tableName: 'table1',
                  schemaName: 'schema',
                  databaseName: 'db',
                },
                {
                  type: 'source',
                  columns: [],
                  alias: 'obj2',
                  object: 'db.schema.table2',
                  tableName: 'table2',
                  schemaName: 'schema',
                  databaseName: 'db',
                },
              ],
              databaseName: 'db',
            },
          ],
        },
      ],
      id: 'id',
      name: 'name',
    };

    const result = findTableObjectInModelUIUsingColumns(columns, model);

    expect(result).toBeUndefined();
  });
});
