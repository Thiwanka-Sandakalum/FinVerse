import { parentPort } from 'worker_threads';
import { createAuditLog } from '../services/audit-log.service';

if (!parentPort) throw new Error('Must be run as a worker thread');

parentPort.on('message', async (data) => {
    try {
        await createAuditLog(data);
        parentPort?.postMessage({ success: true });
    } catch (error) {
        parentPort?.postMessage({ success: false, error: error instanceof Error ? error.message : error });
    }
});
