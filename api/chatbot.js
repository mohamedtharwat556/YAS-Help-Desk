// Chatbot endpoint - Hugging Face API with simplified approach
const hfApiKey = process.env.HF_API_KEY;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message required' });
      }

      console.log('[Chatbot] Message:', message);
      console.log('[Chatbot] HF API Key exists:', !!hfApiKey);

      // Try Hugging Face API with model that doesn't require auth
      try {
        const prompt = `أنت مساعد خدمة عملاء بالعربية. ساعد العميل باللهجة المصرية الطبيعية.\n\nالعميل: ${message}\n\nالمساعد:`;

        const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
          method: 'POST',
          headers: hfApiKey ? {
            'Authorization': `Bearer ${hfApiKey}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 256,
              temperature: 0.7,
              return_full_text: false
            }
          })
        });

        const data = await response.json();
        console.log('[Chatbot] HF response status:', response.status);

        if (response.ok && data && (Array.isArray(data) ? data[0]?.generated_text : data.generated_text)) {
          const aiMessage = Array.isArray(data) ? data[0].generated_text : data.generated_text;
          console.log('[Chatbot] AI response:', aiMessage);
          return res.status(200).json({
            success: true,
            message: aiMessage
          });
        } else {
          console.error('[Chatbot] HF error:', data);
        }
      } catch (apiError) {
        console.error('[Chatbot] HF API error:', apiError);
      }

      // Enhanced fallback responses
      const responses = {
        'مرحبا': 'مرحباً! 👋 أنا مساعد الدعم الذكي. كيف يمكنني مساعدتك اليوم؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب جديد</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلبك</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل حل المشاكل</a>',
        'عامل': 'الحمد لله بخير! 😊 أنا مساعد الدعم الذكي.\n\nكيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب</a>',
        'عامل ايه': 'الحمد لله بخير! 😊 أنا مساعد الدعم الذكي.\n\nكيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب</a>',
        'ازيك': 'أنا بخير الحمد لله! 😊 كيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب جديد</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلبك</a>',
        'اية': 'أنا الحمد لله بخير! 😊\n\nكيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>',
        'ايه': 'أنا بخير الحمد لله! 😊\n\nكيف يمكنني مساعدتك؟',
        'طلب': 'لتسجيل طلب دعم فني:\n\n1. اذهب إلى <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">صفحة تسجيل الطلب</a>\n2. املأ بياناتك وبيانات الجهاز\n3. اصف المشكلة بالتفصيل\n4. اضغط "إرسال الطلب"',
        'تتبع': 'لتتبع طلبك:\n\n1. اذهب إلى <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">صفحة التتبع</a>\n2. أدخل رقم التذكرة\n3. ستظهر حالة طلبك وجميع التحديثات',
        'default': 'شكراً لرسالتك! 🤖\n\nيمكنني مساعدتك في:\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب دعم فني</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع حالة طلبك</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل حل المشاكل</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب الدعم: +201101267185</a>'
      };

      const lowerMessage = message.toLowerCase().trim();
      let response = responses.default;

      for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }

      return res.status(200).json({
        success: true,
        message: response
      });
    } catch (error) {
      console.error('[Chatbot] Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
