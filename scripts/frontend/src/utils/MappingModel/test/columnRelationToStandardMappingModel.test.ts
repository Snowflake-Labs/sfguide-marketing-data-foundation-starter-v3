import 'reflect-metadata';
import { ColumnRelation, ColumnType, MappingType, ModelUI } from 'dtos/ModelUI';
import { ModelUIMockWithMappings } from './ModelUIMock';
import { columnRelationToStandardMappingModel } from '../ModelValidations';
import { StandardMappingModel } from 'dtos/StandardMappingModel';
import { NullType } from 'dtos/NullType';
import { JoinTypes } from 'dtos/JoinDefinition';

describe('ModelValidations columnRelationToStandardMappingModel test', () => {
  test('should support simple one on one column mappings', () => {
    // arrange
    const modelMock = ModelUIMockWithMappings;
    const columnRelation: ColumnRelation = {
      sources: [
        {
          columnName: NullType,
          object: NullType,
        },
      ],
      target: {
        columnName: 'static_col',
        object: 'database.schema.table01',
      },
      type: MappingType.Static,
      mapping: 'static_value',
    };
    const expected: StandardMappingModel = {
      targets: [
        {
          process_name: '',
          process_type_id: 3,
          labels: [''],
          target: {
            alias: 'TAB01',
            object: 'database.schema.table01',
            columns: [{ name: 'static_col', type: 'VARCHAR' }],
          },
          settings: { target_interval: '', target_lag: 0, warehouse: '' },
          definitions: [
            {
              columns: ['static_value'],
              source: { alias: '', object: '' },
              join: [],
            },
          ],
        },
      ],
    };

    // act
    const result = columnRelationToStandardMappingModel(columnRelation, modelMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should convert a ColumnRelation object to a StandardMappingModel object', () => {
    const mapModel: ColumnRelation = {
      target: {
        object: 'db.schema.table1',
        columnName: 'column1',
      },
      sources: [
        {
          object: 'db.schema.table1',
          columnName: 'column1',
        },
        {
          object: 'db.schema.table2',
          columnName: 'column2',
        },
      ],
      mapping: 'column1 = column2',
      type: MappingType.Column,
    };

    const model: ModelUI = {
      databases: [
        {
          databaseName: 'db',
          schemas: [
            {
              schemaName: 'schema',
              tables: [
                {
                  type: 'target',
                  columns: [
                    {
                      columnName: 'column1',
                      object: 'db.schema.table1.column1',
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
                  type: 'source',
                  columns: [
                    {
                      columnName: 'column2',
                      object: 'db.schema.table2.column2',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                    },
                  ],
                  alias: '',
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

    const expected: StandardMappingModel = {
      targets: [
        {
          process_name: '',
          process_type_id: 3,
          labels: [''],
          settings: { target_interval: '', target_lag: 0, warehouse: '' },
          target: {
            alias: '',
            object: 'db.schema.table1',
            columns: [
              {
                name: 'column1',
                type: 'VARCHAR',
              },
            ],
          },
          definitions: [
            {
              columns: ['column1 = column2'],
              source: {
                alias: '',
                object: 'db.schema.table1',
              },
              join: [
                {
                  alias: '',
                  object: 'db.schema.table2',
                  on: 'db.schema.table2',
                  type: JoinTypes.INNER,
                },
              ],
            },
          ],
        },
      ],
    };

    const result = columnRelationToStandardMappingModel(mapModel, model);

    expect(result).toEqual(expected);
  });

  test('should return undefined if the target table or column is not found', () => {
    const mapModel: ColumnRelation = {
      target: {
        object: 'db.schema.table1',
        columnName: 'column1',
      },
      sources: [
        {
          object: 'db.schema.table2',
          columnName: 'column2',
        },
      ],
      mapping: 'column1 = column2',
      type: MappingType.Column,
    };

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
                      columnName: 'column2',
                      object: 'db.schema.table2.column2',
                      type: ColumnType.VARCHAR,
                      sqlType: 'VARCHAR',
                    },
                  ],
                  alias: '',
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

    const result = columnRelationToStandardMappingModel(mapModel, model);

    expect(result).toBeUndefined();
  });
});
