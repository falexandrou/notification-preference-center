import { ConsentType, Event, Prisma } from '@prisma/client';
import db from '../lib/db';

class ConsentHandler {
  /**
   * Gets the most recent entries for every type of event for the user
   *
   * @param {String} userId the id of the user to get the consent events for
   * @returns {Promise<Event>} the most recent consent events for every type
   */
  static async mostRecentEvents(userId: string): Promise<Event[]> {
    const sql = Prisma.sql`
      SELECT *
      FROM Event e
      WHERE createdAt IN (
        SELECT
          MAX(createdAt)
          FROM Event ee
        WHERE
          ee.userId = '${userId}'
        GROUP BY
          ee.userId, type
        ORDER BY
          createdAt DESC
      ) AND e.userId = '${userId}';`

    return await db.$queryRaw<Event[]>(sql);
  }

  /**
   * Calculates the current state of consents for a user
   *
   * @param {String} userId the id for the user to calculate the consents for
   */
  static async record(userId: string) {
    const events = await ConsentHandler.mostRecentEvents(userId);

    await db.$transaction(
      events.map(({ type, enabled }) => (
        db.consent.upsert({
          where: {
            userId_type: {
              userId,
              type,
            }
          },
          create: {
            type,
            enabled,
            userId,
          },
          update: {
            enabled,
          },
        })
      )),
    );
  }
}

export default ConsentHandler;