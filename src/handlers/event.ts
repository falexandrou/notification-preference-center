import { ConsentType, Event } from '@prisma/client';

import db from '../lib/db';
import { CONSENT_TYPES } from '../constants';
import { ValidationError } from '../lib/errors';
import ConsentHandler from './consent';

export type CreateEventPayload = {
  user?: {
    id?: string;
  },
  consents?: Array<{
    id: ConsentType,
    enabled: boolean,
  }>;
};

class EventHandler {
  /**
   * Creates an event for a user
   *
   * @param {CreateEventPayload} data the data to create the events by
   * @returns {Promise<Number>} the amount of events created
   * @throws {ValidationError}
   */
  static async create(data: CreateEventPayload = {}): Promise<Event[]> {
    const { user: { id: userId } = {}, consents = [] } = data;

    if (!userId) {
      throw new ValidationError('A user ID should be specified');
    }

    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      // We're using a ValidationError instead of a NotFoundError because
      // the user is not the main resource we're retrieving. It's just a value in the payload
      throw new ValidationError(`User with ID ${userId} does not exist`);
    }

    if (consents.some(({ id }) => !CONSENT_TYPES.includes(id))) {
      throw new ValidationError(
        `You have specified invalid consent ids on your payload. Available options are ${CONSENT_TYPES.join(', ')}`,
      );
    }

    const { count } = await db.event.createMany({
      data: consents.map(({ id: type, enabled }) => ({ type, enabled, userId })),
    });

    const events = await db.event.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: count,
    })

    // Store the consents for the user
    await ConsentHandler.record(userId);

    return events;
  }
}

export default EventHandler;
