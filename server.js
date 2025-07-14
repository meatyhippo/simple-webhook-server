import express from 'express';
import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';
import bodyParser from 'body-parser'; // to handle form-data requests
import { XMLValidator, XMLParser } from 'fast-xml-parser'; // to validate XML data



const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_IP = await publicIpv4() || process.env.PUBLIC_IP;

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // to handle URL-encoded data

// Webhook endpoint
app.post('/webhook', async (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;
    const responseHeaders = JSON.stringify(req.headers, null, 2);
    let responseBody;
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/xml')) {
        // stringify JSON if the content type is JSON
        responseBody = JSON.stringify(req.body, null, 2);
    } else if (req.headers['content-type'] && req.headers['content-type'].includes('application/xml')) {
        // Validate XML if the content type is XML
        const parser = new XMLParser();
        const validator = new XMLValidator();
        const isValid = await validator.validate(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid XML format',
                timestamp: timestamp
            });
        }
        responseBody = await parser.parse(req.body); // XML body will be parsed by express
    } else if (!req.headers['content-type']) {
        return res.status(400).json({
            success: false,
            message: 'Content-Type header is missing',
            timestamp: timestamp
        });
    } else {
        // Handle other content types (e.g., form-data)
        responseBody = req.body; // body-parser will handle form-data
    }

    console.log('\n=== WEBHOOK RECEIVED ===');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Client IP: ${clientIP}`);
    console.log('Headers:', responseHeaders);
    console.log('Body:', responseBody);
    console.log('========================\n');

    // Send acknowledgment response
    return res.status(200).json({
        success: true,
        message: 'Webhook received successfully',
        timestamp: timestamp
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    return res.status(200).json({
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
