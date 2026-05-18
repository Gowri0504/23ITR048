const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Log = require('../logging_middleware/logger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let notifications = [
    { id: 1, type: 'Email', message: 'Welcome to our platform!', status: 'Sent', timestamp: new Date() },
    { id: 2, type: 'SMS', message: 'Your OTP is 123456', status: 'Pending', timestamp: new Date() }
];

app.get('/api/notifications', async (req, res) => {
    await Log('backend', 'info', 'controller', 'Fetching all notifications');
    res.json(notifications);
});

// Proxy endpoint for frontend logs to avoid CORS issues
app.post('/api/logs', async (req, res) => {
    const { stack, level, package: pkg, message } = req.body;
    try {
        const result = await Log(stack, level, pkg, message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to proxy log' });
    }
});

app.post('/api/notifications', async (req, res) => {
    const { type, message } = req.body;
    
    if (!type || !message) {
        await Log('backend', 'error', 'handler', 'Missing notification details');
        return res.status(400).json({ error: 'Type and message are required' });
    }

    const newNotification = {
        id: notifications.length + 1,
        type,
        message,
        status: 'Sent',
        timestamp: new Date()
    };

    notifications.push(newNotification);
    await Log('backend', 'info', 'service', `New notification created: ${type}`);
    
    res.status(201).json(newNotification);
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await Log('backend', 'info', 'db', `Backend server started on port ${PORT}`);
});
