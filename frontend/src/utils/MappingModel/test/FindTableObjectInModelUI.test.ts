import { ModelUI, TableModel } from 'dtos/ModelUI';
import { findTableObjectInModelUI } from '../ModelUIHelpers';

describe('findTableObjectInModelUI', () => {
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
                type: 'target',
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

  test('should return the correct table object', () => {
    const tableObject = 'db.schema.table1';
    const expectedTable: TableModel = {
      type: 'source',
      columns: [],
      alias: 'obj1',
      object: 'db.schema.table1',
      tableName: 'table1',
      schemaName: 'schema',
      databaseName: 'db',
    };

    const result = findTableObjectInModelUI(tableObject, model);

    expect(result).toEqual(expectedTable);
  });

  test('should return undefined if table object is not found', () => {
    const tableObject = 'db.schema.table3';

    const result = findTableObjectInModelUI(tableObject, model);

    expect(result).toBeUndefined();
  });
});
