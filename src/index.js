#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';

class SimpleServer {
  constructor() {
    this.server = new Server({
      name: "simple-mcp-server",
      version: "1.0.0",
    }, {
      capabilities: {
        tools: {},
      },
    });

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
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
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

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

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Simple MCP server running on stdio");
  }
}

const server = new SimpleServer();
server.run().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});