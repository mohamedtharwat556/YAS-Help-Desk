// Upload endpoint for Vercel
module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // For Vercel, we can't handle file uploads the same way
      // Return a placeholder response
      res.status(200).json({
        success: true,
        message: 'File upload endpoint - not fully implemented for Vercel',
        data: {
          filename: 'placeholder',
          url: 'https://placeholder.com/file.jpg'
        }
      });
    } catch (error) {
      console.error('Upload endpoint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};