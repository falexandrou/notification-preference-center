import { PrismaClient } from '@prisma/client';

// Use prisma client as a signleton
const db = new PrismaClient();

export default db;
