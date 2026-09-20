// Auth API endpoint for Vercel
// This is a placeholder - the full Express app should handle this
module.exports = function handler(req, res) {
  res.status(200).json({
    message: 'Auth API endpoint',
    method: req.method,
    path: req.url
  });
};