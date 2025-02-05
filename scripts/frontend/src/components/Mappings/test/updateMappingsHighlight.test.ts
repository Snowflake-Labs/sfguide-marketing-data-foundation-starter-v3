import { Edge } from 'reactflow';
import { UpdateEdgesHighlight } from '../Helpers';
import { EdgeSampleMock, EdgesMock } from './MappingsMock';

describe('Mappings test', () => {
  test('Should update mappings highlight', () => {
    const edges: Edge[] = EdgesMock;
    const edge: Edge = EdgeSampleMock;

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
    const result = UpdateEdgesHighlight(edges, edge);

    // assert
    expect(result).toEqual(expected);
  });
});
