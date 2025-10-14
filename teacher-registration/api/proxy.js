export default async function handler(req, res) {
  // Enable CORS if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract the path after /api/proxy
  const path = req.url.replace('/api/proxy', '');
  const apiUrl = `http://203.83.46.48:40700${path}`;

  console.log('=== PROXY REQUEST ===');
  console.log('URL:', apiUrl);
  console.log('Method:', req.method);
  console.log('Body:', req.body);

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add body for POST/PUT/PATCH requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = typeof req.body === 'string' 
        ? req.body 
        : JSON.stringify(req.body);
    }

    const response = await fetch(apiUrl, fetchOptions);
    
    // Get response as text first
    const text = await response.text();
    
    console.log('=== BACKEND RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Body preview:', text.substring(0, 300));

    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch (e) {
      // Backend returned HTML or invalid JSON
      console.error('Failed to parse JSON:', e.message);
      return res.status(response.status).json({
        error: 'Backend returned non-JSON response',
        status: response.status,
        preview: text.substring(0, 500)
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
}