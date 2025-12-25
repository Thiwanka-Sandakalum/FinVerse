import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
    try {
        const envPath = resolve(process.cwd(), '.env');
        const envContent = readFileSync(envPath, 'utf-8');

        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                const value = valueParts.join('=').trim();
                if (key && value) {
                    process.env[key.trim()] = value;
                }
            }
        });
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // .env file not found, ignore in production (use Azure env vars)
            console.warn('.env file not found, skipping load. Using environment variables from Azure.');
        } else {
            console.error('Error loading .env file:', error);
        }
    }
}

loadEnv();