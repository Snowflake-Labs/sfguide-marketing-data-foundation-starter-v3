import { ModelUI, TableModel } from 'dtos/ModelUI';
import { addTableModelToModelUI } from '../ModelUIHelpers';

describe('MappingModelHelpers addTableModelToMappingModel test', () => {
  test('should addTableModelToMappingModel when no database nor schema exists', () => {
    // arrange
    const modelMock: ModelUI = {
      id: 'model-id',
      name: 'model-name',
      databases: [],
    };
    const tableModelMock: TableModel = {
      type: 'source',
      columns: [],
      alias: 'SAM01',
      object: 'database.schema.sample01',
      tableName: 'sample01',
      schemaName: 'schema',
      databaseName: 'database',
    };
    const expected: ModelUI = {
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
                  type: 'source',
                  columns: [],
                  alias: 'SAM01',
                  object: 'database.schema.sample01',
                  tableName: 'sample01',
                  schemaName: 'schema',
                  databaseName: 'database',
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = addTableModelToModelUI(modelMock, tableModelMock);

    // assert
    expect(result).toEqual(expected);
  });
});
