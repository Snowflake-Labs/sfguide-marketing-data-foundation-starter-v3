import { ModelUI } from 'dtos/ModelUI';
import { EmptyModel } from './ModelUIMock';
import { addNewTableToMappingModel } from '../ModelUIHelpers';

describe('ModelUpdates addNewTableToMappingModel test', () => {
  test('should add table to mapping model', () => {
    // arrange
    const modelMock = EmptyModel;
    const newTargetTableObject = 'database.schema.myTable';
    const newTargetTableName = 'myTable';
    const newAlias = 'MYT01';
    const database = 'database';
    const schema = 'schema';
    const expectedModel: ModelUI = {
      id: 'model-id',
      name: 'model-name',
      databases: [
        {
          databaseName: 'database',
          schemas: [
            {
              schemaName: 'schema',
              databaseName: 'database',
              tables: [
                {
                  alias: 'MYT01',
                  columns: [],
                  databaseName: 'database',
                  object: 'database.schema.myTable',
                  schemaName: 'schema',
                  tableName: 'myTable',
                  type: 'target',
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = addNewTableToMappingModel(
      modelMock,
      database,
      schema,
      newTargetTableName,
      newTargetTableObject,
      newAlias
    );

    // assert
    expect(result).toEqual(expectedModel);
  });
});
