export interface IPubSubService {
  subscribeToEvent(eventId: string, caller: string, callback: (args?: any) => void): void;
  unsubscribeFromEvent(eventId: string, caller: string): void;
  emitEvent(eventId: string, args?: any): void;
}
