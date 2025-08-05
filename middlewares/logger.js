import fs from 'fs';

const logToFile = (req, type, responseBody) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;
    const responseHeaders = JSON.stringify(req.headers, null, 2);
    const logsPath = req.passedArgs["--logs"] || './';
    // save response to a file
    const logFilePath = `${logsPath}logs/${type}_${timestamp.replace(/[:.]/g, '-')}.log`;
    fs.mkdirSync(`${logsPath}logs`, { recursive: true }); // ensure logs directory exists
    fs.writeFileSync(logFilePath, `Timestamp: ${timestamp}\nClient IP: ${clientIP}\nHeaders: ${responseHeaders}\nBody: ${JSON.stringify(responseBody, null, 2)}`, 'utf8');
};

const logToConsole = (req, responseBody) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;
    const responseHeaders = JSON.stringify(req.headers, null, 2);
    console.log('\n=== WEBHOOK RECEIVED ===');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Endpoint: ${req.path}`);
    console.log(`Method: ${req.method}`);
    console.log('Headers:', responseHeaders);
    console.log('Body:', responseBody);
    console.log('========================\n');
};

export { logToFile, logToConsole };