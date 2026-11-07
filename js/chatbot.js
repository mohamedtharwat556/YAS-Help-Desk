// Chatbot Widget - 3D Enhanced with Smart FAQ System
class ChatbotWidget {
  constructor() {
    this.isOpen = false;
    this.conversationHistory = [];
    this.faqDatabase = this.buildFAQDatabase();
    this.loadConversationHistory(); // Load from localStorage
    this.init();
  }

  buildFAQDatabase() {
    return {
      // General Questions
      'مرحبا': 'مرحباً بك! 👋 أنا مساعد الدعم الذكي لـ YAS Help Desk. كيف يمكنني مساعدتك اليوم؟',
      'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته! 🤝 أهلاً بك في خدمة الدعم الفني. كيف يمكنني مساعدتك؟',
      'من انت': 'أنا مساعد الدعم الذكي لـ YAS Help Desk 🤖، مساعدك الافتراضي للإجابة على استفساراتك ومساعدتك في أي وقت!',
      'ماذا تفعل': 'أنا هنا لمساعدتك في:\n✅ الإجابة على الأسئلة الشائعة\n✅ توجيهك إلى الصفحات المناسبة\n✅ تقديم الدعم الفني الأساسي\n✅ مساعدتك في تتبع طلباتك',
      'اهلا': 'أهلاً بك! 😊 كيف يمكنني مساعدتك اليوم؟',
      'اهلا بك': 'أهلاً بك في YAS Help Desk! 🤝 أنا هنا لمساعدتك.',
      'مرحبا بك': 'مرحباً بك في خدمة الدعم الفني! 👋 كيف يمكنني مساعدتك؟',
      'صباح الخير': 'صباح الخير! ☀️ أهلاً بك. كيف يمكنني مساعدتك اليوم؟',
      'مساء الخير': 'مساء الخير! 🌙 أهلاً بك. كيف يمكنني مساعدتك؟',
      'السلام': 'وعليكم السلام! 🤝 كيف يمكنني مساعدتك؟',
      'هلا': 'أهلاً بك! 😊 كيف يمكنني مساعدتك؟',
      'هاي': 'أهلاً بك! 😊 كيف يمكنني مساعدتك؟',

      // Support & Tickets
      'كيف اساعد': 'يمكنك:\n1. إنشاء طلب دعم جديد من خلال نموذج تسجيل الطلب\n2. تتبع حالة طلبك باستخدام رقم الطلب\n3. التواصل معنا عبر واتساب\n\nالدعم الفني: 01101267185',
      'تسجيل طلب': 'لتسجيل طلب دعم جديد، اضغط على زر "تسجيل طلب" في الصفحة الرئيسية أو اذهب إلى صفحة الدعم. ستحتاج لتوفير بياناتك وبيانات الجهاز.\n\nالدعم الفني: 01101267185',
      'كيف اسجل طلب': 'لتسجيل طلب دعم جديد:\n1. اذهب إلى صفحة "تسجيل طلب"\n2. املأ بياناتك وبيانات الجهاز\n3. اصف المشكلة بالتفصيل\n4. أرفق صورة إن أمكن\n\nالدعم الفني: 01101267185',
      'انشاء طلب': 'لإنشاء طلب جديد، اذهب إلى صفحة تسجيل الطلب في القائمة العلوية.\n\nالدعم الفني: 01101267185',
      'طلب جديد': 'لإنشاء طلب دعم جديد، اضغط على زر "تسجيل طلب" أو اذهب إلى صفحة الدعم.\n\nالدعم الفني: 01101267185',
      'تتبع طلب': 'لتتبع طلبك، استخدم رقم الطلب (مثل: YAS-SUP-XXXXX) في صفحة التتبع. يمكنك العثور على رقم الطلب في الرسالة التي وصلتك عند إنشاء الطلب.\n\nإذا واجهت مشكلة، اتصل بنا: 01101267185',
      'كيف اتابع طلبي': 'لتتبع طلبك:\n1. اذهب إلى صفحة "تتبع طلب"\n2. أدخل رقم الطلب (YAS-SUP-XXXXX)\n3. سترى حالة طلبك وتفاصيله\n\nالدعم الفني: 01101267185',
      'استعلام عن طلب': 'للاستعلام عن طلبك، استخدم رقم الطلب في صفحة التتبع.\n\nالدعم الفني: 01101267185',
      'حالة الطلب': 'حالات الطلب هي:\n1. تم ارسال الطلب\n2. قيد المراجعة\n3. بانتظار العميل\n4. تم الحل (مغلق)\n\nللاستفسار: 01101267185',
      'ما هي حالات الطلب': 'حالات الطلب هي:\n✅ تم ارسال الطلب - تم استلام طلبك\n✅ قيد المراجعة - الفني يراجع طلبك\n✅ بانتظار العميل - ننتظر استجابتك\n✅ تم الحل (مغلق) - تم حل المشكلة\n\nالدعم الفني: 01101267185',
      'كم يستغرق': 'وقت الرد يعتمد على نوع المشكلة:\n🔹 الاستفسارات: عادةً خلال 24 ساعة\n🔹 المشاكل التقنية: 1-3 أيام عمل\n🔹 حالات الطوارئ: أولوية قصوى\n\nالدعم الفني: 01101267185',
      'كم وقت': 'وقت الرد:\n• الاستفسارات: 24 ساعة\n• المشاكل التقنية: 1-3 أيام عمل\n• الطوارئ: فوري\n\nالدعم الفني: 01101267185',
      'متى يتم الرد': 'نرد عادةً خلال 24 ساعة للاستفسارات، و1-3 أيام عمل للمشاكل التقنية.\n\nالدعم الفني: 01101267185',

      // Contact & Support
      'تواصل': 'يمكنك التواصل معنا عبر:\n📱 واتساب: سيتم فتح واتساب تلقائياً عند تحديث حالة طلبك\n📞 الدعم الفني: 01101267185\n📧 البريد الإلكتروني: سيتم إرسال إشعارات إلى بريدك المسجل',
      'كيف اتصل': 'للتواصل معنا:\n📞 الهاتف: 01101267185\n📱 واتساب: سيتم فتح تلقائياً عند تحديث الطلب\n\nأو يمكنك تقديم طلب جديد.',
      'اتصل بكم': 'للتواصل معنا:\n📞 الهاتف: 01101267185\n📱 واتساب: سيتم فتح تلقائياً عند تحديث الطلب\n\nأو يمكنك تقديم طلب جديد.',
      'رقم الهاتف': 'رقم الدعم الفني: 01101267185\n\nيمكنك الاتصال بنا أو تقديم طلب جديد للتواصل مع فريق الدعم.',
      'واتساب': 'نعم، نستخدم واتساب كوسيلة تواصل أساسية! سيتم فتح واتساب تلقائياً عند تحديث حالة طلبك لإرسال التحديثات لك.\n\nالهاتف: 01101267185',
      'رقم واتساب': 'سيتم فتح واتساب تلقائياً عند تحديث حالة طلبك.\n\nللتواصل المباشر: 01101267185',
      'ايميل': 'البريد الإلكتروني يستخدم للإشعارات. تأكد من إدخال بريد صحيح عند تسجيل طلب لاستلام التحديثات.\n\nالدعم الفني: 01101267185',
      'بريد': 'البريد الإلكتروني يستخدم للإشعارات فقط. للتواصل المباشر، اتصل بنا على: 01101267185',
      'دعم فني': 'للتواصل مع الدعم الفني مباشرة:\n📞 الهاتف: 01101267185\n📱 واتساب: سيتم فتح تلقائياً عند تحديث الطلب\n\nأو يمكنك تقديم طلب جديد للتواصل معنا.',
      'رقم الدعم': 'رقم الدعم الفني: 01101267185\n\nيمكنك الاتصال بنا أو تقديم طلب جديد للتواصل مع فريق الدعم.',
      'هاتف': 'رقم الدعم الفني: 01101267185\n\nيمكنك الاتصال بنا أو تقديم طلب جديد للتواصل مع فريق الدعم.',
      'اتصل': 'للتواصل معنا مباشرة:\n📞 الهاتف: 01101267185\n📱 واتساب: سيتم فتح تلقائياً عند تحديث الطلب\n\nأو يمكنك تقديم طلب جديد.',

      // Technical Support
      'مشكلة': 'للإبلاغ عن مشكلة:\n1. اذهب إلى صفحة تسجيل الطلب\n2. اختر نوع المشكلة (دعم فني، صيانة، استفسار)\n3. صف المشكلة بالتفصيل\n4. أرفق صورة إن أمكن\n\nأو اتصل بنا مباشرة على: 01101267185',
      'عندي مشكلة': 'للإبلاغ عن مشكلة:\n1. اذهب إلى صفحة "تسجيل طلب"\n2. اختر نوع المشكلة\n3. اصف المشكلة بالتفصيل\n4. أرفق صورة إن أمكن\n\nالدعم الفني: 01101267185',
      'مشكلة في الجهاز': 'للإبلاغ عن مشكلة في الجهاز:\n1. اذهب إلى صفحة تسجيل الطلب\n2. اختر "دعم فني"\n3. اصف المشكلة بالتفصيل\n4. أرفق صورة إن أمكن\n\nالدعم الفني: 01101267185',
      'أنا بشكو عن مشكلة': 'حسناً! سأساعدك في تسجيل مشكلتك 📝\n\nسيتم نقلك تلقائياً إلى صفحة تسجيل الطلب.\n\nاكتب المشكلة بالتفصيل وسأرسلها للفني فوراً!',
      'بشكو': 'حسناً! سأساعدك في تسجيل مشكلتك 📝\n\nسيتم نقلك تلقائياً إلى صفحة تسجيل الطلب.\n\nاكتب المشكلة بالتفصيل وسأرسلها للفني فوراً!',
      'عايز أشكو': 'حسناً! سأساعدك في تسجيل مشكلتك 📝\n\nسيتم نقلك تلقائياً إلى صفحة تسجيل الطلب.\n\nاكتب المشكلة بالتفصيل وسأرسلها للفني فوراً!',
      'صيانة': 'لطلب صيانة:\n1. اختر "صيانة" كنوع الطلب\n2. وصف المشكلة بدقة\n3. حدد نوع الجهاز والموديل\n4. أرفق صورة للمشكلة إن أمكن\n\nالدعم الفني: 01101267185',
      'طلب صيانة': 'لطلب صيانة:\n1. اذهب إلى صفحة تسجيل الطلب\n2. اختر "صيانة"\n3. اصف المشكلة بدقة\n4. حدد نوع الجهاز\n\nالدعم الفني: 01101267185',
      'ضمان': 'للتحقق من الضمان:\n1. حدد تاريخ الشراء عند تسجيل الطلب\n2. حدد حالة الضمان (ساري/منتهي)\n3. سيقوم الفني بالتحقق من حالة الضمان\n\nللاستفسار: 01101267185',
      'هل الجهاز مضمون': 'للتحقق من الضمان، حدد تاريخ الشراء وحالة الضمان عند تسجيل الطلب. سيقوم الفني بالتحقق.\n\nالدعم الفني: 01101267185',
      'فحص الضمان': 'للتحقق من الضمان، أدخل تاريخ الشراء في طلبك. الفني سيقوم بالفحص.\n\nالدعم الفني: 01101267185',

      // Device & Serial
      'رقم تسلسلي': 'الرقم التسلسلي يحدد جهازك بدقة. عند تسجيل طلب:\n• اختر حالة الرقم التسلسلي\n• إذا كان "الكود موجود"، أدخل الرقم\n• إذا كان "غير موجود" أو "خلف الشاشة"، اختر الخيار المناسب',
      'كود غير موجود': 'لا مشكلة! يمكنك إنشاء طلب حتى بدون الرقم التسلسلي. اختر "الكود غير موجود" في حالة الرقم التسلسلي واستمر في إنشاء الطلب.',

      // Company Info
      'شركة': 'YAS هي شركة متخصصة في الدعم الفني وخدمة العملاء. نسعى لتقديم أفضل خدمة لعملائنا.\n🌐 موقعنا: yas-eg.com\n📞 الدعم الفني: 01101267185',
      'من انت YAS': 'YAS هي شركة متخصصة في الدعم الفني وخدمة العملاء.\n🌐 موقعنا: yas-eg.com\n📞 الدعم الفني: 01101267185',
      'عنوان': 'يمكنك العثور على معلومات الاتصال الكاملة في موقعنا الرسمي: yas-eg.com\n\nللاستفسار المباشر: 01101267185',
      'موقعكم': 'موقعنا الرسمي: yas-eg.com\n\nالدعم الفني: 01101267185',
      'ساعات العمل': 'ساعات الدعم:\n🕐 أيام العمل: الأحد - الخميس\n⏰ الساعة: 9 صباحاً - 5 مساءً\n📱 الدعم عبر واتساب: متاح على مدار الساعة\n📞 الهاتف: 01101267185',
      'متى تعملون': 'أيام العمل: الأحد - الخميس من 9 صباحاً - 5 مساءً. الدعم عبر واتساب متاح على مدار الساعة.\n\nالهاتف: 01101267185',
      'هل تعملون في الجمعة': 'نحن نعمل من الأحد إلى الخميس. الجمعة عطلة. الدعم عبر واتساب متاح على مدار الساعة.\n\nالهاتف: 01101267185',

      // Help & Navigation
      'صفحة': 'يمكنك التنقل بين الصفحات من خلال القائمة العلوية:\n• الرئيسية\n• تسجيل طلب\n• تتبع طلب\n• دليل حل المشاكل\n\nالدعم الفني: 01101267185',
      'اين صفحة': 'الصفحات في القائمة العلوية: الرئيسية، تسجيل طلب، تتبع طلب، دليل حل المشاكل.\n\nالدعم الفني: 01101267185',
      'دليل': 'دليل حل المشاكل يحتوي على حلول شائعة للعديد من المشاكل. اذهب إلى صفحة "دليل حل المشاكل" للعثور على الحلول.\n\nإذا لم تجد الحل، اتصل بنا: 01101267185',
      'حلول': 'دليل حل المشاكل يحتوي على حلول شائعة. اذهب إلى صفحة "دليل حل المشاكل".\n\nالدعم الفني: 01101267185',
      'تقييم': 'بعد حل طلبك، ستتلقى رابط تقييم عبر واتساب. تقييمك يساعدنا في تحسين خدماتنا! ⭐\n\nالدعم الفني: 01101267185',
      'كيف اقييم': 'بعد حل طلبك، ستتلقى رابط تقييم عبر واتساب. تقييمك يساعدنا في التحسين! ⭐\n\nالدعم الفني: 01101267185',

      // Request Types
      'انواع الطلبات': 'أنواع الطلبات المتاحة:\n✅ دعم فني - مشاكل تقنية\n✅ صيانة - إصلاح وصيانة\n✅ استفسار - أسئلة عامة\n✅ أخرى - أي طلب آخر\n\nالدعم الفني: 01101267185',
      'ما انواع الطلبات': 'أنواع الطلبات: دعم فني، صيانة، استفسار، أخرى.\n\nالدعم الفني: 01101267185',
      'دعم فني': 'دعم فني: للمشاكل التقنية واصلاح الأعطال.\n\nلطلب دعم فني: 01101267185',
      'استفسار': 'استفسار: للأسئلة العامة والاستفسارات.\n\nللاستفسار: 01101267185',

      // Thanks & Closing
      'شكرا': 'على الرحب والسعة! 😊 سعدنا بمساعدتك. هل هناك شيء آخر يمكنني مساعدتك فيه؟',
      'شكرا لكم': 'على الرحب والسعة! 😊 سعدنا بخدمتك.\n\nالدعم الفني: 01101267185',
      'مشكور': 'شكراً لك! 😊 نحن سعداء بخدمتك.\n\nالدعم الفني: 01101267185',
      'ممتاز': 'شكراً لك! نحن نسعى لتقديم أفضل خدمة.\n\nالدعم الفني: 01101267185',
      'رائع': 'شكراً لك! تقييمك يساعدنا في التحسين.\n\nالدعم الفني: 01101267185',
      'تم': 'تمام! إذا احتجت أي مساعدة أخرى، أنا هنا دائماً. 🤝\n\nالدعم الفني: 01101267185',
      'تمام': 'تمام! هل هناك شيء آخر يمكنني مساعدتك فيه؟\n\nالدعم الفني: 01101267185',
      'بالتوفيق': 'شكراً لك! بالتوفيق! 🌟\n\nالدعم الفني: 01101267185',
      'وداع': 'مع السلامة! 🌟 نتمنى لك يوماً سعيداً. نحن هنا دائماً لمساعدتك.\n\nالدعم الفني: 01101267185',
      'مع السلامة': 'مع السلامة! 🌟 نتمنى لك يوماً سعيداً.\n\nالدعم الفني: 01101267185',

      // Additional helpful phrases
      'اريد مساعدة': 'بالتأكيد! كيف يمكنني مساعدتك؟ يمكنك:\n1. إنشاء طلب دعم جديد\n2. تتبع حالة طلبك\n3. طرح سؤال حول خدماتنا\n\nالدعم الفني: 01101267185',
      'محتاج مساعدة': 'بالتأكيد! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'سؤال': 'تفضل بطرح سؤالك! سأبذل قصاراي للمساعدة.\n\nالدعم الفني: 01101267185',
      'استفسار عن': 'تفضل بالاستفسار عن ماذا تحتاج مساعدة.\n\nالدعم الفني: 01101267185',
      'لا اعرف': 'لا مشكلة! أنا هنا لمساعدتك. يمكنك:\n1. اختيار من الأسئلة الشائلة\n2. تقديم طلب جديد\n3. الاتصال بنا: 01101267185',
      'ماذا افعل': 'يمكنك:\n1. إنشاء طلب دعم جديد\n2. تتبع حالة طلبك\n3. الاتصال بنا: 01101267185',
      'ساعدني': 'بالتأكيد! أنا هنا لمساعدتك. يمكنك:\n1. طرح سؤال حول خدماتنا\n2. إنشاء طلب دعم جديد\n3. تتبع حالة طلبك\n\nالدعم الفني: 01101267185',
      'ممكن': 'تفضل! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'ايوه': 'أيوهاً! 👋 كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'نعم': 'نعم! أنا هنا لمساعدتك. ماذا تحتاج؟\n\nالدعم الفني: 01101267185',
      'لا': 'فهمت. يمكنك:\n1. صياغة سؤالك بشكل مختلف\n2. تقديم طلب جديد\n3. الاتصال بنا: 01101267185',
      'جهاز': 'للإبلاغ عن مشكلة في الجهاز، اذهب إلى صفحة تسجيل الطلب.\n\nالدعم الفني: 01101267185',
      'الموبايل': 'للإبلاغ عن مشكلة في الموبايل، اذهب إلى صفحة تسجيل الطلب.\n\nالدعم الفني: 01101267185',
      'التلفاز': 'للإبلاغ عن مشكلة في التلفاز، اذهب إلى صفحة تسجيل الطلب.\n\nالدعم الفني: 01101267185',
      'الحاسوب': 'للإبلاغ عن مشكلة في الحاسوب، اذهب إلى صفحة تسجيل الطلب.\n\nالدعم الفني: 01101267185',
      'لايعمل': 'للإبلاغ عن جهاز لا يعمل، اذهب إلى صفحة تسجيل الطلب.\n\nالدعم الفني: 01101267185',
      'يوجد عطل': 'للإبلاغ عن عطل، اذهب إلى صفحة تسجيل الطلب.\n\nالدعم الفني: 01101267185',
      'سريع': 'سرعة الرد:\n• الاستفسارات: 24 ساعة\n• المشاكل التقنية: 1-3 أيام عمل\n• الطوارئ: فوري\n\nالدعم الفني: 01101267185',
      'فورا': 'للحالات الطوارئ، نرد فوراً!\n\nالدعم الفني: 01101267185',
      'عاجل': 'للحالات الطوارئ، نرد فوراً!\n\nالدعم الفني: 01101267185',
      'كلام': 'تفضل بكتابة سؤالك بشكل واضح.\n\nالدعم الفني: 01101267185',
      'اكتب': 'تفضل بكتابة سؤالك بشكل واضح.\n\nالدعم الفني: 01101267185',
      'مساعدة': 'بالتأكيد! أخبرني كيف يمكنني مساعدتك.\n\nالدعم الفني: 01101267185',
      '01101267185': 'هذا هو رقم الدعم الفني! يمكنك الاتصال بنا مباشرة.\n\nأو يمكنك تقديم طلب جديد للتواصل معنا.',
      'العنوان': 'يمكنك العثور على معلومات الاتصال في موقعنا: yas-eg.com\n\nللاستفسار المباشر: 01101267185',
      'الفريق': 'فريق الدعم الفني جاهز لمساعدتك! اتصل بنا: 01101267185',
      'المسؤول': 'للتواصل مع المسؤول، اتصل بنا: 01101267185\n\nأو قم بزيارة موقعنا: yas-eg.com',
      'نحن': 'نحن فريق الدعم الفني في YAS! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'YAS': 'YAS هي شركة متخصصة في الدعم الفني وخدمة العملاء.\n🌐 موقعنا: yas-eg.com\n📞 الدعم الفني: 01101267185',
      'yas': 'YAS هي شركة متخصصة في الدعم الفني وخدمة العملاء.\n🌐 موقعنا: yas-eg.com\n📞 الدعم الفني: 01101267185',
      'الموقع': 'موقعنا الرسمي: yas-eg.com\n\nالدعم الفني: 01101267185',
      'الويب سايت': 'موقعنا الإلكتروني: yas-eg.com\n\nالدعم الفني: 01101267185',
      'موجود': 'نعم، أنا هنا للمساعدة! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'جاهز': 'نحن جاهزون لمساعدتك! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'بليز': 'بالتأكيد! أخبرني ما تحتاج.\n\nالدعم الفني: 01101267185',
      'معلومات': 'يمكنك الحصول على معلومات:\n1. موقعنا: yas-eg.com\n2. الدعم الفني: 01101267185\n3. تقديم طلب جديد\n\nالدعم الفني: 01101267185',
      'تفاصيل': 'للحصول على تفاصيل، اتصل بنا على: 01101267185\n\nأو قدم طلب جديد.',
      'كل شي': 'نقدم خدمات متعددة! اذهب إلى صفحة تسجيل الطلب لاختيار الخدمة المناسبة.\n\nالدعم الفني: 01101267185',
      'اي خدمات': 'نقدم:\n✅ دعم فني\n✅ صيانة\n✅ استفسار\n✅ تتبع الطلبات\n\nالدعم الفني: 01101267185',
      'عندي مشكلة': 'للمشكلة، يمكنك:\n1. تقديم طلب دعم فني\n2. الاتصال بنا: 01101267185\n\nنحن هنا لمساعدتك!',
      'عندي استفسار': 'للاستفسار، يمكنك:\n1. طرح سؤال محدد\n2. تقديم طلب استفسار\n3. الاتصال بنا: 01101267185\n\nنحن هنا لمساعدتك!',
      'عندي سؤال': 'تفضل بطرح سؤالك! سأبذل قصاراي للمساعدة.\n\nالدعم الفني: 01101267185',
      'جواب': 'سأبذل قصاراي للإجابة على سؤالك! 😊\n\nالدعم الفني: 01101267185',
      'الشات': 'أنا الشات بوت الذكي لـ YAS! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'البوت': 'أنا البوت الذكي لـ YAS! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'مساعد': 'أنا مساعد الدعم الذكي لـ YAS! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'انا': 'أنا مساعد الدعم الذكي لـ YAS! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'روبوت': 'أنا مساعد الدعم الذكي لـ YAS! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'لاا': 'فهمت. يمكنك:\n1. صياغة سؤالك بشكل مختلف\n2. تقديم طلب جديد\n3. الاتصال بنا: 01101267185',
      'صباح': 'صباح الخير! ☀️ كيف يمكنني مساعدتك؟',
      'مساء': 'مساء الخير! 🌙 كيف يمكنني مساعدتك؟',
      'صباح الخير': 'صباح الخير! ☀️ أهلاً بك. كيف يمكنني مساعدتك اليوم؟',
      'مساء الخير': 'مساء الخير! 🌙 أهلاً بك. كيف يمكنني مساعدتك اليوم؟',
      'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته! 🤝 أهلاً بك في خدمة الدعم الفني. كيف يمكنني مساعدتك؟',
      'السلام': 'وعليكم السلام! 🤝 كيف يمكنني مساعدتك؟',
      'اهلا': 'أهلاً بك! 😊 كيف يمكنني مساعدتك اليوم؟',
      'مرحبا': 'مرحباً بك! 👋 أنا مساعد الدعم الذكي لـ YAS Help Desk. كيف يمكنني مساعدتك اليوم؟',
      'مرحبا بك': 'مرحباً بك في خدمة الدعم الفني! 👋 كيف يمكنني مساعدتك؟',
      'هاي': 'أهلاً بك! 😊 كيف يمكنني مساعدتك اليوم؟',
      'هلا': 'أهلاً بك! 😊 كيف يمكنني مساعدتك؟',
      'من انت': 'أنا مساعد الدعم الذكي لـ YAS Help Desk 🤖، مساعدك الافتراضي للإجابة على استفساراتك ومساعدتك في أي وقت!',
      'من انتو': 'YAS هي شركة متخصصة في الدعم الفني وخدمة العملاء.\n🌐 موقعنا: yas-eg.com\n📞 الدعم الفني: 01101267185',
      'من انتم': 'YAS هي شركة متخصصة في الدعم الفني وخدمة العملاء.\n🌐 موقعنا: yas-eg.com\n📞 الدعم الفني: 01101267185',
      'ايش': 'أي خدمة تحتاج؟ يمكنني مساعدتك في:\n1. دعم فني\n2. صيانة\n3. استفسار\n\nالدعم الفني: 01101267185',
      'ماذا': 'ماذا تحتاج؟ أخبرني كيف يمكنني مساعدتك.\n\nالدعم الفني: 01101267185',
      'لا اعجبني': 'آسف أنا لم أستطع مساعدتك. يمكنك:\n1. صياغة سؤالك بشكل مختلف\n2. تقديم طلب جديد\n3. الاتصال بنا: 01101267185',
      'لم افهم': 'آسف أنا لم أفهم. يمكنك:\n1. صياغة سؤالك بشكل أوضح\n2. تقديم طلب جديد\n3. الاتصال بنا: 01101267185',
      'غير واضح': 'تفضل بكتابة سؤالك بشكل واضح ومحدد.\n\nالدعم الفني: 01101267185',
      'اكتب لي': 'تفضل بكتابة سؤالك بشكل واضح.\n\nالدعم الفني: 01101267185',
      'فهم': 'فهمت! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'فهمت': 'فهمت! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'حسنا': 'حسناً! كيف يمكنني مساعدتك؟\n\nالدعم الفني: 01101267185',
      'جيد': 'شكراً لك! نحن نسعى لتقديم أفضل خدمة.\n\nالدعم الفني: 01101267185',
      'ممتاز جدا': 'شكراً جزيلاً! تقييمك يساعدنا في التحسين.\n\nالدعم الفني: 01101267185',
      'محترف': 'نحن نحترم بعملائنا! شكراً لك.\n\nالدعم الفني: 01101267185',
      'الاحتراف': 'نحن نحترم بعملائنا! شكراً لك.\n\nالدعم الفني: 01101267185',
      'جودة': 'نلتزم بأعلى جودة في خدمتنا!\n\nالدعم الفني: 01101267185',
      'جيدة': 'شكراً لك! نحن نسعى للتحسين المستمر.\n\nالدعم الفني: 01101267185',
      'تحسين': 'نحن نسعى للتحسين المستمر! ملاحظاتك تساعدنا.\n\nالدعم الفني: 01101267185',
      'التطوير': 'نحن نسعى للتطوير المستمر! شكراً لك.\n\nالدعم الفني: 01101267185',
      'الحديث': 'نحن نسعى للحديث! شكراً لك.\n\nالدعم الفني: 01101267185',
      'الاستماع': 'نحن نستمع لعملائنا! ملاحظاتك تساعدنا في التحسين.\n\nالدعم الفني: 01101267185',
      'الملاحظات': 'ملاحظاتك تساعدنا في التحسين! شكراً جزيلاً! ⭐\n\nالدعم الفني: 01101267185',
      'تقييمات': 'تقييماتك تساعدنا في التحسين! شكراً جزيلاً! ⭐\n\nالدعم الفني: 01101267185',
      'الرأي': 'رأيك يهمن لنا! بعد حل طلبك، ستتلقى رابط تقييم.\n\nالدعم الفني: 01101267185',
      'نجم': 'شكراً لك! تقييمك يساعدنا في التحسين! ⭐\n\nالدعم الفني: 01101267185',
      'خمس نجوم': 'شكراً لك! تقييمك يساعدنا في التحسين! ⭐\n\nالدعم الفني: 01101267185',
      'اربع نجوم': 'شكراً لك! تقييمك يساعدنا في التحسين! ⭐\n\nالدعم الفني: 01101267185',
      'ثلاث نجوم': 'شكراً لك! تقييمك يساعدنا في التحسين! ⭐\n\nالدعم الفني: 01101267185',
      'نجمتان': 'شكراً لك! تقييمك يساعدنا في التحسين! ⭐\n\nالدعم الفني: 01101267185',
      'نجمة': 'شكراً لك! تقييمك يساعدنا في التحسين! ⭐\n\nالدعم الفني: 01101267185',
      'واحد': 'شكراً لك! تقييمك يساعدنا في التحسين! ⭐\n\nالدعم الفني: 01101267185',
      'صفر': 'شكراً لك! تقييمك يساعدنا في التحسين! ⭐\n\nالدعم الفني: 01101267185',
      'اعرف': 'بالتأكيد! أخبرني ما تريد معرفته.\n\nالدعم الفني: 01101267185',
      'اريد اعرف': 'بالتأكيد! أخبرني ما تريد معرفته.\n\nالدعم الفني: 01101267185',
      'معرفني': 'بالتأكيد! أخبرني ما تريد معرفته.\n\nالدعم الفني: 01101267185',
      'عرفني': 'بالتأكيد! أخبرني ما تريد معرفته.\n\nالدعم الفني: 01101267185',
      'بحث': 'للبحث عن معلومات، يمكنك:\n1. طرح سؤال محدد\n2. تقديم طلب جديد\n3. الاتصال بنا: 01101267185',
      'ابحث عن': 'للبحث عن معلومات، يمكنك:\n1. طرح سؤال محدد\n2. تقديم طلب جديد\n3. الاتصال بنا: 01101267185',
      'استسفسر': 'تفضل بالاستفسار عن ماذا تحتاج مساعدة.\n\nالدعم الفني: 01101267185',
      'استفسر': 'تفضل بالاستفسار عن ماذا تحتاج مساعدة.\n\nالدعم الفني: 01101267185',
      'اسئلة': 'تفضل بطرح أسئلتك! سأبذل قصاراي للمساعدة.\n\nالدعم الفني: 01101267185',
      'سؤالي': 'تفضل بطرح سؤالك! سأبذل قصاراي للمساعدة.\n\nالدعم الفني: 01101267185',
      'اسألني': 'تفضل بطرح سؤالك! سأبذل قصاراي للمساعدة.\n\nالدعم الفني: 01101267185',
      'اسأل': 'تفضل بطرح سؤالك! سأبذل قصاراي للمساعدة.\n\nالدعم الفني: 01101267185',
      'باسأل': 'تفضل بطرح سؤالك! سأبذل قصاراي للمساعدة.\n\nالدعم الفني: 01101267185',
      'احتاج': 'بالتأكيد! أخبرني ما تحتاج.\n\nالدعم الفني: 01101267185',

      // Smart FAQ with detailed solutions
      'الجهاز لا يعمل': 'إليك خطوات حل مشكلة "الجهاز لا يعمل":\n\n1️⃣ تحقق من سريان الكهرباء 🔌\n2️⃣ تأكد من تشغيل الزر الرئيسي ⚡\n3️⃣ افصل الجهاز ووصله مرة أخرى بعد 30 ثانية 🔄\n4️⃣ إذا استمرت المشكلة، قم بتسجيل طلب 📝\n\n📱 شاهد فيديو تعليمي: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">كيف تحل مشكلة الجهاز لا يعمل</a>\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'جهازي لا يعمل': 'إليك خطوات حل مشكلة "الجهاز لا يعمل":\n\n1️⃣ تحقق من سريان الكهرباء 🔌\n2️⃣ تأكد من تشغيل الزر الرئيسي ⚡\n3️⃣ افصل الجهاز ووصله مرة أخرى بعد 30 ثانية 🔄\n4️⃣ إذا استمرت المشكلة، قم بتسجيل طلب 📝\n\n📱 شاهد فيديو تعليمي: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">كيف تحل مشكلة الجهاز لا يعمل</a>\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'لا يعمل': 'إليك خطوات حل المشكلة:\n\n1️⃣ تحقق من سريان الكهرباء 🔌\n2️⃣ تأكد من تشغيل الزر الرئيسي ⚡\n3️⃣ افصل الجهاز ووصله مرة أخرى بعد 30 ثانية 🔄\n4️⃣ إذا استمرت المشكلة، قم بتسجيل طلب 📝\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'الجهاز لا يشحن': 'إليك خطوات حل مشكلة "الجهاز لا يشحن":\n\n1️⃣ تأكد من عمل الشاحن والمقبس 🔌\n2️⃣ نظف منفذ الشحن بفرشاة ناعمة 🧹\n3️⃣ استخدم شاحن أصلي ✅\n4️⃣ إذا لم يعمل، سجل طلب صيانة 🔧\n\n📱 شاهد فيديو تعليمي: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">كيف تحل مشكلة الشحن</a>\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'لا يشحن': 'إليك خطوات حل مشكلة الشحن:\n\n1️⃣ تأكد من عمل الشاحن والمقبس 🔌\n2️⃣ نظف منفذ الشحن بفرشاة ناعمة 🧹\n3️⃣ استخدم شاحن أصلي ✅\n4️⃣ إذا لم يعمل، سجل طلب صيانة 🔧\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'الجهاز يسخن': 'إليك خطوات حل مشكلة "الجهاز يسخن":\n\n1️⃣ تأكد من التهوية الجيدة 🌬️\n2️⃣ أوقف الجهاز لمدة 10 دقائق ⏱️\n3️⃣ لا تستخدمه أثناء الشحن ⚡\n4️⃣ إذا استمر السخون، سجل طلب 🔧\n\n📱 شاهد فيديو تعليمي: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">كيف تحل مشكلة السخون</a>\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'يسخن': 'إليك خطوات حل مشكلة السخون:\n\n1️⃣ تأكد من التهوية الجيدة 🌬️\n2️⃣ أوقف الجهاز لمدة 10 دقائق ⏱️\n3️⃣ لا تستخدمه أثناء الشحن ⚡\n4️⃣ إذا استمر السخون، سجل طلب 🔧\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'الشاشة لا تعمل': 'إليك خطوات حل مشكلة "الشاشة لا تعمل":\n\n1️⃣ أعد تشغيل الجهاز 🔄\n2️⃣ تحقق من الإعدادات ⚙️\n3️⃣ تأكد من عدم وجود ضرر في الشاشة 🔍\n4️⃣ إذا لم تعمل، سجل طلب صيانة 🔧\n\n📱 شاهد فيديو تعليمي: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">كيف تحل مشكلة الشاشة</a>\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'الشاشة سوداء': 'إليك خطوات حل مشكلة "الشاشة سوداء":\n\n1️⃣ أعد تشغيل الجهاز 🔄\n2️⃣ تحقق من الإعدادات ⚙️\n3️⃣ تأكد من عدم وجود ضرر في الشاشة 🔍\n4️⃣ إذا لم تعمل، سجل طلب صيانة 🔧\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'صوت غريب': 'إليك خطوات حل مشكلة "الجهاز يصدر صوت غريب":\n\n1️⃣ تحقق من وجود أي جزء غير مثبت 🔧\n2️⃣ تأكد من نظافة الجهاز 🧹\n3️⃣ أعد تشغيل الجهاز 🔄\n4️⃣ إذا استمر الصوت، سجل طلب 🔧\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'صوت': 'إليك خطوات حل مشكلة الصوت الغريب:\n\n1️⃣ تحقق من وجود أي جزء غير مثبت 🔧\n2️⃣ تأكد من نظافة الجهاز 🧹\n3️⃣ أعد تشغيل الجهاز 🔄\n4️⃣ إذا استمر الصوت، سجل طلب 🔧\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'لا يتصل بالانترنت': 'إليك خطوات حل مشكلة "لا يمكن الاتصال بالإنترنت":\n\n1️⃣ تحقق من اتصال Wi-Fi 📶\n2️⃣ أعد تشغيل الراوتر 🔄\n3️⃣ تحقق من إعدادات الشبكة ⚙️\n4️⃣ إذا استمرت المشكلة، سجل طلب 🔧\n\n📱 شاهد فيديو تعليمي: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">كيف تحل مشكلة الإنترنت</a>\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'انترنت': 'إليك خطوات حل مشكلة الإنترنت:\n\n1️⃣ تحقق من اتصال Wi-Fi 📶\n2️⃣ أعد تشغيل الراوتر 🔄\n3️⃣ تحقق من إعدادات الشبكة ⚙️\n4️⃣ إذا استمرت المشكلة، سجل طلب 🔧\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'البطارية تستنزف': 'إليك خطوات حل مشكلة "البطارية تستنزف بسرعة":\n\n1️⃣ قلل السطوع 📱\n2️⃣ أغلق التطبيقات غير المستخدمة ❌\n3️⃣ تحقق من التطبيقات التي تستهلك البطارية 🔍\n4️⃣ إذا استمرت المشكلة، سجل طلب 🔧\n\n📱 شاهد فيديو تعليمي: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">كيف تحل مشكلة البطارية</a>\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'بطارية': 'إليك خطوات حل مشكلة البطارية:\n\n1️⃣ قلل السطوع 📱\n2️⃣ أغلق التطبيقات غير المستخدمة ❌\n3️⃣ تحقق من التطبيقات التي تستهلك البطارية 🔍\n4️⃣ إذا استمرت المشكلة، سجل طلب 🔧\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'الجهاز بطيء': 'إليك خطوات حل مشكلة "الجهاز بطيء":\n\n1️⃣ أعد تشغيل الجهاز 🔄\n2️⃣ مسح التخزين المؤقت 🧹\n3️⃣ احذف التطبيقات غير المستخدمة ❌\n4️⃣ إذا استمر البطء، سجل طلب 🔧\n\n📱 شاهد فيديو تعليمي: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">كيف تحل مشكلة البطء</a>\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
      'بطيء': 'إليك خطوات حل مشكلة البطء:\n\n1️⃣ أعد تشغيل الجهاز 🔄\n2️⃣ مسح التخزين المؤقت 🧹\n3️⃣ احذف التطبيقات غير المستخدمة ❌\n4️⃣ إذا استمر البطء، سجل طلب 🔧\n\nإذا لم ينفع الحل، سجل طلب جديد 🔧',
    };
  }

  loadConversationHistory() {
    try {
      const saved = localStorage.getItem('chatbot_conversation_history');
      if (saved) {
        this.conversationHistory = JSON.parse(saved);
        console.log('Loaded conversation history:', this.conversationHistory.length, 'messages');
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  }

  saveConversationHistory() {
    try {
      localStorage.setItem('chatbot_conversation_history', JSON.stringify(this.conversationHistory));
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  }

  clearConversationHistory() {
    this.conversationHistory = [];
    localStorage.removeItem('chatbot_conversation_history');
    console.log('Conversation history cleared');
  }

  init() {
    // Create widget HTML
    this.createWidget();
    this.createTopWidget();
    this.bindEvents();
    
    // Hide top widget message after 5 seconds
    setTimeout(() => {
      const topToggle = document.getElementById('chatbot-toggle-top');
      if (topToggle) {
        topToggle.classList.add('message-hidden');
      }
    }, 5000);
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'chatbot-widget';
    widget.innerHTML = `
      <button class="chatbot-toggle" id="chatbot-toggle" aria-label="فتح الشات">
        <svg class="chat-icon robot-svg" viewBox="0 0 100 100" style="width: 60px; height: 60px;">
          <!-- Robot Body -->
          <ellipse cx="50" cy="55" rx="35" ry="38" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          
          <!-- Robot Head -->
          <circle cx="50" cy="35" r="22" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          
          <!-- Eyes -->
          <circle cx="42" cy="32" r="5" fill="#1a56db" />
          <circle cx="58" cy="32" r="5" fill="#1a56db" />
          
          <!-- Eye highlights -->
          <circle cx="44" cy="30" r="2" fill="rgba(255,255,255,0.9)" />
          <circle cx="60" cy="30" r="2" fill="rgba(255,255,255,0.9)" />
          
          <!-- Smile -->
          <path d="M 43 42 Q 50 48 57 42" stroke="#1a56db" stroke-width="2" fill="none" stroke-linecap="round" />
          
          <!-- Arms -->
          <ellipse cx="15" cy="55" rx="8" ry="20" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          <ellipse cx="85" cy="55" rx="8" ry="20" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          
          <!-- Hands with glowing circles -->
          <circle cx="15" cy="75" r="6" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          <circle cx="85" cy="75" r="6" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          
          <!-- Glowing circles around right hand -->
          <circle cx="85" cy="75" r="10" fill="none" stroke="#1a56db" stroke-width="2" opacity="0.6">
            <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="75" r="14" fill="none" stroke="#1a56db" stroke-width="1.5" opacity="0.4">
            <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" begin="0.5s" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          
          <!-- Antenna -->
          <line x1="50" y1="13" x2="50" y2="5" stroke="#1a56db" stroke-width="2" />
          <circle cx="50" cy="5" r="3" fill="#1a56db" />
        </svg>
        <svg class="close-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="chatbot-window" id="chatbot-window">
        <div class="chatbot-header">
          <div style="position: relative; z-index: 1;">
            <h3>
              <span class="logo-icon">YAS</span>
              مساعد الدعم الذكي
            </h3>
            <span class="status">متصل الآن ⚡</span>
          </div>
          <button class="chatbot-close" id="chatbot-close" aria-label="إغلاق" style="position: relative; z-index: 1;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
          <div class="chatbot-message bot">
            مرحباً! 👋 أنا مساعد الدعم الذكي لـ YAS Help Desk. كيف يمكنني مساعدتك اليوم؟
            <div class="time">الآن</div>
          </div>
        </div>
        <div class="chatbot-suggestions">
          <p class="chatbot-suggestions-title">💡 اقتراحات سريعة:</p>
          <div class="chatbot-suggestions-list">
            <button class="chatbot-suggestion-btn" data-question="كيف أسجل طلب؟">كيف أسجل طلب؟</button>
            <button class="chatbot-suggestion-btn" data-question="كيف أتابع طلبي؟">كيف أتابع طلبي؟</button>
            <button class="chatbot-suggestion-btn" data-question="ما هي حالات الطلب؟">حالات الطلب</button>
            <button class="chatbot-suggestion-btn" data-question="رقم الدعم الفني">رقم الدعم الفني</button>
            <button class="chatbot-suggestion-btn" data-question="كيف أتواصل معكم؟">التواصل معنا</button>
          </div>
        </div>
        <div class="chatbot-input-area">
          <input type="text" class="chatbot-input" id="chatbot-input" placeholder="اكتب رسالتك هنا..." maxlength="500" autocomplete="off">
          <button class="chatbot-send" id="chatbot-send" aria-label="إرسال">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 22 2"/></svg>
          </button>
          <div class="chatbot-suggestions-dropdown" id="chatbot-suggestions-dropdown"></div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    this.bindSuggestionButtons();
  }

  createTopWidget() {
    const topWidget = document.createElement('div');
    topWidget.className = 'chatbot-widget-top';
    topWidget.innerHTML = `
      <button class="chatbot-toggle" id="chatbot-toggle-top" aria-label="فتح الشات" style="width: 70px; height: 70px;">
        <svg class="chat-icon robot-svg" viewBox="0 0 100 100" style="width: 45px; height: 45px;">
          <!-- Robot Body -->
          <ellipse cx="50" cy="55" rx="35" ry="38" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          
          <!-- Robot Head -->
          <circle cx="50" cy="35" r="22" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          
          <!-- Eyes -->
          <circle cx="42" cy="32" r="5" fill="#1a56db" />
          <circle cx="58" cy="32" r="5" fill="#1a56db" />
          
          <!-- Eye highlights -->
          <circle cx="44" cy="30" r="2" fill="rgba(255,255,255,0.9)" />
          <circle cx="60" cy="30" r="2" fill="rgba(255,255,255,0.9)" />
          
          <!-- Smile -->
          <path d="M 43 42 Q 50 48 57 42" stroke="#1a56db" stroke-width="2" fill="none" stroke-linecap="round" />
          
          <!-- Arms -->
          <ellipse cx="15" cy="55" rx="8" ry="20" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          <ellipse cx="85" cy="55" rx="8" ry="20" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          
          <!-- Hands with glowing circles -->
          <circle cx="15" cy="75" r="6" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          <circle cx="85" cy="75" r="6" fill="#ffffff" stroke="#1a56db" stroke-width="2" />
          
          <!-- Glowing circles around right hand -->
          <circle cx="85" cy="75" r="10" fill="none" stroke="#1a56db" stroke-width="2" opacity="0.6">
            <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="75" r="14" fill="none" stroke="#1a56db" stroke-width="1.5" opacity="0.4">
            <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" begin="0.5s" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          
          <!-- Antenna -->
          <line x1="50" y1="13" x2="50" y2="5" stroke="#1a56db" stroke-width="2" />
          <circle cx="50" cy="5" r="3" fill="#1a56db" />
        </svg>
        <svg class="close-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    document.body.appendChild(topWidget);

    // Bind top toggle event
    const topToggle = document.getElementById('chatbot-toggle-top');
    topToggle.addEventListener('click', () => {
      if (!this.isOpen) {
        this.toggle();
      }
    });
  }

  bindSuggestionButtons() {
    const suggestionBtns = document.querySelectorAll('.chatbot-suggestion-btn');
    suggestionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        const input = document.getElementById('chatbot-input');
        input.value = question;
        this.sendMessage();
      });
    });
  }

  bindEvents() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const input = document.getElementById('chatbot-input');
    const send = document.getElementById('chatbot-send');
    const window = document.getElementById('chatbot-window');

    toggle.addEventListener('click', () => {
      if (!this.isOpen) {
        this.toggle();
      }
    });
    
    close.addEventListener('click', () => this.toggle());

    send.addEventListener('click', () => this.sendMessage());

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Typeahead suggestions
    input.addEventListener('input', (e) => {
      this.handleTypeahead(e.target.value);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.chatbot-input-area')) {
        this.hideSuggestions();
      }
    });
  }

  handleTypeahead(input) {
    const dropdown = document.getElementById('chatbot-suggestions-dropdown');
    
    if (!input || input.length < 2) {
      this.hideSuggestions();
      return;
    }

    const suggestions = this.getSuggestions(input);
    
    if (suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    // Show suggestions
    dropdown.innerHTML = suggestions.map(suggestion => `
      <div class="chatbot-suggestion-item" data-suggestion="${suggestion}">
        ${suggestion}
      </div>
    `).join('');

    dropdown.classList.add('show');

    // Add click handlers
    dropdown.querySelectorAll('.chatbot-suggestion-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const suggestion = e.target.getAttribute('data-suggestion');
        document.getElementById('chatbot-input').value = suggestion;
        this.hideSuggestions();
        this.sendMessage();
      });
    });
  }

  hideSuggestions() {
    const dropdown = document.getElementById('chatbot-suggestions-dropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
      dropdown.innerHTML = '';
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');

    toggle.classList.toggle('open', this.isOpen);
    window.classList.toggle('open', this.isOpen);

    if (this.isOpen) {
      document.getElementById('chatbot-input').focus();
    }
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    this.showTyping();

    try {
      // Try Groq AI API first
      const response = await this.getGroqResponse(message);
      
      this.hideTyping();
      this.addMessage(response, 'bot');
      
      // Update conversation history
      this.conversationHistory.push({ role: 'user', content: message });
      this.conversationHistory.push({ role: 'assistant', content: response });
      
      // Keep only last 20 messages for better memory
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      // Save to localStorage
      this.saveConversationHistory();
    } catch (error) {
      console.error('Groq API error, falling back to local FAQ:', error);
      
      // Fallback to local FAQ matching
      const response = this.getSmartResponse(message);
      
      this.hideTyping();
      this.addMessage(response, 'bot');
      
      // Update conversation history
      this.conversationHistory.push({ role: 'user', content: message });
      this.conversationHistory.push({ role: 'assistant', content: response });
      
      // Keep only last 20 messages
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      // Save to localStorage
      this.saveConversationHistory();
    }
  }

  async getGroqResponse(message) {
    console.log('Calling Groq API with message:', message);
    
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        conversationHistory: this.conversationHistory
      })
    });

    console.log('Groq API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      throw new Error('Groq API request failed: ' + errorText);
    }

    const data = await response.json();
    console.log('Groq API response data:', data);
    return data.response;
  }

  getSmartResponse(message) {
    const normalizedMessage = this.normalizeArabic(message.toLowerCase().trim());
    
    // Check for complaint phrases - redirect to support page
    const complaintPhrases = ['أنا بشكو عن مشكلة', 'بشكو', 'عايز أشكو'];
    if (complaintPhrases.some(phrase => normalizedMessage.includes(this.normalizeArabic(phrase)))) {
      // Show message then redirect
      setTimeout(() => {
        window.location.href = 'support.html';
      }, 2000);
      return 'حسناً! سأساعدك في تسجيل مشكلتك 📝\n\nسيتم نقلك تلقائياً إلى صفحة تسجيل الطلب بعد ثانيتين...';
    }

    // Check for tracking phrases - redirect to tracking page
    const trackingPhrases = ['ما هو رقم طلبي', 'أريد تتبع طلبي', 'حالة طلبي', 'رقم طلبي', 'تتبع', 'طلبي'];
    if (trackingPhrases.some(phrase => normalizedMessage.includes(this.normalizeArabic(phrase)))) {
      // Show message then redirect
      setTimeout(() => {
        window.location.href = 'tracking.html';
      }, 2000);
      return 'حسناً! سأساعدك في تتبع طلبك 🔍\n\nسيتم نقلك تلقائياً إلى صفحة تتبع الطلب بعد ثانيتين...\n\nستحتاج رقم الطلب (مثل: YAS-SUP-XXXXX)';
    }
    
    // Direct exact match
    if (this.faqDatabase[normalizedMessage]) {
      return this.faqDatabase[normalizedMessage];
    }

    // Smart fuzzy matching with scoring
    let bestMatch = null;
    let bestScore = 0;

    for (const [key, response] of Object.entries(this.faqDatabase)) {
      const normalizedKey = this.normalizeArabic(key);
      const score = this.calculateMatchScore(normalizedMessage, normalizedKey);
      
      if (score > bestScore && score >= 0.6) {
        bestScore = score;
        bestMatch = response;
      }
    }

    if (bestMatch) {
      return bestMatch;
    }

    // If no match found, suggest creating a ticket
    return 'عذراً، هذه المشكلة تحتاج تقييم فني متخصص 🤔\n\nيرجى تسجيل طلب جديد وسيقوم فريقنا بمساعدتك في أسرع وقت 🔧\n\nسجل طلبك هنا: <a href="support.html" style="color: #1a56db; text-decoration: underline;">تسجيل طلب جديد</a>\n\nأو اتصل بنا مباشرة: 01101267185 📞';

    // Enhanced keyword-based matching with Egyptian Arabic variations
    const keywordGroups = [
      { keywords: ['تسجيل', 'سجل', 'انشاء', 'اعمل', 'عمل', 'طلب جديد', 'طلبي', 'برجاء'], response: 'لتسجيل طلب دعم جديد، اضغط على زر "تسجيل طلب" في الصفحة الرئيسية أو اذهب إلى صفحة الدعم. ستحتاج لتوفير بياناتك وبيانات الجهاز.\n\nالدعم الفني: 01101267185' },
      { keywords: ['تتبع', 'تابع', 'استعلم', 'حالي', 'وصل لي', 'حالة طلبي', 'طلبي', 'رقم الطلب'], response: 'لتتبع طلبك، استخدم رقم الطلب (مثل: YAS-SUP-XXXXX) في صفحة التتبع.\n\nإذا واجهت مشكلة، اتصل بنا: 01101267185' },
      { keywords: ['حالة', 'مراحل', 'وصل ليه', 'اي حاجة', 'تحديث', 'الآن'], response: 'حالات الطلب هي: تم ارسال الطلب، قيد المراجعة، بانتظار العميل، تم الحل (مغلق).\n\nللاستفسار: 01101267185' },
      { keywords: ['اتصال', 'تواصل', 'كلم', 'ارن', 'ربط', 'كيف اوصل', 'ابعت', 'وصلني'], response: 'يمكنك التواصل معنا عبر:\n📱 واتساب: سيتم فتح تلقائياً عند تحديث حالة طلبك\n📞 الدعم الفني: 01101267185' },
      { keywords: ['واتساب', 'واتس', 'ويساب', 'رسالة', 'تشان'], response: 'نعم، نستخدم واتساب كوسيلة تواصل أساسية! سيتم فتح واتساب تلقائياً عند تحديث حالة طلبك.\n\nالهاتف: 01101267185' },
      { keywords: ['مشكلة', 'عندي مشكلة', 'اعطال', 'عايل', 'فيه عطل', 'كله غلط', 'مش شغال', 'مضروب', 'معطل'], response: 'للإبلاغ عن مشكلة، اذهب إلى صفحة تسجيل الطلب واختر نوع المشكلة (دعم فني، صيانة، استفسار).\n\nأو اتصل بنا مباشرة: 01101267185' },
      { keywords: ['صيانة', 'اصلاح', 'تركيب', 'فحص', 'خدمة', 'صيني'], response: 'لطلب صيانة، اختر "صيانة" كنوع الطلب وصف المشكلة بدقة.\n\nالدعم الفني: 01101267185' },
      { keywords: ['ضمان', 'مضمون', 'كفالة', 'ساري', 'ضمانك'], response: 'للتحقق من الضمان، حدد تاريخ الشراء وحالة الضمان عند تسجيل الطلب.\n\nللاستفسار: 01101267185' },
      { keywords: ['رقم تسلسلي', 'كود', 'سيريال', 'الرقم', 'موديل'], response: 'الرقم التسلسلي يحدد جهازك بدقة. إذا كان الكود موجود، أدخله. إذا لم يكن، اختر "الكود غير موجود".\n\nالدعم الفني: 01101267185' },
      { keywords: ['دعم', 'مساعدة', 'ساعدني', 'عاوذني', 'محتاج حد'], response: 'نحن هنا لمساعدتك! يمكنك:\n1. إنشاء طلب دعم جديد\n2. تتبع طلب موجود\n3. الاتصال بنا مباشرة: 01101267185' },
      { keywords: ['شكر', 'ممتاز', 'رائع', 'تسلم', 'جزاك الله خير', 'شكرا جزيلا'], response: 'على الرحب والسعة! 😊 سعدنا بمساعدتك. هل هناك شيء آخر يمكنني مساعدتك فيه؟' },
      { keywords: ['تم', 'تمام', 'بس', 'الحمد لله'], response: 'تمام! هل هناك شيء آخر يمكنني مساعدتك فيه؟\n\nالدعم الفني: 01101267185' },
      { keywords: ['تقييم', 'رأي', 'نجم', 'نجوم', 'تقيم'], response: 'بعد حل طلبك، ستتلقى رابط تقييم عبر واتساب. تقييمك يساعدنا في التحسين! ⭐' },
      { keywords: ['صفحة', 'اين', 'فيه', 'موجود', 'الموقع'], response: 'يمكنك التنقل بين الصفحات من خلال القائمة العلوية: الرئيسية، تسجيل طلب، تتبع طلب، دليل حل المشاكل.\n\nالدعم الفني: 01101267185' },
      { keywords: ['ساعات', 'وقت', 'متى', 'اوقات', 'دوام', 'يام'], response: 'ساعات الدعم: الأحد - الخميس من 9 صباحاً - 5 مساءً. الدعم عبر واتساب متاح على مدار الساعة.\n\nالهاتف: 01101267185' },
      { keywords: ['عنوان', 'فيه', 'محل', 'فرع', 'المقر'], response: 'يمكنك العثور على معلومات الاتصال الكاملة في موقعنا الرسمي: yas-eg.com\n\nللاستفسار المباشر: 01101267185' },
      { keywords: ['شركة', 'من انت', 'عن الشركة', 'اي شركة', 'بتاع مين'], response: 'YAS هي شركة متخصصة في الدعم الفني وخدمة العملاء. موقعنا: yas-eg.com\n\nالدعم الفني: 01101267185' },
      { keywords: ['هاتف', 'موبايل', 'تليفون', 'رقم', 'تلفون', 'لينك'], response: 'رقم الدعم الفني: 01101267185\n\nيمكنك الاتصال بنا أو تقديم طلب جديد للتواصل مع فريق الدعم.' },
      { keywords: ['سريع', 'سرعة', 'كام يستغرق', 'متى خلص', 'فورا', 'عاجل', 'تاني'], response: 'سرعة الرد:\n• الاستفسارات: 24 ساعة\n• المشاكل التقنية: 1-3 أيام عمل\n• الطوارئ: فوري\n\nالدعم الفني: 01101267185' },
      { keywords: ['جهاز', 'الموبايل', 'التلفاز', 'الحاسوب', 'لابتوب', 'تابلت', 'شاشة'], response: 'للإبلاغ عن مشكلة في الجهاز، اذهب إلى صفحة تسجيل الطلب.\n\nالدعم الفني: 01101267185' },
      { keywords: ['مرحبا', 'اهلا', 'سلام', 'صباح', 'مساء', 'هاي', 'هلا', 'صباح الخير', 'مساء الخير'], response: 'مرحباً بك! 👋 أنا مساعد الدعم الذكي لـ YAS Help Desk. كيف يمكنني مساعدتك اليوم؟' },
      { keywords: ['نعم', 'لا', 'بسيطة', 'معلش', 'اسف', 'واضح', 'مفهوم'], response: 'فهمت! كيف يمكنني مساعدتك بشكل أفضل؟\n\nالدعم الفني: 01101267185' }
    ];

    for (const group of keywordGroups) {
      for (const keyword of group.keywords) {
        if (normalizedMessage.includes(keyword)) {
          return group.response;
        }
      }
    }

    // Default response - suggest ticket creation and human support
    return 'شكراً لرسالتك! 😊\n\nبما أنني مساعد ذكي، قد لا أتمكن من الإجابة على جميع الاستفسارات المعقدة.\n\n🎯 **للحصول على مساعدة أفضل:**\n\n1️⃣ يرجى تقديم طلب جديد من خلال صفحة "تسجيل طلب"\n2️⃣ أو اتصل بنا مباشرة على الدعم الفني: 01101267185\n3️⃣ أو اختر من الأسئلة الشائلة:\n• "كيف أسجل طلب؟"\n• "كيف أتابع طلبي؟"\n• "ما هي حالات الطلب؟"\n• "كيف أتواصل معكم؟"\n\nفريقنا هنا لمساعدتك! 🤝';
  }

  // Normalize Arabic text for better matching
  normalizeArabic(text) {
    // Remove diacritics (Tashkeel)
    text = text.replace(/[\u064B-\u065F\u0670]/g, '');
    
    // Normalize alef variants
    text = text.replace(/[\u0622\u0623\u0625]/g, '\u0627'); // ا آ إ → ا
    text = text.replace(/[\u0624\u0626]/g, '\u0648'); // و ؤ → و
    text = text.replace(/[\u0627\u0625]/g, '\u0627'); // ا إ → ا
    
    // Normalize ta marbuta
    text = text.replace(/\u0629/g, '\u0647'); // ة → ه
    
    // Normalize alef maqsura
    text = text.replace(/\u0649/g, '\u064A'); // ى → ي
    
    // Remove extra spaces and punctuation
    text = text.replace(/[^\w\s\u0600-\u06FF]/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }

  // Calculate match score between two strings
  calculateMatchScore(query, key) {
    // Exact match
    if (query === key) return 1.0;
    
    // Contains match
    if (query.includes(key) || key.includes(query)) return 0.9;
    
    // Word overlap
    const queryWords = query.split(' ');
    const keyWords = key.split(' ');
    
    let matches = 0;
    for (const qWord of queryWords) {
      for (const kWord of keyWords) {
        if (qWord === kWord || qWord.includes(kWord) || kWord.includes(qWord)) {
          matches++;
          break;
        }
      }
    }
    
    const overlapScore = matches / Math.max(queryWords.length, keyWords.length);
    
    // Similarity score (character-based)
    const similarity = this.stringSimilarity(query, key);
    
    // Combined score
    return Math.max(overlapScore, similarity) * 0.8;
  }

  // Calculate string similarity (Levenshtein distance based)
  stringSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;
    
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));
    
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return 1 - (distance / maxLen);
  }

  // Get suggestions for typeahead
  getSuggestions(input) {
    if (!input || input.length < 2) return [];
    
    const normalizedInput = this.normalizeArabic(input.toLowerCase().trim());
    const suggestions = [];
    
    for (const [key, response] of Object.entries(this.faqDatabase)) {
      const normalizedKey = this.normalizeArabic(key);
      const score = this.calculateMatchScore(normalizedInput, normalizedKey);
      
      if (score >= 0.5) {
        suggestions.push({
          key: key,
          score: score,
          response: response
        });
      }
    }
    
    // Sort by score and return top 5
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.key);
  }

  addMessage(text, type) {
    const container = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type}`;

    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

    // Allow HTML in bot messages for links, escape HTML in user messages
    const content = type === 'bot' ? text : this.escapeHtml(text);

    messageDiv.innerHTML = `
      ${content}
      <div class="time">${time}</div>
    `;

    // Add click handlers for links to open in new tab
    if (type === 'bot') {
      const links = messageDiv.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(link.href, '_blank');
        });
      });
    }

    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showTyping() {
    const container = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-typing';
    typingDiv.id = 'chatbot-typing';
    typingDiv.innerHTML = `
      <div class="chatbot-typing-dot"></div>
      <div class="chatbot-typing-dot"></div>
      <div class="chatbot-typing-dot"></div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('chatbot-typing');
    if (typing) {
      typing.remove();
    }
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ChatbotWidget();
  });
} else {
  new ChatbotWidget();
}
