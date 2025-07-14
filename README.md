# Webhook Server

A simple Node.js webhook server built with Express.js that receives JSON messages and logs them to the terminal.

## Features

- Single webhook endpoint: POST (`/webhook`)
- Logs incoming JSON messages with timestamps and client IP
- Health check endpoint for monitoring
- Easy to start/stop on demand

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

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
Once you've exposed your server using one of the tunnel options below, external machines can send webhooks:

```bash
# Example with localtunnel URL
curl -X POST https://your-tunnel-url.loca.lt/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "External webhook!", "source": "internet"}'
```

### Quick Setup with localtunnel (Free)
1. Terminal 1: `npm start`
2. Terminal 2: `lt --port 3000`
3. Use the displayed URL for external webhooks

### Making it accessible from the internet

To receive webhooks from external services, you'll need to expose your local server to the internet. Here are the best free options:

#### Option 1: Using localtunnel (Recommended - Free & No Signup)
1. Install localtunnel: `npm install -g localtunnel`
2. Start your webhook server: `npm start`
3. In another terminal: `lt --port 3000`
4. Use the provided localtunnel URL for your webhook endpoint (e.g., `https://xyz-123.loca.lt/webhook`)

**Note**: The URL changes each time you restart localtunnel, but it's completely free and works immediately.


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
