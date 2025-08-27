import { 
  queryProjects, 
  getProjectById, 
  getAllProjects, 
  getProjectStats 
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

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}