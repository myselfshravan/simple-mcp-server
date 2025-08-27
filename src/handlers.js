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

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}