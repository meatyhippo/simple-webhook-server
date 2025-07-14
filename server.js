import express from 'express';
import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';


const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_IP = await publicIpv4() || process.env.PUBLIC_IP;

// Middleware to parse JSON
app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;

    console.log('\n=== WEBHOOK RECEIVED ===');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Client IP: ${clientIP}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('========================\n');

    // Send acknowledgment response
    res.status(200).json({
        success: true,
        message: 'Webhook received successfully',
        timestamp: timestamp
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Webhook server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Webhook server is running on port ${PORT}`);
    console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`❤️ Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Run "lt --port ${PORT}" in order to make the webhook publicly accessible`);
    // log password 
    console.log(`🔑 Password: ${PUBLIC_IP}`);
    console.log('Press Ctrl+C to stop the server\n');
});
