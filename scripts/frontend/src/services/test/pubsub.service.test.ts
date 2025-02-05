import "reflect-metadata";
import { PubSubService } from 'services/pubsub.service';

describe('PubSub Service', () => {
  test('should call subscribed event when emited', () => {
    // arrange
    const props = {
        eventId: 'event-test',
        caller: 'test',
        callback: jest.fn(),
    }
    const service = new PubSubService();
    service.subscribeToEvent(props.eventId, props.caller, props.callback);

    // act
    service.emitEvent('event-test');

    // assert
    expect(props.callback).toHaveBeenCalledTimes(1);
  });

  test('should not call unsubscribed event when emited', () => {
    // arrange
    const props = {
        eventId: 'event-test',
        caller: 'test',
        callback: jest.fn(),
    }
    const service = new PubSubService();
    service.subscribeToEvent(props.eventId, props.caller, props.callback);
    service.unsubscribeFromEvent(props.eventId, props.caller);

    // act
    service.emitEvent('event-test');

    // assert
    expect(props.callback).toHaveBeenCalledTimes(0);
  });
  
  test('should call all subscribed events when emited', () => {
    // arrange
    const props = {
        eventId: 'event-test',
        caller1: 'test1',
        caller2: 'test2',
        callback: jest.fn(),
    }
    const service = new PubSubService();
    service.subscribeToEvent(props.eventId, props.caller1, props.callback);
    service.subscribeToEvent(props.eventId, props.caller2, props.callback);

    // act
    service.emitEvent('event-test');

    // assert
    expect(props.callback).toHaveBeenCalledTimes(2);
  });

  test('should not call unsubscribed event when multiple callers', () => {
    // arrange
    const props = {
        eventId: 'event-test',
        caller1: 'test1',
        caller2: 'test2',
        callback1: jest.fn(),
        callback2: jest.fn(),
    }
    const service = new PubSubService();
    service.subscribeToEvent(props.eventId, props.caller1, props.callback1);
    service.subscribeToEvent(props.eventId, props.caller2, props.callback2);
    service.unsubscribeFromEvent(props.eventId, props.caller1);

    // act
    service.emitEvent('event-test');

    // assert
    expect(props.callback1).toHaveBeenCalledTimes(0);
    expect(props.callback2).toHaveBeenCalledTimes(1);
  });
});
