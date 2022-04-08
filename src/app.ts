import cors from 'cors';
import express from 'express';

import { createUser, getUsers, getUserById, deleteUser, createEvent } from './routes';

const app = express();

// Required middleware
app.use(express.json());
app.use(cors());

// Users endpoints
app.get('/users', getUsers);
app.post('/users', createUser);
app.get('/users/:id', getUserById);
app.delete('/users/:id', deleteUser);

// Events endpoints
app.post('/events', createEvent);

export default app;
