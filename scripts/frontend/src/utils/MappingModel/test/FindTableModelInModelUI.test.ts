import { ModelUI, TableMetadata } from 'dtos/ModelUI';
import { findTableModelInModelUI, mapColumnsToProcessDefinitionJoins } from '../ModelUIHelpers';

describe('FindTableModelInModelUI', () => {
  test('should return the correct table model', () => {
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

    const table: TableMetadata = {
      alias: 'obj1',
      object: 'db.schema.table1',
      tableName: 'table1',
      schemaName: 'schema',
      databaseName: 'db',
    };

    const result = findTableModelInModelUI(table, model);

    expect(result).toEqual({
      type: 'source',
      columns: [],
      alias: 'obj1',
      object: 'db.schema.table1',
      tableName: 'table1',
      schemaName: 'schema',
      databaseName: 'db',
    });
  });
});
