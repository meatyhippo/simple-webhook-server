# Webhook Server

A simple Node.js webhook server built with Express.js that receives messages and logs them to the terminal.

## Features

- Single webhook endpoint: POST (`/webhook`)
- Logs incoming headers
- Logs incoming body with timestamps and client IP
- Health check endpoint for monitoring
- Easy to start/stop on demand

## Setup

### 0. Install npm
```bash
brew install npm
```

### 1. Install dependencies:
```bash
npm install
```

### 2. Start the server:
```bash
npm start
```

### 2.1 (optional) Add flags to the start command.
Currently supported (all are optional):
- port          ->  will default to 3000
- subdomain     ->  will default to random value
- logs          ->  save logs to a different folder. Start from base directory (defaults to the github repo folder)

                    NB: Make sure to always end the path with '/'
                    
                    NB: will create a new /logs folder if not created yet

example with flags:
``` bash
npm start -- --p=3000 --subdomain=listener --logs=/Users/johndoe/Documents/
```

## Endpoints

- `POST /webhook` - Main webhook endpoint for receiving JSON data
- `GET /health` - Health check endpoint

## Usage

### Testing locally
You can test the webhook using curl:

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from webhook!", "data": {"key": "value"}}'
```

### Testing from external sources

Example with localtunnel URL:
```bash
curl -X POST https://your-tunnel-url.loca.lt/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "External webhook!", "source": "internet"}'
```

Or use your favourite API client, like Postman or insomnia.

## Example Output

When a webhook is received, you'll see output like this:

```
=== WEBHOOK RECEIVED ===
Timestamp: 2025-07-11T10:30:45.123Z
Client IP: ::1
Headers: {
  "content-type": "application/json",
  "user-agent": "curl/7.88.1",
  "x-forwarded-for": "81.82.241.24",
  "host": "your-tunnel-url.loca.lt"
}
Body: {
  "message": "Hello from webhook!",
  "data": {
    "key": "value"
  }
}
========================
```

Note: When using tunneling services like localtunnel, you'll see additional headers like `x-forwarded-for` showing the original client IP.
