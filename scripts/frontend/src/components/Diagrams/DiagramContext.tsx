import { createContext, ReactNode, useMemo, useContext, useEffect, useState } from 'react';
import { MappingNode, OnChange } from './Nodes/NodeTypes';
import { useEditMappingContext } from 'contexts/MappingContext/EditMappingContext';
import { buildNodesFromTables, loadJoinEdges, loadMappingEdges } from './Helpers';
import { MappingEdge } from './Edges/EdgeTypes';
import { useEdgesState, useNodesState, NodeChange, EdgeChange, Edge } from 'reactflow';
import { getSpecialTableSourcesFromMappings } from 'utils/MappingModel/ModelUIHelpers';
import { updateColumnMappingsHighlight, UpdateEdgesHighlight } from 'components/Mappings/Helpers';
import { useMappingContext } from 'contexts/MappingContext/MappingContext';

type DiagramContext = {
  nodes: MappingNode[];
  edges: MappingEdge[];
  setNodes: React.Dispatch<React.SetStateAction<MappingNode[]>>;
  onNodesChange: OnChange<NodeChange>;
  setEdges: React.Dispatch<React.SetStateAction<MappingEdge[]>>;
  onEdgesChange: OnChange<EdgeChange>;
  selectedEdge?: Edge;
  isEdgeSelected: boolean;
  setGhostNode: React.Dispatch<React.SetStateAction<MappingNode | undefined>>;
};

const defaultContext: DiagramContext = {
  nodes: [],
  edges: [],
  setNodes: () => undefined,
  onNodesChange: () => undefined,
  setEdges: () => undefined,
  onEdgesChange: () => undefined,
  selectedEdge: undefined,
  isEdgeSelected: false,
  setGhostNode: () => undefined,
};

const DiagramContext = createContext<DiagramContext>(defaultContext);

interface Props {
  children: ReactNode;
}

export function DiagramContextWrapper(props: Props) {
  const { sources, target, selectedColumn } = useEditMappingContext();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isEdgeSelected, setIsEdgeSelected] = useState(false);
  const [ghostNode, setGhostNode] = useState<MappingNode>();
  const { sourceDatabaseSchema } = useMappingContext();

  const loadNodes = () => {
    const targets = target ? [target] : [];
    const nodes = [...sources, ...targets, ...getSpecialTableSourcesFromMappings(targets, sourceDatabaseSchema)];
    const tableNodes: MappingNode[] = buildNodesFromTables(nodes, target);
    if (ghostNode) tableNodes.push(ghostNode);
    setNodes(tableNodes);
  };

  const loadEdges = () => {
    if (!target?.mappings) return;
    const mappingEdges = loadMappingEdges(target.mappings);
    const joinEdges = loadJoinEdges(sources, target);
    setEdges([...mappingEdges, ...joinEdges]);
  };

  useEffect(() => {
    const selectedEdge = edges.find((edge) => edge.selected);
    if (selectedEdge?.type == 'join-edge') return;
    const isEdgeSelected = selectedEdge !== undefined;
    setIsEdgeSelected(isEdgeSelected);
    if (isEdgeSelected) {
      const updatedEdges = UpdateEdgesHighlight(edges, selectedEdge);
      setEdges(updatedEdges);
    }
  }, [edges]);

  useEffect(() => {
    if (selectedColumn) {
      const resetEdges = edges.map((edge) => ({ ...edge, selected: false }));
      const updatedEdges = updateColumnMappingsHighlight(resetEdges, selectedColumn);
      setEdges(updatedEdges);
    }
  }, [selectedColumn]);

  useEffect(() => {
    if (!target) return;
    loadNodes();
    loadEdges();
  }, [sources]);

  useEffect(() => {
    if (ghostNode) setNodes((nodes) => nodes.concat(ghostNode));
    else setNodes((nodes) => nodes.filter((node) => !node.type?.includes('ghost')));
  }, [ghostNode]);

  const sharedState: DiagramContext = useMemo(
    () => ({
      nodes,
      edges,
      setNodes,
      onNodesChange,
      setEdges,
      onEdgesChange,
      isEdgeSelected,
      setGhostNode,
    }),
    [nodes, edges, isEdgeSelected]
  );

  return <DiagramContext.Provider value={sharedState}>{props.children}</DiagramContext.Provider>;
}

export function useDiagramContext() {
  return useContext(DiagramContext);
}
