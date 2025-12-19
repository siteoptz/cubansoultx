export default async function handler(req, res) {
  console.log('🟢 TEST ENDPOINT CALLED');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  res.status(200).json({
    success: true,
    message: 'API endpoint is working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}