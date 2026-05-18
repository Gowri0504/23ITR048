import axios from 'axios';

/**
 * Log function to send logs to the Test Server.
 * @param {string} stack - 'backend' or 'frontend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} pkg - Package name (e.g., 'api', 'component', 'hook', etc.)
 * @param {string} message - The log message
 */
export async function Log(stack: string, level: string, pkg: string, message: string) {
    // Calling backend proxy instead of Test Server directly to avoid CORS issues
    const LOG_API_URL = 'http://localhost:5001/api/logs';

    const validStacks = ['backend', 'frontend'];
    const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];

    if (!validStacks.includes(stack.toLowerCase())) {
        console.error(`Invalid stack: ${stack}`);
        return;
    }

    if (!validLevels.includes(level.toLowerCase())) {
        console.error(`Invalid level: ${level}`);
        return;
    }

    try {
        const response = await axios.post(LOG_API_URL, {
            stack: stack.toLowerCase(),
            level: level.toLowerCase(),
            package: pkg,
            message: message
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Log sent successfully via proxy:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error sending log via proxy:', error.response ? error.response.data : error.message);
    }
}
