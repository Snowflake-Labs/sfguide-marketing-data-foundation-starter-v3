import { IPubSubService } from 'interfaces/IPubSubService';
import { injectable } from 'inversify';

@injectable()
export class PubSubService implements IPubSubService {
  private events: { eventId: string; caller: string; callback: (args?: any) => void }[] = [];

  subscribeToEvent(eventId: string, caller: string, callback: (args?: any) => void): void {
    this.unsubscribeFromEvent(eventId, caller);
    this.events.push({ eventId, caller, callback });
  }

  unsubscribeFromEvent(eventId: string, caller: string): void {
    this.events = this.events.filter((event) => event.eventId !== eventId || event.caller !== caller);
  }

  emitEvent(eventId: string, args?: any): void {
    const events = this.events.filter((event) => event.eventId === eventId);
    events.forEach((event) => event.callback(args));
  }
}
