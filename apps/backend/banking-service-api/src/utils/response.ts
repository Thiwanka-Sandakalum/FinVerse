import { Response } from 'express';


// Standard API response envelope (success)
export function apiSuccess(
    res: Response,
    {
        status = 200,
        message = 'Request completed successfully',
        data = null,
        meta = {}
    }: {
        status?: number;
        message?: string;
        data?: any;
        meta?: object;
    }
) {
    return res.status(status).json({
        success: true,
        status,
        message,
        data,
        meta
    });
}

// Standard API error envelope (error)
export function apiError(
    res: Response,
    {
        status = 400,
        message = 'Invalid request parameters',
        code = 'INVALID_INPUT',
        details = []
    }: {
        status?: number;
        message?: string;
        code?: string;
        details?: Array<{ field?: string; message?: string; code?: string }>;
    }
) {
    return res.status(status).json({
        success: false,
        status,
        message,
        error: {
            code,
            details: Array.isArray(details) ? details : []
        }
    });
}
