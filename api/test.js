export default function handler(req, res) {
  console.log('🟢 TEST ENDPOINT CALLED');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  res.status(200).json({
    success: true,
    message: 'Vercel API endpoint is working!',
    method: req.method,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: true
  });
}