import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prismaClientSingleton = () => {
    return new PrismaClient({
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
};

// Use global to maintain a singleton instance across hot reloads in development
declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

// Log prisma events in development
if (process.env.NODE_ENV !== 'production') {
    prisma.$on('query', (e: any) => {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Duration: ${e.duration}ms`);
    });

    prisma.$on('error', (e: any) => {
        logger.error(`Prisma error: ${e.message}`);
    });
}

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
