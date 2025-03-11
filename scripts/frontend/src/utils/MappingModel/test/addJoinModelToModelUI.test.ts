import { JoinTypes } from 'dtos/JoinDefinition';
import { JoinModel, ColumnType, ModelUI, TableModel } from 'dtos/ModelUI';
import { ModelUIMock, ModelWithSourcesAndJoins } from './ModelUIMock';
import { addJoinModelToModelUI } from '../ModelUpdates';

describe('ModelUpdates addJoinModelToModelUI test', () => {
  test('should addJoinModelToModelUI add JoinModel to the ModelUI', () => {
    // arrange
    const modelMock = ModelUIMock;
    const sourceTableMock: TableModel = {
      alias: 'TAB02',
      object: 'database.schema.table02',
      tableName: 'table02',
      databaseName: 'database',
      schemaName: 'schema',
      type: 'source',
      columns: [
        {
          columnName: 'number_column',
          type: ColumnType.NUMBER,
          sqlType: 'NUMBER',
          object: 'database.schema.table02',
        },
      ],
    };
    const joinModelMock: JoinModel = {
      target: {
        alias: 'TAB01',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
      },
      from: {
        alias: 'TAB02',
        object: 'database.schema.table02',
        tableName: 'table02',
        databaseName: 'database',
        schemaName: 'schema',
      },
      to: {
        alias: 'TAB01',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
      },
      type: JoinTypes.INNER,
      on: 'TAB01.number_column = TAB02.number_column',
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
                  alias: 'TAB01',
                  type: 'source',
                  object: 'database.schema.table01',
                  tableName: 'table01',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: 'NUMBER' as ColumnType,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table01',
                    },
                    {
                      columnName: 'varchar_column',
                      type: 'VARCHAR' as ColumnType,
                      sqlType: 'VARCHAR',
                      object: 'database.schema.table01',
                    },
                  ],
                  joins: [
                    {
                      target: {
                        alias: 'TAB01',
                        object: 'database.schema.table01',
                        tableName: 'table01',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      from: {
                        alias: 'TAB02',
                        object: 'database.schema.table02',
                        tableName: 'table02',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      to: {
                        alias: 'TAB01',
                        object: 'database.schema.table01',
                        tableName: 'table01',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      type: JoinTypes.INNER,
                      on: 'TAB01.number_column = TAB02.number_column',
                    },
                  ],
                },
                {
                  alias: 'TAB02',
                  type: 'source',
                  object: 'database.schema.table02',
                  tableName: 'table02',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: 'NUMBER' as ColumnType,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table02',
                    },
                  ],
                },
                {
                  alias: 'TAB03',
                  type: 'source',
                  object: 'database.schema.table03',
                  tableName: 'table03',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'date_column',
                      type: 'DATE' as ColumnType,
                      sqlType: 'DATE',
                      object: 'database.schema.table03',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = addJoinModelToModelUI(modelMock, joinModelMock, sourceTableMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should addJoinModelToModelUI add a JoinModel and a source TableModel to the ModelUI', () => {
    // arrange
    const modelMock = ModelUIMock;
    const sourceTableMock: TableModel = {
      alias: 'NEW04',
      object: 'database.schema.new_table',
      tableName: 'new_table',
      databaseName: 'database',
      schemaName: 'schema',
      type: 'source',
      columns: [],
    };
    const joinModelMock: JoinModel = {
      target: {
        alias: 'TAB01',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
      },
      from: {
        alias: 'NEW04',
        object: 'database.schema.new_table',
        tableName: 'new_table',
        databaseName: 'database',
        schemaName: 'schema',
      },
      to: {
        alias: 'TAB01',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
      },
      type: JoinTypes.INNER,
      on: 'TAB01.number_column = NEW04.number_column',
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
                  alias: 'TAB01',
                  type: 'source',
                  object: 'database.schema.table01',
                  tableName: 'table01',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: 'NUMBER' as ColumnType,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table01',
                    },
                    {
                      columnName: 'varchar_column',
                      type: 'VARCHAR' as ColumnType,
                      sqlType: 'VARCHAR',
                      object: 'database.schema.table01',
                    },
                  ],
                  joins: [
                    {
                      target: {
                        alias: 'TAB01',
                        object: 'database.schema.table01',
                        tableName: 'table01',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      from: {
                        alias: 'NEW04',
                        object: 'database.schema.new_table',
                        tableName: 'new_table',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      to: {
                        alias: 'TAB01',
                        object: 'database.schema.table01',
                        tableName: 'table01',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      type: JoinTypes.INNER,
                      on: 'TAB01.number_column = NEW04.number_column',
                    },
                  ],
                },
                {
                  alias: 'TAB02',
                  type: 'source',
                  object: 'database.schema.table02',
                  tableName: 'table02',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: 'NUMBER' as ColumnType,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table02',
                    },
                  ],
                },
                {
                  alias: 'TAB03',
                  type: 'source',
                  object: 'database.schema.table03',
                  tableName: 'table03',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'date_column',
                      type: 'DATE' as ColumnType,
                      sqlType: 'DATE',
                      object: 'database.schema.table03',
                    },
                  ],
                },
                {
                  alias: 'NEW04',
                  object: 'database.schema.new_table',
                  tableName: 'new_table',
                  databaseName: 'database',
                  schemaName: 'schema',
                  type: 'source',
                  columns: [],
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = addJoinModelToModelUI(modelMock, joinModelMock, sourceTableMock);

    // assert
    expect(result).toEqual(expected);
  });

  test('should addJoinModelToModelUI update JoinModel to the ModelUI', () => {
    // arrange
    const modelMock = ModelWithSourcesAndJoins;
    const sourceTableMock: TableModel = {
      alias: 'TAB02',
      object: 'database.schema.table02',
      tableName: 'table02',
      databaseName: 'database',
      schemaName: 'schema',
      type: 'source',
      columns: [
        {
          columnName: 'number_column',
          type: ColumnType.NUMBER,
          sqlType: 'NUMBER',
          object: 'database.schema.table02',
        },
      ],
    };
    const joinModelMock: JoinModel = {
      target: {
        alias: 'TAB01',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
      },
      from: {
        alias: 'TAB02',
        object: 'database.schema.table02',
        tableName: 'table02',
        databaseName: 'database',
        schemaName: 'schema',
      },
      to: {
        alias: 'TAB01',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
      },
      type: JoinTypes.INNER,
      on: 'TAB01.number_column != TAB02.number_column',
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
                  alias: 'TAB01',
                  type: 'source',
                  object: 'database.schema.table01',
                  tableName: 'table01',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: 'NUMBER' as ColumnType,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table01',
                    },
                  ],
                  joins: [
                    {
                      target: {
                        alias: 'TAB01',
                        object: 'database.schema.table01',
                        tableName: 'table01',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      from: {
                        alias: 'TAB02',
                        object: 'database.schema.table02',
                        tableName: 'table02',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      to: {
                        alias: 'TAB01',
                        object: 'database.schema.table01',
                        tableName: 'table01',
                        databaseName: 'database',
                        schemaName: 'schema',
                      },
                      type: JoinTypes.INNER,
                      on: 'TAB01.number_column != TAB02.number_column',
                    },
                  ],
                },
                {
                  alias: 'TAB02',
                  type: 'source',
                  object: 'database.schema.table02',
                  tableName: 'table02',
                  databaseName: 'database',
                  schemaName: 'schema',
                  columns: [
                    {
                      columnName: 'number_column',
                      type: 'NUMBER' as ColumnType,
                      sqlType: 'NUMBER',
                      object: 'database.schema.table02',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    // act
    const result = addJoinModelToModelUI(modelMock, joinModelMock, sourceTableMock);

    // assert
    expect(result).toEqual(expected);
  });
});
