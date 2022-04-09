import cors from 'cors';
import express, { Request, Response } from 'express';

import { ApiError } from './lib/errors';
import { createUser, getUserById, deleteUser, createEvent } from './routes';

const app = express();

// Required middleware
app.use(express.json());
app.use(cors());

app.use((error: Error, req: Request, res: Response, next: Function) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ApiError) {
    return res.status(error.httpStatusCode).json({ error: error.message });
  }

  return res.status(500).json({ error: error.message });
});

// Users endpoints
app.post('/users', createUser);
app.get('/users/:id', getUserById);
app.delete('/users/:id', deleteUser);

// Events endpoints
app.post('/events', createEvent);

export default app;
