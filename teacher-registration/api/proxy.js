export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // The backend URL is hardcoded for simplicity
  const backendUrl = 'http://203.83.46.48:40700/api/v1/auth/teacher/register/';

  console.log('=== PROXY CALLED ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  console.log('Calling:', backendUrl);

  try {
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (req.method === 'POST') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(backendUrl, options);
    const data = await response.json();

    console.log('Backend status:', response.status);
    console.log('Backend response:', data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Proxy failed',
      message: error.message
    });
  }
}