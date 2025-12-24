import prisma from '../config/database';

interface AuditLogData {
    userId?: string;
    sessionId?: string;
    action: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
}

export async function createAuditLog(data: AuditLogData) {
    return prisma.auditLog.create({
        data: {
            userId: data.userId,
            sessionId: data.sessionId,
            action: data.action,
            details: data.details,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            referrer: data.referrer,
        },
    });
}
