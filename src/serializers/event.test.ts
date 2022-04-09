import faker from '@faker-js/faker';
import { ConsentType, Event } from '@prisma/client';
import db from '../lib/db';
import EventSerializer from './event';

describe('EventSerializer', () => {
  let event: Event;

  beforeEach(async () => {
    const user = await db.user.create({ data: { email: faker.internet.email() } })

    event = await db.event.create({
      data: {
        type: faker.random.arrayElement(Object.values(ConsentType)),
        enabled: faker.random.arrayElement([true, false]),
        userId: user.id,
      },
    });
  });

  it('serializes an event object', () => {
    const serialized = EventSerializer.model(event);
    expect(serialized).toBeInstanceOf(Object);
    expect(serialized).toEqual({
      id: event.id,
      type: event.type,
      enabled: event.enabled,
    });
  });

  it('serializes a list of event objects', () => {
    const serialized = EventSerializer.list([event]);
    expect(serialized).toBeInstanceOf(Array);
    expect(serialized).toHaveLength(1);
    const [obj] = serialized;
    expect(obj).toBeInstanceOf(Object);
    expect(obj).toEqual({
      id: event.id,
      type: event.type,
      enabled: event.enabled,
    });
  });
});
