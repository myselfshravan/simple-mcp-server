export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'simple-mcp-server',
    version: '1.0.0'
  });
}