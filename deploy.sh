#!/bin/bash

set -e

echo "Building MCP server..."
docker build -t simple-mcp-server .

echo "Running MCP server..."
docker run -d --name mcp-server-instance -p 3000:3000 simple-mcp-server

echo "MCP server deployed successfully!"
echo "Server is running on port 3000"