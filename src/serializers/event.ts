import { Event } from '@prisma/client';
import Serializer from '../lib/serializer';

class EventSerializer extends Serializer {
  /**
   * Serializes an event object
   *
   * @param {Event} model the event to serialize
   * @returns {Object}
   */
  serialize(model: Event): object {
    return {
      id: model.id,
      type: model.type,
      enabled: model.enabled,
    };
  }
}

export default EventSerializer;
