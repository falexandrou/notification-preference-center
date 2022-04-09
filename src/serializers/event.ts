import { Event } from '@prisma/client';
import Serializer from '../lib/serializer';

class EventSerializer extends Serializer {
  serialize(model: Event): object {
    return {
      id: model.id,
      consent: model.consent,
      enabled: model.enabled,
    };
  }
}

export default EventSerializer;
