import { callTool } from '../src/handlers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { name, arguments: args } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tool name is required' });
    }

    if (!args) {
      return res.status(400).json({ error: 'Tool arguments are required' });
    }

    const result = await callTool(name, args);
    res.status(200).json(result);
  } catch (error) {
    console.error('Tool execution error:', error);
    res.status(400).json({ 
      error: error.message || 'Tool execution failed' 
    });
  }
}