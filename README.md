# Project & Blog Query MCP Server

A Model Context Protocol (MCP) server that provides intelligent querying of both project portfolios AND blog posts via HTTP API, deployable on Vercel. Perfect for LLM integration to answer questions about your complete technical journey.

## 🎯 Features

- **Smart Project Search**: Query projects by keywords, technologies, categories, or impact level
- **Blog Post Search**: Find blog posts by title, description, and topics
- **Unified Search**: Search across both projects and blogs simultaneously
- **Technology Filtering**: Find projects using specific technologies (React, Node.js, Python, etc.)
- **Portfolio Analytics**: Get insights and statistics about both projects and blog content
- **LLM Optimized**: Structured JSON responses perfect for AI integration
- **Fuzzy Matching**: Intelligent search with relevance scoring
- **Static Data**: Easy-to-maintain JSON files for projects and blogs

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

### `query_blogs` - Smart Blog Search
Search and filter blog posts based on title, description, or keywords with intelligent relevance scoring.

**Parameters:**
- `query` (required): Search keywords (blog title, topic, description)
- `limit`: Maximum results to return (default: 10)

### `get_blog` - Blog Details
Get detailed information about a specific blog post by title or URL.

**Parameters:**
- `title`: Blog post title (partial matches allowed)
- `url`: Exact blog post URL

### `list_blogs` - List All Blogs
List all blog posts with optional sorting.

**Parameters:**
- `sortBy`: Sort field (title, url) - default: title
- `order`: Sort order (asc, desc) - default: asc

### `get_blog_stats` - Blog Statistics
Get comprehensive blog analytics including topic distribution, total count, and recent posts.

### `search_all` - Unified Search
Search across both projects AND blogs simultaneously with combined, relevance-ranked results.

**Parameters:**
- `query` (required): Search keywords to find across all content
- `limit`: Maximum total results to return (default: 10)

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

### Search Blog Posts
```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "query_blogs",
    "arguments": {
      "query": "Next.js"
    }
  }'
```

### Get Blog by Title
```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_blog",
    "arguments": {
      "title": "automation"
    }
  }'
```

### Search Everything (Projects + Blogs)
```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "search_all",
    "arguments": {
      "query": "React",
      "limit": 8
    }
  }'
```

### Get Blog Statistics
```bash
curl -X POST https://simple-mcp-server-theta.vercel.app/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_blog_stats",
    "arguments": {}
  }'
```

## 🤖 LLM Integration Examples

This server is designed to work seamlessly with LLMs for comprehensive knowledge retrieval. Here are some examples:

### Example 1: Project-Specific Query
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

**LLM Response:** *"Shravan has several high-impact React projects. The main ones include his Personal Portfolio built with React, Next.js, and Tailwind CSS, and the F&B QR Ordering System that serves 2000+ monthly users with real-time kitchen updates."*

### Example 2: Blog Discovery
**User Query:** *"What has Shravan written about automation?"*

**LLM Tool Call:**
```json
{
  "name": "query_blogs",
  "arguments": {
    "query": "automation"
  }
}
```

**LLM Response:** *"Shravan has written several blog posts about automation, including 'Automating the Unautomatable: Restaurant Reservation Bot' where he built a Python bot to secure restaurant reservations, and 'Automating IPL Ticket Booking' showing how he automated high-demand sports ticket purchases."*

### Example 3: Unified Knowledge Search
**User Query:** *"Tell me everything about Shravan's work with Next.js"*

**LLM Tool Call:**
```json
{
  "name": "search_all",
  "arguments": {
    "query": "Next.js",
    "limit": 10
  }
}
```

**LLM Response:** *"Shravan has extensive experience with Next.js across both projects and documentation. He built NoteRep using Next.js, serving 2000+ students, and recently wrote a comprehensive blog post about 'Migrating the old portfolio website to Next.js 15' detailing the performance improvements and developer experience enhancements with Turbopack."*

### Example 4: Cross-Reference Discovery  
**User Query:** *"Show me projects that have related blog posts"*

This query would use `search_all` to find connections between projects and their documentation, providing a complete picture of both the technical implementation and the learning journey.

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

### Adding New Blogs

Edit `data/blogs.json` and add your blog post:

```json
{
  "title": "Your Blog Post Title",
  "url": "https://blog.yourdomain.com/your-post-slug",
  "description": "Brief description of what the blog post covers"
}
```

### Blog Schema

- **Required**: `title`, `url`, `description`
- **Simple Structure**: Just title, URL, and description for easy maintenance
- **Search Optimized**: Title and description are used for relevance scoring

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
├── data/                   # Data files
│   ├── projects.json      # Portfolio projects database
│   └── blogs.json         # Blog posts database
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