import faker from '@faker-js/faker';
import Serializer from './serializer';

type MockModel = {
  firstName: string;
  emailAddress: string;
  phoneNumber: string;
};

class MockSerializer extends Serializer {
  serialize(model: MockModel): object {
    const { firstName, emailAddress, phoneNumber } = model;

    return {
      name: firstName,
      email: emailAddress,
      phone: phoneNumber,
    };
  }
}

describe('Serializer', () => {
  let model: MockModel;

  beforeEach(() => {
    model = {
      firstName: faker.name.firstName(),
      emailAddress: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
    };
  });

  it('serializes a model', () => {
    const serialized = MockSerializer.model(model);
    expect(serialized).toBeInstanceOf(Object);
    expect(serialized).toEqual({
      name: model.firstName,
      email: model.emailAddress,
      phone: model.phoneNumber,
    });
  });

  it('serializes a list of models', () => {
    const serialized = MockSerializer.list([model]);
    expect(serialized).toBeInstanceOf(Array);
    expect(serialized).toHaveLength(1);

    const [obj] = serialized;
    expect(obj).toBeInstanceOf(Object);
    expect(obj).toEqual({
      name: model.firstName,
      email: model.emailAddress,
      phone: model.phoneNumber,
    });
  });
});
