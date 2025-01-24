import { MappingType, TableModel } from 'dtos/ModelUI';
import { getSpecialTableSourcesFromMappings } from '../ModelUIHelpers';

describe('getSpecialTableSourcesFromMappings', () => {
  it('should return an array of TableModel objects with special table sources', () => {
    const targetTables: TableModel[] = [
      {
        type: 'target',
        columns: [],
        alias: '',
        object: 'database.schema.table',
        tableName: 'table',
        schemaName: 'schema',
        databaseName: 'database',
        mappings: [
          {
            type: MappingType.Formula,
            mapping: 'formula1',
            sources: [
              {
                object: 'database.schema.source1',
                columnName: '',
              },
            ],
            target: {
              columnName: 'column1',
              object: 'database.schema.table',
            },
          },
          {
            type: MappingType.Formula,
            mapping: 'formula2',
            sources: [
              {
                object: 'database.schema.source2',
                columnName: '',
              },
            ],
            target: {
              columnName: 'column2',
              object: 'database.schema.table',
            },
          },
          {
            type: MappingType.Static,
            mapping: 'static1',
            sources: [{ object: 'database.schema', columnName: 'static1' }],
            target: {
              columnName: 'static1',
              object: 'database.schema.table',
            },
          },
        ],
      },
    ];

    const sourceDatabaseSchema = 'database.schema';

    const expectedSources = [
      {
        type: 'formula',
        columns: [],
        alias: '',
        object: '..formula-formula1',
        tableName: 'formula-formula1',
        schemaName: '',
        databaseName: '',
      },
      {
        type: 'formula',
        columns: [],
        alias: '',
        object: '..formula-formula2',
        tableName: 'formula-formula2',
        schemaName: '',
        databaseName: '',
      },
      {
        type: 'static',
        columns: [
          {
            type: 'NULL',
            sqlType: 'NULL',
            columnName: 'static1',
            object: '..static',
          },
        ],
        alias: '',
        object: '..static',
        tableName: 'static',
        schemaName: '',
        databaseName: '',
      },
    ];

    const result = getSpecialTableSourcesFromMappings(targetTables, sourceDatabaseSchema);

    expect(result).toEqual(expectedSources);
  });

  it('should return an empty array if there are no special table sources', () => {
    const targetTables: TableModel[] = [
      {
        type: 'target',
        columns: [],
        alias: '',
        object: 'database.schema.table',
        tableName: 'table',
        schemaName: 'schema',
        databaseName: 'database',
        mappings: [
          {
            type: MappingType.Column,
            mapping: 'column1',
            sources: [
              {
                object: 'database.schema.source1',
                columnName: '',
              },
            ],
            target: {
              columnName: 'column1',
              object: 'database.schema.table',
            },
          },
          {
            type: MappingType.Column,
            mapping: 'column2',
            sources: [
              {
                object: 'database.schema.source2',
                columnName: '',
              },
            ],
            target: {
              columnName: 'column2',
              object: 'database.schema.table',
            },
          },
        ],
      },
    ];

    const sourceDatabaseSchema = 'database.schema';

    const expectedSources: TableModel[] = [];

    const result = getSpecialTableSourcesFromMappings(targetTables, sourceDatabaseSchema);

    expect(result).toEqual(expectedSources);
  });
});
