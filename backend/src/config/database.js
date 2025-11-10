import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log de queries (somente em development)
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Query: ' + e.query);
    logger.debug('Duration: ' + e.duration + 'ms');
  });
}

prisma.$on('error', (e) => {
  logger.error('Prisma Error:', { error: e });
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning:', { warning: e });
});

// Teste de conexão
prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error) => {
    logger.error('Database connection failed:', { error: error.message });
    process.exit(1);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
});

export { prisma };
