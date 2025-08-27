# Project Query MCP Server

A Model Context Protocol (MCP) server that provides intelligent querying of project portfolios via HTTP API, deployable on Vercel. Perfect for LLM integration to answer questions about your projects.

## 🎯 Features

- **Smart Project Search**: Query projects by keywords, technologies, categories, or impact level
- **Technology Filtering**: Find projects using specific technologies (React, Node.js, Python, etc.)
- **Portfolio Analytics**: Get insights and statistics about project distribution
- **LLM Optimized**: Structured JSON responses perfect for AI integration
- **Fuzzy Matching**: Intelligent search with relevance scoring
- **Static Data**: Easy-to-maintain JSON file with project information

## 🔧 MCP Tools

### `query_projects` - Smart Project Search
Search and filter projects based on multiple criteria with intelligent relevance scoring.

**Parameters:**
- `query` (required): Search keywords (project name, technology, description)
- `category`: Filter by category (api, web-app, mobile-app, ml, utility)
- `status`: Filter by status (production, development, prototype, archived)
- `impact`: Filter by impact level (high, medium, low)
- `technology`: Filter by specific technology
- `limit`: Maximum results to return (default: 10)

### `get_project` - Project Details
Get comprehensive information about a specific project by ID.

**Parameters:**
- `id` (required): Project identifier (e.g., 'mcp-server', 'portfolio-website')

### `list_projects` - List All Projects
List all projects with optional sorting and metadata.

**Parameters:**
- `sortBy`: Sort field (created, name, impact, status) - default: created
- `order`: Sort order (asc, desc) - default: desc

### `get_project_stats` - Portfolio Statistics
Get comprehensive portfolio analytics including technology distribution, project counts, and recent projects.

## API Endpoints

### GET /api/tools
Lists all available MCP tools and their schemas.

```bash
curl https://simple-mcp-server-theta.vercel.app/api/tools
```

### POST /api/call
Execute any MCP tool with arguments.

```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{"name": "TOOL_NAME", "arguments": {...}}'
```

### GET /api/health
Health check endpoint.

```bash
curl https://simple-mcp-server-theta.vercel.app/api/health
```

## 🚀 Usage Examples

### Search for React Projects
```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "query_projects",
    "arguments": {
      "query": "React"
    }
  }'
```

### Get High-Impact Projects
```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "query_projects", 
    "arguments": {
      "query": "",
      "impact": "high"
    }
  }'
```

### Find Production APIs
```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "query_projects",
    "arguments": {
      "query": "",
      "category": "api",
      "status": "production"
    }
  }'
```

### Get Specific Project Details
```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_project",
    "arguments": {
      "id": "mcp-server"
    }
  }'
```

### Get Portfolio Statistics
```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_project_stats",
    "arguments": {}
  }'
```

## 🤖 LLM Integration Example

This server is designed to work seamlessly with LLMs. Here's how it works:

**User Query:** *"Show me Shravan's React projects with high impact"*

**LLM Tool Call:**
```json
{
  "name": "query_projects",
  "arguments": {
    "query": "React",
    "impact": "high"
  }
}
```

**Server Response:**
```json
{
  "query": "React",
  "found": 2,
  "results": [
    {
      "id": "portfolio-website",
      "name": "Personal Portfolio",
      "description": "A modern, responsive portfolio website...",
      "technologies": ["React", "Next.js", "Tailwind CSS"],
      "impact": "high",
      "status": "production",
      "links": {
        "github": "https://github.com/myselfshravan/portfolio",
        "live": "https://shravan.dev"
      },
      "relevanceScore": 110
    }
  ]
}
```

**LLM Response:** *"Shravan has 2 high-impact React projects. The main one is his Personal Portfolio built with React, Next.js, and Tailwind CSS. It's currently in production and features responsive design with smooth animations. You can check it out at shravan.dev or view the code on GitHub."*

## 📁 Data Management

### Adding New Projects

Edit `data/projects.json` and add your project following the schema:

```json
{
  "id": "unique-project-id",
  "name": "Project Name",
  "description": "Detailed description of the project",
  "technologies": ["Tech1", "Tech2", "Tech3"],
  "impact": "high",
  "status": "production", 
  "category": "web-app",
  "tags": ["tag1", "tag2"],
  "links": {
    "github": "https://github.com/user/repo",
    "live": "https://project-url.com"
  },
  "created": "2024-12-01",
  "highlights": [
    "Key feature 1",
    "Key feature 2"
  ]
}
```

### Project Schema

- **Required**: `id`, `name`, `description`, `technologies`, `impact`, `status`, `category`, `created`
- **Optional**: `tags`, `links`, `highlights`
- **Categories**: `api`, `web-app`, `mobile-app`, `ml`, `utility`
- **Status**: `production`, `development`, `prototype`, `archived`
- **Impact**: `high`, `medium`, `low`

## 🛠 Deployment

### Quick Deploy
```bash
# Clone and deploy
git clone https://github.com/myselfshravan/simple-mcp-server.git
cd simple-mcp-server
npm install
vercel --prod
```

### GitHub Integration
1. Fork this repository
2. Connect to Vercel
3. Auto-deploys on every push

### Local Development
```bash
npm install
npm run dev:vercel  # Vercel local environment
# or
npm run dev        # Node.js stdio version
```

## 📂 Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── call.js            # POST /api/call - Execute MCP tools
│   ├── health.js          # GET /api/health - Health check
│   └── tools.js           # GET /api/tools - List tools
├── data/                   # Project data
│   └── projects.json      # Portfolio projects database
├── public/                 # Static files
│   └── index.html         # Documentation landing page
├── src/                    # Source code
│   ├── handlers.js        # MCP tool implementations
│   └── queryEngine.js     # Search and query logic
├── package.json           # Dependencies and scripts
├── vercel.json            # Vercel configuration
└── README.md              # This documentation
```

## 🔧 Customization

1. **Add Custom Tools**: Extend `src/handlers.js` with new MCP tools
2. **Modify Search Logic**: Update `src/queryEngine.js` for custom search behavior
3. **Change Data Schema**: Modify `data/projects.json` structure as needed
4. **Styling**: Update `public/index.html` for custom landing page

## License

MIT