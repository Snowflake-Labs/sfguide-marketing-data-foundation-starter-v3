import { IPubSubService } from "interfaces/IPubSubService";

export const mockPubSubService: IPubSubService = {
    subscribeToEvent: jest.fn(),
    unsubscribeFromEvent: jest.fn(),
    emitEvent: jest.fn(),
};