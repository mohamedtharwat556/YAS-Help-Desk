// WhatsApp Business API - Vercel Serverless Function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message, type = 'text' } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    // Get WhatsApp credentials from environment variables
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      console.error('WhatsApp credentials not configured');
      return res.status(500).json({ error: 'WhatsApp credentials not configured' });
    }

    console.log('Sending WhatsApp message to:', to);

    // WhatsApp Business API endpoint
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    const body = {
      messaging_product: 'whatsapp',
      to: to, // Phone number in format: 20155551234 (without + or country code)
      type: type,
      [type]: {
        body: message
      }
    };

    // Send message to WhatsApp API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log('WhatsApp API response:', data);

    if (!response.ok) {
      console.error('WhatsApp API error:', data);
      return res.status(500).json({ error: 'Failed to send WhatsApp message', details: data });
    }

    return res.status(200).json({ 
      success: true,
      messageId: data.messages[0].id
    });

  } catch (error) {
    console.error('WhatsApp API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
