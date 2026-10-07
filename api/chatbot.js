// Chatbot endpoint - Hugging Face API (free)
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

      console.log('[Chatbot] API Key exists:', !!hfApiKey);

      // Try Hugging Face API
      if (hfApiKey) {
        try {
          const systemPrompt = `أنت مساعد خدمة عملاء لـ YAS Help Desk. مهمتك مساعدة العملاء في:
- الإجابة عن الأسئلة المتعلقة بالدعم الفني
- شرح كيفية استخدام موقع الدعم
- توجيه العملاء للصفحات المناسبة
- المساعدة في تسجيل الطلبات وتتبعها
- الإجابة عن أوقات العمل ومعلومات الاتصال

كن ودوداً ومحترفاً. أجب باللغة العربية باللهجة المصرية الطبيعية.
إذا سئلت عن شيء خارج نطاق الدعم، اشرح أنك مساعد خدمة عملاء.
إذا احتجت مساعدة من مهندس الدعم، أخبر العميل بالتواصل مع Eng. Adam Farouk على واتساب: +201101267185

روابط الموقع: https://yas-help-desk.vercel.app/
رابط تسجيل الطلب: https://yas-help-desk.vercel.app/support.html
رابط تتبع الطلب: https://yas-help-desk.vercel.app/tracking.html
رابط دليل المشاكل: https://yas-help-desk.vercel.app/troubleshooting.html`;

          const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hfApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inputs: `<s>[INST] ${systemPrompt}\n\nالعميل: ${message} [/INST]`,
              parameters: {
                max_new_tokens: 512,
                temperature: 0.7,
                return_full_text: false
              }
            })
          });

          const data = await response.json();

          console.log('[Chatbot] HF response status:', response.status);

          if (response.ok && data && data[0]) {
            const aiMessage = data[0].generated_text;
            console.log('[Chatbot] AI response received');
            return res.status(200).json({
              success: true,
              message: aiMessage
            });
          } else {
            console.error('[Chatbot] HF API error:', data);
          }
        } catch (apiError) {
          console.error('[Chatbot] HF API error:', apiError);
        }
      } else {
        console.log('[Chatbot] No API key configured');
      }

      // Fallback response
      return res.status(200).json({
        success: true,
        message: 'عذراً، AI غير متاح حالياً. يمكنك:\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب: +201101267185</a>'
      });
    } catch (error) {
      console.error('[Chatbot] Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
