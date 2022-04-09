import { Consent, User } from '@prisma/client';
import Serializer from '../lib/serializer';
import ConsentSerializer from './consent';

class UserSerializer extends Serializer {
  /**
   * Serializes a user
   *
   * @param {User} model the user to serialize
   * @returns {Object}
   */
  serialize(model: User & { consents: Consent[] }) {
    return {
      id: model.id,
      email: model.email,
      consents: ConsentSerializer.list(model.consents),
    };
  }
}

export default UserSerializer;
