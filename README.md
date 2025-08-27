# Simple MCP Server for Vercel

A Model Context Protocol (MCP) server that provides simple tools via HTTP API, deployable on Vercel.

## Features

- **Echo Tool**: Returns any message you send
- **Add Tool**: Adds two numbers together
- **HTTP API**: RESTful endpoints for easy integration
- **Serverless**: Runs on Vercel's serverless infrastructure

## API Endpoints

### GET /api/tools
Lists available tools and their schemas.

```bash
curl https://your-deployment.vercel.app/api/tools
```

### POST /api/call
Execute a tool with given arguments.

```bash
curl -X POST https://your-deployment.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "echo",
    "arguments": {"message": "Hello World"}
  }'
```

```bash
curl -X POST https://your-deployment.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "add", 
    "arguments": {"a": 5, "b": 3}
  }'
```

### GET /api/health
Health check endpoint.

```bash
curl https://your-deployment.vercel.app/api/health
```

## Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel --prod
```

**Option B: Using GitHub Integration**

1. Push your code to a GitHub repository
2. Connect your repository to Vercel at [vercel.com](https://vercel.com)
3. Vercel will automatically deploy on every push to main branch

**Option C: Using npm script**

```bash
npm run deploy
```

### 3. Test Your Deployment

After deployment, test your endpoints:

```bash
# Replace YOUR_DEPLOYMENT_URL with your actual Vercel URL
curl https://YOUR_DEPLOYMENT_URL.vercel.app/api/health
curl https://YOUR_DEPLOYMENT_URL.vercel.app/api/tools
```

## Local Development

Run the development server:

```bash
npm run dev
```

This starts Vercel's local development environment at `http://localhost:3000`.

## Project Structure

```
├── api/              # Vercel serverless functions
│   ├── tools.js      # GET /api/tools - List available tools
│   ├── call.js       # POST /api/call - Execute tool calls  
│   └── health.js     # GET /api/health - Health check
├── src/
│   └── handlers.js   # Shared tool logic
├── package.json      # Project dependencies and scripts
├── vercel.json       # Vercel deployment configuration
└── README.md         # This file
```

## Environment Variables

No environment variables are required for basic functionality.

## License

MIT