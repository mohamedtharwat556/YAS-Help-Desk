// Email notifications endpoint using Resend API
const resendApiKey = process.env.RESEND_API_KEY;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!resendApiKey) {
    console.error('[Email] Resend API key not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    if (req.method === 'POST') {
      const { to, subject, html, text } = req.body;

      if (!to || !subject) {
        return res.status(400).json({ error: 'to and subject are required' });
      }

      console.log('[Email] Sending email to:', to);
      console.log('[Email] Subject:', subject);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'YAS Help Desk <notifications@yas-help-desk.vercel.app>',
          to: to,
          subject: subject,
          html: html || text,
          text: text || html
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('[Email] Email sent successfully');
        return res.status(200).json({
          success: true,
          message: 'Email sent successfully'
        });
      } else {
        console.error('[Email] Resend API error:', data);
        return res.status(500).json({ error: 'Failed to send email', details: data });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[Email] Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
