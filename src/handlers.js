import { 
  queryProjects, 
  getProjectById, 
  getAllProjects, 
  getProjectStats,
  queryBlogs,
  getBlogByTitle,
  getBlogByUrl,
  getAllBlogs,
  getBlogStats,
  searchAll
} from './queryEngine.js';

export const tools = [
  {
    name: "echo",
    description: "Echo back the provided message",
    inputSchema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Message to echo back",
        },
      },
      required: ["message"],
    },
  },
  {
    name: "add",
    description: "Add two numbers together",
    inputSchema: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "First number",
        },
        b: {
          type: "number", 
          description: "Second number",
        },
      },
      required: ["a", "b"],
    },
  },
  {
    name: "query_projects",
    description: "Search and query projects based on keywords, technologies, categories, or other criteria",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (keywords, project name, technology, etc.)",
        },
        category: {
          type: "string",
          description: "Filter by project category (api, web-app, mobile-app, ml, utility)",
          enum: ["api", "web-app", "mobile-app", "ml", "utility"]
        },
        status: {
          type: "string",
          description: "Filter by project status",
          enum: ["production", "development", "prototype", "archived"]
        },
        impact: {
          type: "string",
          description: "Filter by project impact level",
          enum: ["high", "medium", "low"]
        },
        technology: {
          type: "string",
          description: "Filter by specific technology (React, Node.js, Python, etc.)",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)",
          default: 10
        }
      },
      required: ["query"]
    },
  },
  {
    name: "get_project",
    description: "Get detailed information about a specific project by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Project ID (e.g., 'mcp-server', 'portfolio-website')",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_projects",
    description: "List all projects with optional sorting and filtering",
    inputSchema: {
      type: "object",
      properties: {
        sortBy: {
          type: "string",
          description: "Field to sort by",
          enum: ["created", "name", "impact", "status"],
          default: "created"
        },
        order: {
          type: "string",
          description: "Sort order",
          enum: ["asc", "desc"],
          default: "desc"
        }
      }
    },
  },
  {
    name: "get_project_stats",
    description: "Get portfolio statistics including technology distribution, project counts, and recent projects",
    inputSchema: {
      type: "object",
      properties: {}
    },
  },
  {
    name: "query_blogs",
    description: "Search and query blog posts based on title, description, or keywords",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (keywords, blog title, topic, etc.)",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)",
          default: 10
        }
      },
      required: ["query"]
    },
  },
  {
    name: "get_blog",
    description: "Get detailed information about a specific blog post by title or URL",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Blog post title (partial matches allowed)",
        },
        url: {
          type: "string",
          description: "Exact blog post URL",
        }
      }
    },
  },
  {
    name: "list_blogs",
    description: "List all blog posts with optional sorting",
    inputSchema: {
      type: "object",
      properties: {
        sortBy: {
          type: "string",
          description: "Field to sort by",
          enum: ["title", "url"],
          default: "title"
        },
        order: {
          type: "string",
          description: "Sort order",
          enum: ["asc", "desc"],
          default: "asc"
        }
      }
    },
  },
  {
    name: "get_blog_stats",
    description: "Get blog statistics including topic distribution, total count, and recent posts",
    inputSchema: {
      type: "object",
      properties: {}
    },
  },
  {
    name: "search_all",
    description: "Search across both projects and blogs simultaneously with unified results",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to find across projects and blogs",
        },
        limit: {
          type: "number",
          description: "Maximum total results to return (default: 10)",
          default: 10
        }
      },
      required: ["query"]
    },
  }
];

export async function callTool(name, args) {
  switch (name) {
    case "echo":
      return {
        content: [
          {
            type: "text",
            text: `Echo: ${args.message}`,
          },
        ],
      };

    case "add":
      const result = args.a + args.b;
      return {
        content: [
          {
            type: "text",
            text: `${args.a} + ${args.b} = ${result}`,
          },
        ],
      };

    case "query_projects":
      const queryResult = queryProjects(args.query, {
        category: args.category,
        status: args.status,
        impact: args.impact,
        technologies: args.technology,
        limit: args.limit || 10
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              query: args.query,
              found: queryResult.total,
              results: queryResult.results.map(project => ({
                id: project.id,
                name: project.name,
                description: project.description,
                technologies: project.technologies,
                impact: project.impact,
                status: project.status,
                category: project.category,
                links: project.links,
                highlights: project.highlights,
                relevanceScore: project.relevanceScore
              }))
            }, null, 2),
          },
        ],
      };

    case "get_project":
      const project = getProjectById(args.id);
      if (!project) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: `Project with ID '${args.id}' not found`,
                suggestion: "Use list_projects to see available project IDs"
              }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(project, null, 2),
          },
        ],
      };

    case "list_projects":
      const allProjects = getAllProjects({
        sortBy: args.sortBy || 'created',
        order: args.order || 'desc'
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              totalProjects: allProjects.projects.length,
              projects: allProjects.projects.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                technologies: p.technologies,
                status: p.status,
                impact: p.impact,
                category: p.category,
                created: p.created,
                links: p.links
              })),
              metadata: allProjects.metadata
            }, null, 2),
          },
        ],
      };

    case "get_project_stats":
      const stats = getProjectStats();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };

    case "query_blogs":
      const blogQueryResult = queryBlogs(args.query, {
        limit: args.limit || 10
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              query: args.query,
              found: blogQueryResult.total,
              results: blogQueryResult.results
            }, null, 2),
          },
        ],
      };

    case "get_blog":
      let blog = null;
      if (args.title) {
        blog = getBlogByTitle(args.title);
      } else if (args.url) {
        blog = getBlogByUrl(args.url);
      }
      
      if (!blog) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: `Blog not found`,
                suggestion: "Use list_blogs to see available blog posts or try query_blogs with keywords"
              }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(blog, null, 2),
          },
        ],
      };

    case "list_blogs":
      const allBlogs = getAllBlogs({
        sortBy: args.sortBy || 'title',
        order: args.order || 'asc'
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              totalBlogs: allBlogs.blogs.length,
              blogs: allBlogs.blogs,
              metadata: allBlogs.metadata
            }, null, 2),
          },
        ],
      };

    case "get_blog_stats":
      const blogStats = getBlogStats();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(blogStats, null, 2),
          },
        ],
      };

    case "search_all":
      const unifiedResults = searchAll(args.query, {
        limit: args.limit || 10
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              query: args.query,
              totalFound: unifiedResults.total,
              breakdown: unifiedResults.breakdown,
              results: unifiedResults.results
            }, null, 2),
          },
        ],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}