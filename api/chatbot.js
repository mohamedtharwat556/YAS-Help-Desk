// Chatbot endpoint using Groq API (free and fast) with fallback
const { createClient } = require('@supabase/supabase-js');

const groqApiKey = process.env.GROQ_API_KEY;

// Simple rule-based responses as fallback
const ruleBasedResponses = {
  'مرحبا': 'مرحباً! 👋 أنا مساعد الدعم الذكي. كيف يمكنني مساعدتك اليوم؟',
  'السلام': 'وعليكم السلام! 🌟 أهلاً بك. كيف يمكنني مساعدتك؟',
  'أهلا': 'أهلاً بك! 😊 أنا هنا لمساعدتك. اسألني أي شيء عن خدمة الدعم.',
  'مساعدة': 'بالتأكيد! أنا هنا لمساعدتك في:
• تسجيل طلب دعم فني
• تتبع حالة طلبك
• دليل حل المشاكل الذاتي
• معلومات الاتصال

ماذا تحتاج؟',
  'طلب': 'لتسجيل طلب دعم فني، اذهب إلى صفحة تسجيل الطلب:
https://yas-help-desk.vercel.app/support.html

يمكنك ملء النموذج وسيتم إنشاء التذكرة فوراً.',
  'تتبع': 'لتتبع طلبك، اذهب إلى صفحة التتبع:
https://yas-help-desk.vercel.app/tracking.html

أدخل رقم التذكرة لمعرفة حالتها.',
  'دعم': 'نحن نقدم دعم فني لجميع الأجهزة (لابتوب، كمبيوتر، طابعات، شبكات، برمجيات).
\nللتواصل المباشر: +201101267185 (واتساب)',
  'واتساب': 'يمكنك التواصل معنا على واتساب:
https://wa.me/201101267185\n\nEng. Adam Farouk سيقوم بمساعدتك.',
  'آدم': 'Eng. Adam Farouk هو المهندس المسؤول عن الدعم الفني.\nواتساب: +201101267185',
  'مشكلة': 'إذا كنت تواجه مشكلة، يمكنك:
1. زيارة دليل حل المشاكل: https://yas-help-desk.vercel.app/troubleshooting.html
2. تسجيل طلب دعم فني
3. التواصل معنا على واتساب',
  'وقت': 'مواعيد العمل: متاح دايماً على مدار الساعة ⏰',
  'أوقات': 'نحن متاحون 24/7 على مدار الساعة للمساعدة!',
  'دليل': 'دليل حل المشاكل الذاتي متاح هنا:
https://yas-help-desk.vercel.app/troubleshooting.html\n\nيحتوي على مقالات وحلول شائعة.',
  'default': 'شكراً لرسالتك! 🤖\n\nإذا كان سؤالك يتعلق بالدعم الفني، يمكنك:\n• تسجيل طلب: https://yas-help-desk.vercel.app/support.html\n• تتبع طلب: https://yas-help-desk.vercel.app/tracking.html\n• دليل المشاكل: https://yas-help-desk.vercel.app/troubleshooting.html\n• واتساب: +201101267185\n\nأو سألني مرة أخرى بشكل مختلف!'
};

function getRuleBasedResponse(message) {
  const lowerMessage = message.toLowerCase().trim();

  for (const [key, response] of Object.entries(ruleBasedResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return ruleBasedResponses.default;
}

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

  try {
    if (req.method === 'POST') {
      const { message, conversationHistory = [] } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      console.log('[Chatbot] User message:', message);

      // Try Groq API if key is configured
      if (groqApiKey) {
        console.log('[Chatbot] API Key configured, trying Groq...');

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

        console.error('[Chatbot] All models failed, using fallback. Last error:', lastError);
      } else {
        console.log('[Chatbot] No API key, using rule-based responses');
      }

      // Fallback to rule-based responses
      const fallbackResponse = getRuleBasedResponse(message);
      console.log('[Chatbot] Using fallback response');

      return res.status(200).json({
        success: true,
        message: fallbackResponse
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[Chatbot] Error:', error);

    // Even on error, try to give a response
    const fallbackResponse = getRuleBasedResponse(req.body?.message || '');
    return res.status(200).json({
      success: true,
      message: fallbackResponse
    });
  }
};
