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

  console.log('[Chatbot] API Key configured:', !!groqApiKey);
  console.log('[Chatbot] API Key length:', groqApiKey?.length || 0);

  if (!groqApiKey) {
    console.error('[Chatbot] Groq API key not configured');
    return res.status(500).json({ error: 'Chatbot not configured - API key missing' });
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

      // Call Groq API with multiple model options
      const models = ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768'];
      let lastError = null;

      for (const model of models) {
        try {
          console.log('[Chatbot] Trying model:', model);

          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model,
              messages: messages,
              temperature: 0.7,
              max_tokens: 1024
            })
          });

          const groqData = await groqResponse.json();

          console.log('[Chatbot] Groq response status:', groqResponse.status);
          console.log('[Chatbot] Groq response:', JSON.stringify(groqData, null, 2));

          if (groqResponse.ok && groqData.choices && groqData.choices.length > 0) {
            const assistantMessage = groqData.choices[0]?.message?.content || 'عذراً، حدث خطأ في المعالجة';

            console.log('[Chatbot] AI response:', assistantMessage);

            return res.status(200).json({
              success: true,
              message: assistantMessage
            });
          } else {
            lastError = groqData.error || 'Unknown error';
            console.error('[Chatbot] Model failed:', model, lastError);
          }
        } catch (modelError) {
          lastError = modelError;
          console.error('[Chatbot] Model error:', model, modelError);
        }
      }

      // All models failed
      console.error('[Chatbot] All models failed. Last error:', lastError);
      return res.status(500).json({
        error: 'Failed to get response from AI',
        details: lastError?.message || lastError
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[Chatbot] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
