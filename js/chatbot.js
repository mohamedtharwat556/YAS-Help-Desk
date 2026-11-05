// Chatbot Widget - 3D Enhanced with Smart FAQ System
class ChatbotWidget {
  constructor() {
    this.isOpen = false;
    this.conversationHistory = [];
    this.faqDatabase = this.buildFAQDatabase();
    this.init();
  }

  buildFAQDatabase() {
    return {
      // General Questions
      'مرحبا': 'مرحباً بك! 👋 أنا مساعد الدعم الذكي لـ YAS Help Desk. كيف يمكنني مساعدتك اليوم؟',
      'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته! 🤝 أهلاً بك في خدمة الدعم الفني. كيف يمكنني مساعدتك؟',
      'من انت': 'أنا مساعد الدعم الذكي لـ YAS Help Desk 🤖، مساعدك الافتراضي للإجابة على استفساراتك ومساعدتك في أي وقت!',
      'ماذا تفعل': 'أنا هنا لمساعدتك في:\n✅ الإجابة على الأسئلة الشائعة\n✅ توجيهك إلى الصفحات المناسبة\n✅ تقديم الدعم الفني الأساسي\n✅ مساعدتك في تتبع طلباتك',

      // Support & Tickets
      'كيف اساعد': 'يمكنك:\n1. إنشاء طلب دعم جديد من خلال نموذج تسجيل الطلب\n2. تتبع حالة طلبك باستخدام رقم الطلب\n3. التواصل معنا عبر واتساب',
      'تسجيل طلب': 'لتسجيل طلب دعم جديد، اضغط على زر "تسجيل طلب" في الصفحة الرئيسية أو اذهب إلى صفحة الدعم. ستحتاج لتوفير بياناتك وبيانات الجهاز.',
      'تتبع طلب': 'لتتبع طلبك، استخدم رقم الطلب (مثل: YAS-SUP-XXXXX) في صفحة التتبع. يمكنك العثور على رقم الطلب في الرسالة التي وصلتك عند إنشاء الطلب.',
      'حالة الطلب': 'حالات الطلب هي:\n1. تم ارسال الطلب\n2. قيد المراجعة\n3. بانتظار العميل\n4. تم الحل (مغلق)',
      'كم يستغرق': 'وقت الرد يعتمد على نوع المشكلة:\n🔹 الاستفسارات: عادةً خلال 24 ساعة\n🔹 المشاكل التقنية: 1-3 أيام عمل\n🔹 حالات الطوارئ: أولوية قصوى',

      // Contact & Support
      'تواصل': 'يمكنك التواصل معنا عبر:\n📱 واتساب: سيتم فتح واتساب تلقائياً عند تحديث حالة طلبك\n� الدعم الفني: 01101267185\n�📧 البريد الإلكتروني: سيتم إرسال إشعارات إلى بريدك المسجل',
      'واتساب': 'نعم، نستخدم واتساب كوسيلة تواصل أساسية! سيتم فتح واتساب تلقائياً عند تحديث حالة طلبك لإرسال التحديثات لك.',
      'ايميل': 'البريد الإلكتروني يستخدم للإشعارات. تأكد من إدخال بريد صحيح عند تسجيل طلب لاستلام التحديثات.',
      'دعم فني': 'للتواصل مع الدعم الفني مباشرة:\n📞 الهاتف: 01101267185\n📱 واتساب: سيتم فتح تلقائياً عند تحديث الطلب\n\nأو يمكنك تقديم طلب جديد للتواصل معنا.',
      'رقم الدعم': 'رقم الدعم الفني: 01101267185\n\nيمكنك الاتصال بنا أو تقديم طلب جديد للتواصل مع فريق الدعم.',

      // Technical Support
      'مشكلة': 'للإبلاغ عن مشكلة:\n1. اذهب إلى صفحة تسجيل الطلب\n2. اختر نوع المشكلة (دعم فني، صيانة، استفسار)\n3. صف المشكلة بالتفصيل\n4. أرفق صورة إن أمكن\n\nأو اتصل بنا مباشرة على: 01101267185',
      'صيانة': 'لطلب صيانة:\n1. اختر "صيانة" كنوع الطلب\n2. وصف المشكلة بدقة\n3. حدد نوع الجهاز والموديل\n4. أرفق صورة للمشكلة إن أمكن\n\nالدعم الفني: 01101267185',
      'ضمان': 'للتحقق من الضمان:\n1. حدد تاريخ الشراء عند تسجيل الطلب\n2. حدد حالة الضمان (ساري/منتهي)\n3. سيقوم الفني بالتحقق من حالة الضمان\n\nللاستفسار: 01101267185',

      // Device & Serial
      'رقم تسلسلي': 'الرقم التسلسلي يحدد جهازك بدقة. عند تسجيل طلب:\n• اختر حالة الرقم التسلسلي\n• إذا كان "الكود موجود"، أدخل الرقم\n• إذا كان "غير موجود" أو "خلف الشاشة"، اختر الخيار المناسب',
      'كود غير موجود': 'لا مشكلة! يمكنك إنشاء طلب حتى بدون الرقم التسلسلي. اختر "الكود غير موجود" في حالة الرقم التسلسلي واستمر في إنشاء الطلب.',

      // Company Info
      'شركة': 'YAS هي شركة متخصصة في الدعم الفني وخدمة العملاء. نسعى لتقديم أفضل خدمة لعملائنا.\n🌐 موقعنا: yas-eg.com\n📞 الدعم الفني: 01101267185',
      'عنوان': 'يمكنك العثور على معلومات الاتصال الكاملة في موقعنا الرسمي: yas-eg.com\n\nللاستفسار المباشر: 01101267185',
      'ساعات العمل': 'ساعات الدعم:\n🕐 أيام العمل: الأحد - الخميس\n⏰ الساعة: 9 صباحاً - 5 مساءً\n📱 الدعم عبر واتساب: متاح على مدار الساعة\n📞 الهاتف: 01101267185',

      // Help & Navigation
      'صفحة': 'يمكنك التنقل بين الصفحات من خلال القائمة العلوية:\n• الرئيسية\n• تسجيل طلب\n• تتبع طلب\n• دليل حل المشاكل',
      'دليل': 'دليل حل المشاكل يحتوي على حلول شائعة للعديد من المشاكل. اذهب إلى صفحة "دليل حل المشاكل" للعثور على الحلول.\n\nإذا لم تجد الحل، اتصل بنا: 01101267185',
      'تقييم': 'بعد حل طلبك، ستتلقى رابط تقييم عبر واتساب. تقييمك يساعدنا في تحسين خدماتنا! ⭐',

      // Thanks & Closing
      'شكرا': 'على الرحب والسعة! 😊 سعدنا بمساعدتك. هل هناك شيء آخر يمكنني مساعدتك فيه؟',
      'تم': 'تمام! إذا احتجت أي مساعدة أخرى، أنا هنا دائماً. 🤝',
      'وداع': 'مع السلامة! 🌟 نتمنى لك يوماً سعيداً. نحن هنا دائماً لمساعدتك.\n\nالدعم الفني: 01101267185'
    };
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
          <input type="text" class="chatbot-input" id="chatbot-input" placeholder="اكتب رسالتك هنا..." maxlength="500">
          <button class="chatbot-send" id="chatbot-send" aria-label="إرسال">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 22 2"/></svg>
          </button>
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

    // Smart FAQ matching
    const response = this.getSmartResponse(message);

    // Simulate typing delay for realism
    setTimeout(() => {
      this.hideTyping();
      this.addMessage(response, 'bot');
      
      // Update conversation history
      this.conversationHistory.push({ role: 'user', content: message });
      this.conversationHistory.push({ role: 'assistant', content: response });
      
      // Keep only last 10 messages
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }
    }, 800 + Math.random() * 600);
  }

  getSmartResponse(message) {
    const normalizedMessage = message.toLowerCase().trim();
    
    // Direct exact match
    if (this.faqDatabase[normalizedMessage]) {
      return this.faqDatabase[normalizedMessage];
    }

    // Fuzzy matching - check if any FAQ key is contained in the message
    for (const [key, response] of Object.entries(this.faqDatabase)) {
      if (normalizedMessage.includes(key) || key.includes(normalizedMessage)) {
        return response;
      }
    }

    // Keyword-based matching
    const keywords = {
      'تسجيل': 'لتسجيل طلب دعم جديد، اضغط على زر "تسجيل طلب" في الصفحة الرئيسية أو اذهب إلى صفحة الدعم. ستحتاج لتوفير بياناتك وبيانات الجهاز.\n\nالدعم الفني: 01101267185',
      'طلب': 'لإنشاء طلب جديد، اذهب إلى صفحة تسجيل الطلب. لتتبع طلب موجود، استخدم رقم الطلب في صفحة التتبع.\n\nالدعم الفني: 01101267185',
      'تتبع': 'لتتبع طلبك، استخدم رقم الطلب (مثل: YAS-SUP-XXXXX) في صفحة التتبع.\n\nإذا واجهت مشكلة، اتصل بنا: 01101267185',
      'حالة': 'حالات الطلب هي: تم ارسال الطلب، قيد المراجعة، بانتظار العميل، تم الحل (مغلق).\n\nللاستفسار: 01101267185',
      'اتصال': 'يمكنك التواصل معنا عبر:\n📱 واتساب: سيتم فتح تلقائياً عند تحديث حالة طلبك\n📞 الدعم الفني: 01101267185',
      'واتساب': 'نعم، نستخدم واتساب كوسيلة تواصل أساسية! سيتم فتح واتساب تلقائياً عند تحديث حالة طلبك.\n\nالهاتف: 01101267185',
      'مشكلة': 'للإبلاغ عن مشكلة، اذهب إلى صفحة تسجيل الطلب واختر نوع المشكلة (دعم فني، صيانة، استفسار).\n\nأو اتصل بنا مباشرة: 01101267185',
      'صيانة': 'لطلب صيانة، اختر "صيانة" كنوع الطلب وصف المشكلة بدقة.\n\nالدعم الفني: 01101267185',
      'ضمان': 'للتحقق من الضمان، حدد تاريخ الشراء وحالة الضمان عند تسجيل الطلب.\n\nللاستفسار: 01101267185',
      'رقم': 'الرقم التسلسلي يحدد جهازك بدقة. إذا كان الكود موجود، أدخله. إذا لم يكن، اختر "الكود غير موجود".\n\nالدعم الفني: 01101267185',
      'كود': 'إذا كان الرقم التسلسلي غير موجود أو خلف الشاشة، اختر الخيار المناسب واستمر في إنشاء الطلب.\n\nالدعم الفني: 01101267185',
      'دعم': 'نحن هنا لمساعدتك! يمكنك:\n1. إنشاء طلب دعم جديد\n2. تتبع طلب موجود\n3. الاتصال بنا مباشرة: 01101267185',
      'مساعدة': 'كيف يمكنني مساعدتك؟ يمكنك:\n1. إنشاء طلب دعم جديد\n2. تتبع حالة طلبك\n3. طرح سؤال حول خدماتنا\n\nالدعم الفني: 01101267185',
      'شكر': 'على الرحب والسعة! 😊 سعدنا بمساعدتك. هل هناك شيء آخر يمكنني مساعدتك فيه؟',
      'تم': 'تمام! هل هناك شيء آخر يمكنني مساعدتك فيه؟\n\nالدعم الفني: 01101267185',
      'تقييم': 'بعد حل طلبك، ستتلقى رابط تقييم عبر واتساب. تقييمك يساعدنا في التحسين! ⭐',
      'صفحة': 'يمكنك التنقل بين الصفحات من خلال القائمة العلوية: الرئيسية، تسجيل طلب، تتبع طلب، دليل حل المشاكل.\n\nالدعم الفني: 01101267185',
      'ساعات': 'ساعات الدعم: الأحد - الخميس من 9 صباحاً - 5 مساءً. الدعم عبر واتساب متاح على مدار الساعة.\n\nالهاتف: 01101267185',
      'عنوان': 'يمكنك العثور على معلومات الاتصال الكاملة في موقعنا الرسمي: yas-eg.com\n\nللاستفسار المباشر: 01101267185',
      'شركة': 'YAS هي شركة متخصصة في الدعم الفني وخدمة العملاء. موقعنا: yas-eg.com\n\nالدعم الفني: 01101267185',
      'هاتف': 'رقم الدعم الفني: 01101267185\n\nيمكنك الاتصال بنا أو تقديم طلب جديد للتواصل مع فريق الدعم.',
      'اتصل': 'للتواصل معنا مباشرة:\n📞 الهاتف: 01101267185\n📱 واتساب: سيتم فتح تلقائياً عند تحديث الطلب\n\nأو يمكنك تقديم طلب جديد.'
    };

    for (const [keyword, response] of Object.entries(keywords)) {
      if (normalizedMessage.includes(keyword)) {
        return response;
      }
    }

    // Default response - suggest ticket creation and human support
    return 'شكراً لرسالتك! 😊\n\nبما أنني مساعد ذكي، قد لا أتمكن من الإجابة على جميع الاستفسارات المعقدة.\n\n🎯 **للحصول على مساعدة أفضل:**\n\n1️⃣ يرجى تقديم طلب جديد من خلال صفحة "تسجيل طلب"\n2️⃣ أو اتصل بنا مباشرة على الدعم الفني: 01101267185\n3️⃣ أو اختر من الأسئلة الشائلة:\n• "كيف أسجل طلب؟"\n• "كيف أتابع طلبي؟"\n• "ما هي حالات الطلب؟"\n• "كيف أتواصل معكم؟"\n\nفريقنا هنا لمساعدتك! 🤝';
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
