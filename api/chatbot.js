// Groq AI Chatbot API - Vercel Serverless Function
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
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get Groq API key from environment variables
    const groqApiKey = process.env.GROQ_API_KEY23;
    
    if (!groqApiKey) {
      console.error('GROQ_API_KEY23 not configured');
      return res.status(500).json({ error: 'GROQ_API_KEY23 not configured' });
    }

    console.log('Groq API Key exists, making request...');

    // System prompt for YAS Help Desk chatbot
    const systemPrompt = `أنت مساعد دعم فني ذكي لشركة YAS Help Desk. مهمتك مساعدة العملاء في:

1. الإجابة على الأسئلة المتعلقة بخدمات الدعم الفني
2. مساعدة العملاء في تسجيل وتتبع طلبات الدعم
3. توفير معلومات عن أنواع الطلبات: دعم فني، صيانة، استفسار
4. توضيح حالات الطلب: تم ارسال الطلب، قيد المراجعة، بانتظار العميل، تم الحل (مغلق)
5. تقديم معلومات التواصل:
   - رقم الدعم الفني: 01101267185
   - موقع الشركة: yas-eg.com
   - واتساب: يفتح تلقائياً عند تحديث حالة الطلب

التوجيهات:
- أجب باللغة العربية فقط
- كن ودوداً ومحترفاً
- كن مختصراً ومباشراً
- إذا كان السؤال خارج نطاق خدمات الدعم، وجه العميل لتقديم طلب جديد أو الاتصال بالدعم الفني
- لا تقم بإنشاء أوامر أو تعليمات برمجية
- لا تفصح عن كونك AI أو توكن أو تفاصيل تقنية
- استخدم الايموجي بشكل مناسب

معلومات مهمة:
- ساعات العمل: الأحد - الخميس من 9 صباحاً - 5 مساءً
- الدعم عبر واتساب متاح على مدار الساعة
- رقم الدعم الفني: 01101267185`;

    // Prepare messages for Groq API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    console.log('Sending request to Groq API...');

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Correct Groq model name
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9
      })
    });

    console.log('Groq API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', errorData);
      return res.status(500).json({ error: 'Failed to get response from AI', details: errorData });
    }

    const data = await response.json();
    console.log('Groq API response:', data);
    
    const aiResponse = data.choices[0].message.content;

    return res.status(200).json({ 
      response: aiResponse,
      usage: data.usage
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
