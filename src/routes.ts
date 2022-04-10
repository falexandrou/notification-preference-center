import { Request, Response } from 'express';
import EventHandler from './handlers/event';
import UserHandler from './handlers/user';
import EventSerializer from './serializers/event';
import UserSerializer from './serializers/user';

/**
 * Creates a user
 *
 * @param {Request} req the express.js request object
 * @param {Response} res the express.js response object
 */
export const createUser = async (req: Request, res: Response) => {
  const user = await UserHandler.create(req.body);

  res.status(201).json(UserSerializer.model(user));
};

/**
 * Returns a user given an id
 *
 * @param {Request} req the express.js request object
 * @param {Response} res the express.js response object
 */
export const getUserById = async (req: Request, res: Response) => {
  const { params: { id } } = req;
  const user = await UserHandler.get(id);

  res.status(200).json(
    UserSerializer.model(user),
  );
};

/**
 * Deletes a user
 *
 * @param {Request} req the express.js request object
 * @param {Response} res the express.js response object
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { params: { id } } = req;
  await UserHandler.delete(id);

  res.status(204).json({});
};

/**
 * Creates an event
 *
 * @param {Request} req the express.js request object
 * @param {Response} res the express.js response object
 */
export const createEvent = async (req: Request, res: Response) => {
  const events = await EventHandler.create(req.body);

  res.status(201).json(EventSerializer.list(events));
};

