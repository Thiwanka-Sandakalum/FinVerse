import { Response } from 'express';

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const handleError = (error: any, res: Response) => {
    console.error('Error:', error);

    if (error instanceof NotFoundError) {
        return res.status(404).json({
            status: 'error',
            message: error.message
        });
    }

    if (error instanceof ValidationError) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        });
    }

    // Handle Prisma errors
    if (error?.code === 'P2002') {
        return res.status(409).json({
            status: 'error',
            message: 'A record with this identifier already exists'
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};
