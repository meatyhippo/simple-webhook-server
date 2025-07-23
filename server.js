import express from 'express';
import { publicIpv4 } from 'public-ip';
import localtunnel from 'localtunnel'; // to expose the server to the internet
import bodyParser from 'body-parser';

import webhookRoutes from './routes/webhook.js';
import tokenRoutes from './routes/token.js';
import healthRoutes from './routes/health.js';

// Parse command line arguments
const passedArgs = {};
process.argv.forEach(flag => {
    if (flag.includes('--')) {
        const splitFlag = flag.split("=");
        passedArgs[splitFlag[0]] = splitFlag[1]
    }
});

// Create an Express application
const app = express();
const PORT = passedArgs["--p"] || 3000;
const subdomain = passedArgs["--subdomain"] || undefined;
const PUBLIC_IP = await publicIpv4() || process.env.PUBLIC_IP;
const tokenResponse = passedArgs["--token-response"] || 'bla bla bla';
//const logsPath = req.passedArgs["--logs"] || './';
//console.log(`Logs will be saved to: ${logsPath}`);


app.use((req, res, next) => {
    req.passedArgs = passedArgs; // attach passed arguments to the request object
    next();
});
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // to handle URL-encoded data


// set routes
app.use(webhookRoutes, tokenRoutes, healthRoutes);

// Start server
app.listen(PORT, async () => {
    // setup localtunnel to expose the server to the internet
    const tunnel = await localtunnel({ port: PORT, subdomain });

    console.log(`Passed arguments:`, passedArgs);
    console.log("----------------");
    console.log('Local testing:');
    console.log(`🚀 Webhook server is running on port ${PORT}`);
    console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`❤️ Health check: http://localhost:${PORT}/health`);
    console.log("----------------");
    console.log('public url:');
    console.log(`🌐 Localtunnel URL: ${tunnel.url}/webhook`);
    // log password 
    console.log(`🔑 When accessing in browser, Password: ${PUBLIC_IP}`);
    console.log('Press Ctrl+C to stop the server\n');
});
