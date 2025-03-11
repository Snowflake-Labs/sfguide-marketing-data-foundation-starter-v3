import { EventData } from 'dtos/EventData';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { EdgeProps } from 'reactflow';
import { MappingEdge } from '../EdgeTypes';

export function useSelectedEdge(props: EdgeProps) {
  const { targetHandleId, sourceHandleId, target } = props;
  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);

  const onClickDelete = () => {
    pubSubService.emitEvent(EventData.Model.Delete, {
      open: true,
      transformation: { targetHandleIdSplited: targetHandleId!.split('.'), sourceHandleId },
    });
  };

  const onClickEdit = () => {
    pubSubService.emitEvent(EventData.Diagram.OpenDrawer, props as MappingEdge);
  };

  return { onClickDelete, onClickEdit, shouldRenderIcons: !target.startsWith('..formula') };
}
