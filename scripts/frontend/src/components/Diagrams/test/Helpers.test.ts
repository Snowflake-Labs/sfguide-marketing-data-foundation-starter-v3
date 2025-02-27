import { ColumnRelation, ColumnType, MappingType, TableModel } from 'dtos/ModelUI';
import { DefaultMappingEdgeProps, MappingEdge } from '../Edges/EdgeTypes';
import { getTableModelFromDropEvent, loadMappingEdges } from '../Helpers';
import { ModelUIMock } from 'utils/MappingModel/test/ModelUIMock';

describe('Helpers test', () => {
  test('should load edges from column transformation', () => {
    // arrange
    const relations: ColumnRelation[] = [
      {
        sources: [
          {
            columnName: 'column_source',
            object: 'db.sch.source',
          },
        ],
        target: {
          columnName: 'column_target',
          object: 'db.sch.target',
        },
        type: MappingType.Column,
        mapping: 'column_source',
      },
    ];
    const expected: MappingEdge[] = [
      {
        ...DefaultMappingEdgeProps,
        id: 'db.sch.source.column_source-db.sch.target.column_target',
        source: 'db.sch.source',
        sourceHandle: 'db.sch.source.column_source',
        target: 'db.sch.target',
        targetHandle: 'db.sch.target.column_target',
        type: 'mapping-edge',
      },
    ];

    // act
    const result = loadMappingEdges(relations);

    // assert
    expect(result).toEqual(expected);
  });

  test('should load edges from formula transformation', () => {
    // arrange
    const relations: ColumnRelation[] = [
      {
        sources: [
          {
            columnName: 'column_source_1',
            object: 'db.sch.source1',
          },
          {
            columnName: 'column_source_2',
            object: 'db.sch.source2',
          },
        ],
        target: {
          columnName: 'column_target',
          object: 'db.sch.target',
        },
        type: MappingType.Formula,
        mapping: 'ADD(column_source_1, column_source_2)',
      },
    ];
    const expected: MappingEdge[] = [
      {
        ...DefaultMappingEdgeProps,
        id: '..formula-ADD(column_source_1, column_source_2)-source.handler-db.sch.target.column_target',
        source: '..formula-ADD(column_source_1, column_source_2)',
        sourceHandle: '..formula-ADD(column_source_1, column_source_2)-source.handler',
        target: 'db.sch.target',
        targetHandle: 'db.sch.target.column_target',
        type: 'mapping-edge',
      },
      {
        ...DefaultMappingEdgeProps,
        id: 'db.sch.source1.column_source_1-..formula-ADD(column_source_1, column_source_2)-target.handler',
        source: 'db.sch.source1',
        sourceHandle: 'db.sch.source1.column_source_1',
        target: '..formula-ADD(column_source_1, column_source_2)',
        targetHandle: '..formula-ADD(column_source_1, column_source_2)-target.handler',
        type: 'mapping-edge',
      },
      {
        ...DefaultMappingEdgeProps,
        id: 'db.sch.source2.column_source_2-..formula-ADD(column_source_1, column_source_2)-target.handler',
        source: 'db.sch.source2',
        sourceHandle: 'db.sch.source2.column_source_2',
        target: '..formula-ADD(column_source_1, column_source_2)',
        targetHandle: '..formula-ADD(column_source_1, column_source_2)-target.handler',
        type: 'mapping-edge',
      },
    ];

    // act
    const result = loadMappingEdges(relations);

    // assert
    expect(result).toEqual(expected);
  });

  test('should load edges from static transformation', () => {
    // arrange
    const relations: ColumnRelation[] = [
      {
        sources: [],
        target: {
          columnName: 'column_target',
          object: 'db.sch.target',
        },
        type: MappingType.Static,
        mapping: 'column_source',
      },
    ];
    const expected: MappingEdge[] = [
      {
        ...DefaultMappingEdgeProps,
        id: '..static.column_source-db.sch.target.column_target',
        source: '..static',
        sourceHandle: '..static.column_source',
        target: 'db.sch.target',
        targetHandle: 'db.sch.target.column_target',
        type: 'mapping-edge',
      },
    ];

    // act
    const result = loadMappingEdges(relations);

    // assert
    expect(result).toEqual(expected);
  });

  test('should load edges from variable transformation', () => {
    // arrange
    const relations: ColumnRelation[] = [
      {
        sources: [],
        target: {
          columnName: 'column_target',
          object: 'db.sch.target',
        },
        type: MappingType.Variable,
        mapping: 'column_source',
      },
    ];
    const expected: MappingEdge[] = [
      {
        ...DefaultMappingEdgeProps,
        id: '..variable.column_source-db.sch.target.column_target',
        source: '..variable',
        sourceHandle: '..variable.column_source',
        target: 'db.sch.target',
        targetHandle: 'db.sch.target.column_target',
        type: 'mapping-edge',
      },
    ];

    // act
    const result = loadMappingEdges(relations);

    // assert
    expect(result).toEqual(expected);
  });

  test('should getTableModelFromDropEvent return table with alias', () => {
    // arrange
    const event: any = {
      dataTransfer: {
        getData: jest.fn().mockReturnValueOnce('database.schema.table01').mockReturnValueOnce('left'),
      },
    };
    const sources: TableModel[] = [
      {
        alias: '',
        type: 'source',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [],
      },
    ];
    const model = ModelUIMock;
    const expected = {
      table: {
        alias: 'TAB01',
        type: 'source',
        object: 'database.schema.table01',
        tableName: 'table01',
        databaseName: 'database',
        schemaName: 'schema',
        columns: [
          {
            columnName: 'number_column',
            type: ColumnType.NUMBER,
            sqlType: 'NUMBER',
            object: 'database.schema.table01',
          },
          {
            columnName: 'varchar_column',
            type: ColumnType.VARCHAR,
            sqlType: 'VARCHAR',
            object: 'database.schema.table01',
          },
        ],
      },

      nodeType: 'source',
    };

    // act
    const result = getTableModelFromDropEvent(event, sources, model);

    // assert
    expect(result).toEqual(expected);
  });
});
