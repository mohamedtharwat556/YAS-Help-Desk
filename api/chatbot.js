// Chatbot endpoint using Groq API (free and fast)
const { createClient } = require('@supabase/supabase-js');

const groqApiKey = process.env.GROQ_API_KEY;

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!groqApiKey) {
    console.error('[Chatbot] Groq API key not configured');
    return res.status(500).json({ error: 'Chatbot not configured' });
  }

  try {
    if (req.method === 'POST') {
      const { message, conversationHistory = [] } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      console.log('[Chatbot] User message:', message);

      // Prepare messages for Groq
      const messages = [
        {
          role: 'system',
          content: `أنت مساعد خدمة عملاء لـ YAS Help Desk. مهمتك مساعدة العملاء في:
- الإجابة عن الأسئلة المتعلقة بالدعم الفني
- شرح كيفية استخدام موقع الدعم
- توجيه العملاء للصفحات المناسبة
- المساعدة في تسجيل الطلبات وتتبعها
- الإجابة عن أوقات العمل ومعلومات الاتصال

كن ودوداً ومحترفاً. أجب باللغة العربية.
إذا سئلت عن شيء خارج نطاق الدعم، اشرح أنك مساعد خدمة عملاء.
إذا احتجت مساعدة من مهندس الدعم، أخبر العميل بالتواصل مع Eng. Adam Farouk على واتساب: +201101267185

روابط الموقع: https://yas-help-desk.vercel.app/
رابط تسجيل الطلب: https://yas-help-desk.vercel.app/support.html
رابط تتبع الطلب: https://yas-help-desk.vercel.app/tracking.html
رابط دليل المشاكل: https://yas-help-desk.vercel.app/troubleshooting.html`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      // Call Groq API
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const groqData = await groqResponse.json();

      if (groqData.error) {
        console.error('[Chatbot] Groq API error:', groqData.error);
        return res.status(500).json({ error: 'Failed to get response from AI' });
      }

      const assistantMessage = groqData.choices[0]?.message?.content || 'عذراً، حدث خطأ في المعالجة';

      console.log('[Chatbot] AI response:', assistantMessage);

      res.status(200).json({
        success: true,
        message: assistantMessage
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[Chatbot] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
