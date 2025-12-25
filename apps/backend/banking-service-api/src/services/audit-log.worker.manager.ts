import { Worker } from 'worker_threads';
import path from 'path';

let auditLogWorker: Worker | null = null;

export function getAuditLogWorker(): Worker {
    if (!auditLogWorker) {
        auditLogWorker = new Worker(path.resolve(__dirname, '../audit-log.worker.ts'));
        auditLogWorker.on('error', (err) => {
            console.error('AuditLog Worker error:', err);
        });
    }
    return auditLogWorker;
}

export function sendAuditLogToWorker(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
        const worker = getAuditLogWorker();
        worker.once('message', (msg) => {
            if (msg && msg.success) resolve();
            else reject(msg.error || 'Unknown error from audit log worker');
        });
        worker.postMessage(data);
    });
}
