import { User } from '@prisma/client';
import Serializer from '../lib/serializer';

class UserSerializer extends Serializer {
  serialize(model: User): object {
    return {
      id: model.id,
      emai: model.email,
    };
  }
}

export default UserSerializer;
