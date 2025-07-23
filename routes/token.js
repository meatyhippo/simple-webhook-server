import express from 'express';
import { logToConsole, logToFile } from '../middlewares/logging.js';

const router = express.Router();

// GET endpoint for testing
router.post('/token', (req, res) => {

    if (!req.headers['content-type']) {
        return res.status(400).json({
            success: false,
            message: 'Content-Type header is missing',
            timestamp: timestamp
        });
    }

    let responseBody;
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        // stringify JSON if the content type is JSON
        responseBody = JSON.stringify(req.body, null, 2);
    }

    const fileLogged = logToFile(req, 'token', responseBody);
    const consoleLogged = logToConsole(req, responseBody);
    const tokenResponse = req.passedArgs["--token-response"] || 'bla bla bla';

    return res.status(200).json({
        access_token: tokenResponse
    });
});

export default router;