import app from './index';
import { logger } from './config/logger';
import prisma from './config/database';


const PORT = Number(process.env.PORT || process.env.WEBSITES_PORT || 8181)
const ENVIRONMENT = process.env.NODE_ENV || 'development'

app.listen(PORT, () => {
    logger.info(`Server is running in ${ENVIRONMENT} mode on port ${PORT}`);
    prisma.$connect().then(() => {
        logger.info('Database connected successfully.');
    }).catch((error) => {
        logger.error('Database connection error:', error);
    });
});

const handleGracefulShutdown = async () => {
    try {
        await prisma.$disconnect();
        logger.info('Database connection closed.');
        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
};


process.on('SIGINT', handleGracefulShutdown);
process.on('SIGTERM', handleGracefulShutdown);