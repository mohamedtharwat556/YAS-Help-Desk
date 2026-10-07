// Chatbot endpoint - Rule-based responses
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

      const responses = {
        'مرحبا': 'مرحباً! 👋 أنا مساعد الدعم الذكي. كيف يمكنني مساعدتك اليوم؟',
        'السلام': 'وعليكم السلام! 🌟 أهلاً بك. كيف يمكنني مساعدتك؟',
        'أهلا': 'أهلاً بك! 😊 أنا هنا لمساعدتك.',
        'مساعدة': 'بالتأكيد! أنا هنا لمساعدتك في تسجيل الطلبات وتتبعها وحل المشاكل.',
        'طلب': 'لتسجيل طلب دعم فني، اذهب إلى: https://yas-help-desk.vercel.app/support.html',
        'تتبع': 'لتتبع طلبك، اذهب إلى: https://yas-help-desk.vercel.app/tracking.html',
        'دعم': 'نقدم دعم فني لجميع الأجهزة. واتساب: +201101267185',
        'واتساب': 'واتساب: https://wa.me/201101267185',
        'مشكلة': 'دليل حل المشاكل: https://yas-help-desk.vercel.app/troubleshooting.html',
        'وقت': 'مواعيد العمل: متاح دايماً 24/7 ⏰',
        'default': 'شكراً لرسالتك! 🤖\n\n• تسجيل طلب: https://yas-help-desk.vercel.app/support.html\n• تتبع طلب: https://yas-help-desk.vercel.app/tracking.html\n• دليل المشاكل: https://yas-help-desk.vercel.app/troubleshooting.html\n• واتساب: +201101267185'
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
