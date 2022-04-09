import { Consent } from '@prisma/client';
import Serializer from '../lib/serializer';

class ConsentSerializer extends Serializer {
  /**
   * Serializes an event object
   *
   * @param {Event} model the event to serialize
   * @returns {Object}
   */
  serialize(model: Consent): object {
    return {
      id: model.type,
      enabled: model.enabled,
    };
  }
}

export default ConsentSerializer;
