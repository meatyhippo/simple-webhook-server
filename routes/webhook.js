import express from 'express';
import bodyParser from 'body-parser';
import { XMLValidator, XMLParser } from 'fast-xml-parser'; // to validate XML data
import { logToConsole, logToFile } from '../middlewares/logger.js';

const router = express.Router();

// Webhook endpoint
router.post('/webhook', async (req, res) => {
    const timestamp = new Date().toISOString();

    if (!req.headers['content-type']) {
        return res.status(400).json({
            success: false,
            message: 'Content-Type header is missing',
            timestamp: timestamp
        });
    }

    let responseBody;

    if (req.passedArgs["--raw"]) {
        // If --raw flag is set, return the raw body, without any parsing
        router.use(bodyParser.text()); // to handle raw text data
        responseBody = req.body;
    }
    if (!req.passedArgs["--raw"]) {
        if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
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
        }
    }

    const fileLogged = logToFile(req, 'token', responseBody);
    const consoleLogged = logToConsole(req, responseBody);

    // Send acknowledgment response
    return res.status(200).json({
        success: true,
        message: 'Webhook received successfully',
        timestamp: timestamp
    });
});

// GET endpoint for testing
router.get('/webhook', (req, res) => {
    return res.status(200).json({
        status: 'online',
        message: 'Webhook server is running',
        timestamp: new Date().toISOString(),
        flags: req.passedArgs || {}
    });
});


export default router;