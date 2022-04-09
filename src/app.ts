import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import expressRouter from "express-promise-router";

import { ApiError } from './lib/errors';
import { createUser, getUserById, deleteUser, createEvent } from './routes';

const app = express();
const router = expressRouter();

// Required middleware
app.use(express.json());
app.use(cors());
app.use(router);

// Error handling
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ApiError) {
    return res.status(error.httpStatusCode).json({ error: error.message });
  }

  return res.status(500).json({ error: error.message });
});

// Register the routes:

// Users endpoints
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

// Events endpoints
router.post('/events', createEvent);

export default app;
