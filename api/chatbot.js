// Chatbot endpoint - Enhanced rule-based responses
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
        'مرحبا': 'مرحباً! 👋 أنا مساعد الدعم الذكي. كيف يمكنني مساعدتك اليوم؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب جديد</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلبك</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل حل المشاكل</a>',
        'السلام': 'وعليكم السلام! 🌟 أهلاً بك. كيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب جديد</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلبك</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب الدعم</a>',
        'أهلا': 'أهلاً بك! 😊 أنا هنا لمساعدتك.\n\nيمكنك:\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب دعم فني</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع حالة طلبك</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">حل مشاكلك بنفسك</a>',
        'عامل': 'الحمد لله بخير! 😊 أنا مساعد الدعم الذكي.\n\nكيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب</a>',
        'ازيك': 'أنا بخير الحمد لله! 😊 كيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب جديد</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلبك</a>',
        'الخير': 'الخير والفضل! 🌟 أنا هنا لمساعدتك.\n\nماذا تحتاج؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>',
        'الحمد': 'الحمد لله! 😊 أنا مساعد الدعم الذكي.\n\nكيف يمكنني مساعدتك؟',
        'اية': 'أنا الحمد لله بخير! 😊\n\nكيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>',
        'عامل ايه': 'الحمد لله بخير! 😊 أنا مساعد الدعم الذكي.\n\nكيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب</a>',
        'ايه': 'أنا بخير الحمد لله! 😊\n\nكيف يمكنني مساعدتك؟',
        'انت': 'أنا مساعد الدعم الذكي! 🤖\n\nأنا هنا لمساعدتك في الدعم الفني.\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>',
        'مساعدة': 'بالتأكيد! أنا هنا لمساعدتك في:\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب دعم فني</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع حالة طلبك</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل حل المشاكل الذاتي</a>\n• <a href="https://wa.me/201101267185" target="_blank">التواصل معنا على واتساب</a>',
        'طلب': 'لتسجيل طلب دعم فني:\n\n1. اذهب إلى <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">صفحة تسجيل الطلب</a>\n2. املأ بياناتك وبيانات الجهاز\n3. اصف المشكلة بالتفصيل\n4. اضغط "إرسال الطلب"\n\nسيتم إنشاء التذكرة فوراً وإرسالها لـ Eng. Adam Farouk على واتساب.',
        'تتبع': 'لتتبع طلبك:\n\n1. اذهب إلى <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">صفحة التتبع</a>\n2. أدخل رقم التذكرة\n3. ستظهر حالة طلبك وجميع التحديثات\n\nرقم التذكرة يبدأ بـ "YAS-SUP-"',
        'دعم': 'نقدم دعم فني لجميع الأجهزة:\n\n• لابتوب وكومبيوتر\n• طابعات\n• شبكات وإنترنت\n• برمجيات\n\nللتواصل المباشر: <a href="https://wa.me/201101267185" target="_blank">واتساب: +201101267185</a>',
        'واتساب': 'يمكنك التواصل معنا على واتساب:\n\n<a href="https://wa.me/201101267185" target="_blank">واتساب: +201101267185</a>\n\nEng. Adam Farouk سيقوم بمساعدتك.',
        'آدم': 'Eng. Adam Farouk هو المهندس المسؤول عن الدعم الفني.\n\nواتساب: <a href="https://wa.me/201101267185" target="_blank">+201101267185</a>',
        'مشكلة': 'إذا كنت تواجه مشكلة:\n\n1. <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل حل المشاكل الذاتي</a> - مقالات وحلول شائعة\n2. <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب دعم فني</a>\n3. <a href="https://wa.me/201101267185" target="_blank">واتساب الدعم</a>',
        'وقت': 'مواعيد العمل: متاح دايماً 24/7 ⏰\n\nنحن هنا لمساعدتك في أي وقت!',
        'أوقات': 'نحن متاحون 24/7 على مدار الساعة للمساعدة! 🌟',
        'دليل': 'دليل حل المشاكل الذاتي:\n\n<a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">اضغط هنا</a>\n\nيحتوي على:\n• مقالات حل المشاكل\n• فيديوهات تعليمية\n• خطوات تفصيلية\n• نصائح وصيانة',
        'تقييم': 'بعد إغلاق طلبك، يمكنك تقييم الخدمة:\n\nاذهب إلى صفحة التتبع وسيظهر نموذج التقييم تلقائياً.',
        'استفسار': 'للاستفسار عن أي شيء:\n\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلبك</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب الدعم</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل المشاكل</a>',
        'سؤال': 'يمكنك سؤالنا عن:\n\n• حالة طلبك\n• معلومات الدعم\n• حل المشاكل\n• أوقات العمل\n\n<a href="https://wa.me/201101267185" target="_blank">واتساب: +201101267185</a>',
        'حالة': 'لمعرفة حالة طلبك:\n\nاذهب إلى <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">صفحة التتبع</a>\n\nأدخل رقم التذكرة لمعرفة حالتها.',
        'رقم': 'رقم التذكرة يبدأ بـ "YAS-SUP-"\n\nلمعرفة حالتك، اذهب إلى <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">صفحة التتبع</a>',
        'كيف': 'كيف يمكنني مساعدتك؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب جديد</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلبك</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل المشاكل</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب الدعم</a>',
        'لا': 'فهمت، هل يمكنك توضيح سؤالك؟\n\nأنا هنا لمساعدتك في:\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب</a>',
        'لا اعرف': 'لا تقلق! أنا هنا لمساعدتك.\n\nماذا تحتاج؟\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل المشاكل</a>',
        'محتاج': 'بالتأكيد! ماذا تحتاج؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب</a>',
        'عايز': 'تمام! ماذا تريد؟\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل المشاكل</a>',
        'اريد': 'تمام! أخبرني ماذا تريد.\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع طلب</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب</a>',
        'default': 'شكراً لرسالتك! 🤖\n\nيمكنني مساعدتك في:\n\n• <a href="https://yas-help-desk.vercel.app/support.html" target="_blank">تسجيل طلب دعم فني</a>\n• <a href="https://yas-help-desk.vercel.app/tracking.html" target="_blank">تتبع حالة طلبك</a>\n• <a href="https://yas-help-desk.vercel.app/troubleshooting.html" target="_blank">دليل حل المشاكل</a>\n• <a href="https://wa.me/201101267185" target="_blank">واتساب الدعم: +201101267185</a>\n\nأو اسألني مرة أخرى بشكل مختلف!'
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
