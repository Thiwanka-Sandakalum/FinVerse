export class AppError extends Error {
    public status: number;
    public code: string;
    public details?: Array<{ field?: string; message?: string; code?: string }>;

    constructor(
        status: number,
        message: string,
        code: string = 'INTERNAL_ERROR',
        details?: Array<{ field?: string; message?: string; code?: string }>
    ) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
