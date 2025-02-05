import { useSelectedEdge } from './useSelectedEdge';
import { EventData } from 'dtos/EventData';
import { mockPubSubService } from 'JestTest/mocks/mockPubSubService';
import { EdgeProps, Position } from 'reactflow';
import { waitFor } from '@testing-library/dom';

describe('useSelectedEdge', () => {
  const mockProps: EdgeProps = {
    id: "..formula-CONCAT('TEST_', SRC.ID, SRC.NAME)-source.handler-TEST_DB.TARGET_SCHEMA.TARGET_TABLE.TARGET_COLUMN",
    source: "..formula-CONCAT('TEST_', SRC.ID, SRC.NAME)",
    target: 'TEST_DB.TARGET_SCHEMA.TARGET_TABLE',
    selected: true,
    animated: false,
    sourceX: 0,
    sourceY: 0,
    targetX: 10,
    targetY: 10,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    sourceHandleId: "..formula-CONCAT('TEST_', SRC.ID, SRC.NAME)-source.handler",
    targetHandleId: 'TEST_DB.TARGET_SCHEMA.TARGET_TABLE.TARGET_COLUMN',
  };

  it('should emit EventData.Model.Delete event when onClickDelete is called', () => {
    const mockTransformationData = {
      targetHandleIdSplited: ['TEST_DB', 'TARGET_SCHEMA', 'TARGET_TABLE', 'TARGET_COLUMN'],
      sourceHandleId: "..formula-CONCAT('TEST_', SRC.ID, SRC.NAME)-source.handler",
    };

    const { onClickDelete } = useSelectedEdge(mockProps);
    onClickDelete();

    waitFor(() =>
      expect(mockPubSubService.emitEvent).toHaveBeenCalledWith(EventData.Model.Delete, mockTransformationData)
    );
  });

  it('should emit EventData.Diagram.OpenDrawer event when onClickEdit is called', () => {
    const { onClickEdit } = useSelectedEdge(mockProps);

    onClickEdit();

    waitFor(() => expect(mockPubSubService.emitEvent).toHaveBeenCalledWith(EventData.Diagram.OpenDrawer, mockProps));
  });
});
