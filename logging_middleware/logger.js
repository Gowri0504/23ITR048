const axios = require('axios');

/**
 * Log function to send logs to the Test Server.
 * @param {string} stack - 'backend' or 'frontend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} pkg - Package name (e.g., 'controller', 'service', etc.)
 * @param {string} message - The log message
 */
async function Log(stack, level, pkg, message) {
    const AUTH_TOKEN = process.env.AUTH_TOKEN; // Should be set in environment
    const LOG_API_URL = 'http://4.224.186.213/evaluation-service/logs';

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
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Log sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending log:', error.response ? error.response.data : error.message);
    }
}

module.exports = Log;
