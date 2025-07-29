import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${stack || message}${metaString}`;
});

// Create a Winston logger instance
const logger = createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        // Console transport for all environments
        new transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        }),
    ],
});

// Add file transports for production
if (process.env.NODE_ENV === 'production') {
    logger.add(new transports.File({ filename: 'logs/error.log', level: 'error' }));
    logger.add(new transports.File({ filename: 'logs/combined.log' }));
}

// Create a stream object for Morgan integration
const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};

export { logger, stream };
