import { ColumnMetadata, ColumnType, ModelUI } from 'dtos/ModelUI';
import { mapColumnsToProcessDefinitionJoins } from '../ModelUIHelpers';

describe('mapColumnsToProcessDefinitionJoins', () => {
  it('should return an array of ProcessDefinitionJoin objects', () => {
    const columns = [
      {
        columnName: 'column1',
        object: 'db.schema.table1.column1',
        type: ColumnType.VARCHAR,
        sqlType: 'VARCHAR',
      },
      {
        columnName: 'column3',
        object: 'db.schema.table3.column3',
        type: ColumnType.VARCHAR,
        sqlType: 'VARCHAR',
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
                  columns: [
                    {
                      columnName: 'column1',
                      object: 'db.schema.table1.column1',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                    },
                    {
                      columnName: 'column2',
                      object: 'db.schema.table2.column2',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                    },
                  ],
                  alias: '',
                  object: 'db.schema.table1',
                  tableName: 'table1',
                  schemaName: 'schema',
                  databaseName: 'db',
                },
                {
                  type: 'target',
                  columns: [
                    {
                      columnName: 'column3',
                      object: 'db.schema.table3.column3',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                    },
                  ],
                  alias: '',
                  object: 'db.schema.table3',
                  tableName: 'table3',
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

    const expected = [
      {
        alias: '',
        object: 'db.schema.table1',
        on: 'db.schema.table1',
        type: 'INNER',
      },
      {
        alias: '',
        object: 'db.schema.table3',
        on: 'db.schema.table3',
        type: 'INNER',
      },
    ];

    const result = mapColumnsToProcessDefinitionJoins(columns, model);

    expect(result).toMatchObject(expected);
  });

  it('should return an empty array if no matching tables are found', () => {
    const columns: ColumnMetadata[] = [
      { columnName: 'column1', object: 'db.schema.table1.column1' },
      { columnName: 'column2', object: 'db.schema.table2.column2' },
      { columnName: 'column3', object: 'db.schema.table3.column3' },
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
                  columns: [
                    {
                      columnName: 'column4',
                      object: 'db.schema.table4.column4',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                    },
                    {
                      columnName: 'column5',
                      object: 'db.schema.table5.column5',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                    },
                  ],
                  alias: 'alias',
                  object: 'db.schema.table4',
                  tableName: 'table4',
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

    const expected: any[] = [];

    const result = mapColumnsToProcessDefinitionJoins(columns, model);

    expect(result).toEqual(expected);
  });
});
