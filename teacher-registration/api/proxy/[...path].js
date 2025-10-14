export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get the path array from query
  const { path } = req.query;
  
  // Reconstruct the full path
  const fullPath = Array.isArray(path) ? '/' + path.join('/') : '/' + path;
  
  // Backend URL
  const backendUrl = `http://203.83.46.48:40700${fullPath}`;

  console.log('Proxying to:', backendUrl);
  console.log('Method:', req.method);
  console.log('Body:', req.body);

  try {
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    // Add body for POST/PUT/PATCH
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(backendUrl, options);
    const data = await response.json();

    console.log('Backend response:', response.status);
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy failed',
      message: error.message
    });
  }
}