import { Edge } from 'reactflow';
import { updateColumnMappingsHighlight } from '../Helpers';
import { EdgesMock } from './MappingsMock';
import { ColumnModel, ColumnType } from 'dtos/ModelUI';
import { DefaultMappingEdgeProps } from 'components/Diagrams/Edges/EdgeTypes';

describe('Mappings test', () => {
  test('Should update column mappings', () => {
    const edges: Edge[] = EdgesMock;
    const selectedColumn: ColumnModel = {
      type: ColumnType.BOOLEAN,
      sqlType: 'BOOLEAN',
      columnName: 'targetCol2',
      object: '..target',
    };

    const expected: Edge[] = [
      {
        id: 'edge-1',
        source: 'source',
        sourceHandle: '..source.sourceCol1',
        target: 'target',
        targetHandle: '..target.targetCol1',
        type: 'mapping-edge',
      },
      {
        id: 'edge-2',
        source: 'source',
        sourceHandle: '..source.sourceCol2',
        target: 'target',
        targetHandle: '..target.targetCol2',
        type: 'mapping-edge',
        selected: true,
      },
      {
        id: 'edge-3',
        source: 'source',
        sourceHandle: '..source.sourceCol3',
        target: 'target',
        targetHandle: '..target.targetCol3',
        type: 'mapping-edge',
      },
      {
        id: 'edge-4',
        source: 'source',
        sourceHandle: '..source.sourceCol4',
        target: 'target',
        targetHandle: '..target.targetCol4',
        type: 'mapping-edge',
      },
      {
        id: 'edge-5',
        source: 'source',
        sourceHandle: '..source.sourceCol5',
        target: 'target',
        targetHandle: '..target.targetCol5',
        type: 'mapping-edge',
      },
      {
        id: 'edge-6',
        source: 'source',
        sourceHandle: '..source.sourceCol6',
        target: 'target',
        targetHandle: '..target.targetCol6',
        type: 'mapping-edge',
      },
    ];

    // act
    const result = updateColumnMappingsHighlight(edges, selectedColumn);

    // assert
    expect(result).toEqual(expected);
  });
});
