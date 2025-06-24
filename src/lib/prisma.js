// src/lib/prisma.js
import { PrismaClient } from '../generated/prisma'; // chemin relatif depuis /src/lib

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['query'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
