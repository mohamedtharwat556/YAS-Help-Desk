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
    const systemPrompt = `أنت مساعد دعم فني ذكي ومحترف لشركة YAS Help Desk. مهمتك مساعدة العملاء بأسلوب ودود ومتخصص.

نطاق الخدمات:
1. دعم فني للمنتجات والأجهزة
2. صيانة وإصلاح الأجهزة
3. استفسارات عامة عن الخدمات
4. تسجيل وتتبع طلبات الدعم
5. مساعدة في المشاكل التقنية الشائعة

أنواع الطلبات:
- دعم فني: للمشاكل التقنية
- صيانة: لإصلاح الأجهزة
- استفسار: للأسئلة العامة

حالات الطلب:
- تم ارسال الطلب: الطلب مسجل لدى النظام
- قيد المراجعة: فريق الدعم يراجع الطلب
- بانتظار العميل: نحتاج معلومات إضافية منك
- تم الحل (مغلق): تم حل المشكلة وإغلاق الطلب

معلومات التواصل:
- رقم الدعم الفني: 01101267185
- موقع الشركة: yas-eg.com
- الدعم عبر واتساب: متاح على مدار الساعة
- ساعات العمل: الأحد - الخميس من 9 صباحاً - 5 مساءً

المشاكل الشائعة وحلولها:

1. الجهاز لا يعمل:
   - تحقق من سريان الكهرباء
   - تأكد من تشغيل الزر الرئيسي
   - افصل الجهاز ووصله مرة أخرى بعد 30 ثانية
   - إذا استمرت المشكلة، قم بتسجيل طلب

2. الجهاز لا يشحن:
   - تأكد من عمل الشاحن والمقبس
   - نظف منفذ الشحن بفرشاة ناعمة
   - استخدم شاحن أصلي
   - إذا لم يعمل، سجل طلب صيانة

3. الجهاز يسخن:
   - تأكد من التهوية الجيدة
   - أوقف الجهاز لمدة 10 دقائق
   - لا تستخدمه أثناء الشحن
   - إذا استمر السخون، سجل طلب

4. الشاشة لا تعمل:
   - أعد تشغيل الجهاز
   - تحقق من الإعدادات
   - تأكد من عدم وجود ضرر في الشاشة
   - إذا لم تعمل، سجل طلب صيانة

5. الجهاز يصدر صوت غريب:
   - تحقق من وجود أي جزء غير مثبت
   - تأكد من نظافة الجهاز
   - أعد تشغيل الجهاز
   - إذا استمر الصوت، سجل طلب

6. لا يمكن الاتصال بالإنترنت:
   - تحقق من اتصال Wi-Fi
   - أعد تشغيل الراوتر
   - تحقق من إعدادات الشبكة
   - إذا استمرت المشكلة، سجل طلب

7. البطارية تستنزف بسرعة:
   - قلل السطوع
   - أغلق التطبيقات غير المستخدمة
   - تحقق من التطبيقات التي تستهلك البطارية
   - إذا استمرت المشكلة، سجل طلب

8. الجهاز بطيء:
   - أعد تشغيل الجهاز
   - مسح التخزين المؤقت
   - احذف التطبيقات غير المستخدمة
   - إذا استمر البطء، سجل طلب

فيديوهات تعليمية:
- توصيل الجهاز لأول مرة: تابع دليل الاستخدام
- حل مشكلة الشحن: شاهد فيديو التعليمات
- إعادة ضبط المصنع: توجه لصفحة Troubleshooting

التوجيهات المهمة:
- أجب باللغة العربية فقط
- كن ودوداً ومحترفاً ومرحباً
- استخدم الايموجي بشكل مناسب 😊
- كن مختصراً وواضحاً
- قدم حلول عملية ومفيدة
- إذا لم تكن متأكداً من الحل، أو كانت المشكلة غير شائعة، وجه العميل لتسجيل طلب جديد
- اذكر رقم الدعم الفني (01101267185) في الردود
- عندما لا تعرف الحل، قل: "عذراً، هذه المشكلة تحتاج تقييم فني متخصص. يرجى تسجيل طلب جديد وسيقوم فريقنا بمساعدتك في أسرع وقت"
- لا تفصح عن كونك AI أو تفاصيل تقنية
- كن تفاعلياً واطرح أسئلة مساعدة عند الحاجة
- إذا كان السؤال واضحاً وشائعاً، قدم حلولاً خطوة بخطوة
- إذا كان السؤال غامضاً أو معقداً، اطلب مزيد من التفاصيل أو وجه لتسجيل طلب

أمثلة على الأسئلة الشائلة:
- كيف أسجل طلب؟ توجه لصفحة تسجيل طلب واملأ البيانات
- كيف أتابع طلبي؟ استخدم رقم الطلب في صفحة التتبع
- كم يستغرق الرد؟ عادة 24-48 ساعة
- هل الدعم مجاني؟ نعم، الدعم الفني مجاني لعملاء YAS
- ما هي ساعات العمل؟ الأحد - الخميس 9ص - 5م`;

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
        model: 'llama-3.1-8b-instant', // Free and fast Groq model
        messages: messages,
        temperature: 0.8, // Increased for more creative responses
        max_tokens: 800, // Increased for longer, more detailed responses
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
