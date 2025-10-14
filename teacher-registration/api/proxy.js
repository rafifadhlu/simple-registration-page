export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Debug: Log the full request details
    const debugInfo = {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body
    };

    console.log('=== DEBUG INFO ===');
    console.log(JSON.stringify(debugInfo, null, 2));

    // Extract path after /api/proxy
    let path = req.url;
    
    // Remove /api/proxy from the beginning
    if (path.startsWith('/api/proxy')) {
      path = path.substring('/api/proxy'.length);
    }
    
    // If path is empty or just /, return error
    if (!path || path === '/') {
      return res.status(400).json({
        error: 'No API path provided',
        usage: 'Call /api/proxy/api/v1/auth/teacher/register/',
        received: req.url
      });
    }

    const apiUrl = `http://203.83.46.48:40700${path}`;

    console.log('=== PROXY REQUEST ===');
    console.log('Original URL:', req.url);
    console.log('Extracted path:', path);
    console.log('Target API URL:', apiUrl);

    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    // Add body for POST/PUT/PATCH requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = typeof req.body === 'string' 
        ? req.body 
        : JSON.stringify(req.body);
      
      console.log('Request body:', fetchOptions.body);
    }

    const response = await fetch(apiUrl, fetchOptions);
    const text = await response.text();
    
    console.log('=== BACKEND RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('Body:', text.substring(0, 500));

    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch (e) {
      console.error('Failed to parse JSON');
      return res.status(response.status).json({
        error: 'Backend returned non-JSON response',
        status: response.status,
        contentType: response.headers.get('content-type'),
        preview: text.substring(0, 500)
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      stack: error.stack
    });
  }
}