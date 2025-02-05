import { Position } from 'dtos/ModelUI';

export function saveNodePosition(object: string, targetObject: string, position: Position) {
  localStorage.setItem(getNodePositionId(object, targetObject), JSON.stringify(position));
}

export function getNodePosition(object: string, targetObject: string): Position | undefined {
  const position = localStorage.getItem(getNodePositionId(object, targetObject));
  return position ? JSON.parse(position) : undefined;
}

function getNodePositionId(object: string, targetObject: string) {
  return `nodePosition-${object}-${targetObject}`;
}
