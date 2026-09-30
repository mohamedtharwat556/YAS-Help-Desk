/* ============================================================
   YAS Help Desk — Internationalization (i18n)
   Supports: Arabic, English, Chinese
   ============================================================ */

const translations = {
  ar: {
    // Header
    nav_home: 'الرئيسية',
    nav_support: 'تسجيل طلب',
    nav_tracking: 'متابعة الطلب',
    nav_faq: 'الأسئلة الشائعة',
    language_btn: 'اللغة',

    // Tracking
    tracking_title: 'تتبع طلب الدعم الفني',
    tracking_subtitle: 'أدخل رقم الطلب الذي حصلت عليه عند تسجيل طلبك',
    tracking_search: 'بحث',
    tracking_example: 'مثال: YAS-SUP-10482 | يمكنك أيضاً إدخال الأرقام فقط: 10482',
    tracking_timeline: 'مسار الطلب',
    tracking_updates: 'تحديثات وملاحظات الفني',
    tracking_no_updates: 'لا توجد تحديثات بعد',
    tracking_new_ticket: 'طلب دعم جديد',
    tracking_search_again: 'بحث آخر',
    tracking_help_title: 'لا تتذكر رقم طلبك؟',
    tracking_help_desc: 'تحقق من الرسالة التي أرسلها لك النظام عند تسجيل الطلب. إذا واجهت مشكلة، تواصل مع Eng. Adam Farouk مباشرة.',
    
    // Hero
    hero_badge: 'خدمة الدعم الفني الاحترافية',
    hero_title: 'محتاج مساعدة؟ إحنا معاك طوال الوقت.',
    hero_description: 'فريق YAS المتخصص جاهز لمساعدتك في حل جميع مشاكل الأجهزة والأنظمة التقنية. تسجيل طلب، تتبع حالته، والحصول على الدعم الفني لم يكن بهذه السهولة.',
    btn_submit_ticket: 'تسجيل طلب دعم',
    btn_track_ticket: 'متابعة طلب',
    trust_247: 'دعم 24/7',
    trust_quality: 'ضمان الجودة',
    trust_team: 'فريق متخصص',
    trust_response: 'استجابة سريعة',
    
    // Categories
    cat_title: 'خدمات الدعم الفني',
    cat_subtitle: 'نوفر مجموعة شاملة من خدمات الدعم الفني لضمان عمل أنظمتك بكفاءة عالية',
    cat_technical: 'الدعم الفني',
    cat_technical_desc: 'حل المشاكل الفنية و troubleshooting للأجهزة',
    cat_maintenance: 'الصيانة والإصلاح',
    cat_maintenance_desc: 'صيانة دورية وإصلاح الأعطال البرمجية والهاردية',
    cat_warranty: 'خدمات الضمان',
    cat_warranty_desc: 'استفسار عن الضمان والخدمات المضمونة',
    cat_installation: 'التركيب والإعداد',
    cat_installation_desc: 'تركيب وإعداد الأجهزة والأنظمة الجديدة',
    cat_network: 'الشبكات والاتصال',
    cat_network_desc: 'إعداد وصيانة الشبكات وأجهزة الاتصال',
    cat_software: 'البرمجيات والتطبيقات',
    cat_software_desc: 'تثبيت وتحديث البرامج وتكامل الأنظمة',
    
    // How it works
    how_title: 'كيف تعمل الخدمة؟',
    how_subtitle: 'أربع خطوات بسيطة للحصول على الدعم الفني الاحترافي',
    step1_title: 'سجّل طلبك',
    step1_desc: 'أدخل بياناتك ومعلومات جهازك ووصف المشكلة بالتفصيل',
    step2_title: 'احصل على رقم',
    step2_desc: 'ستحصل فوراً على رقم الطلب الفريد YAS-SUP-XXXXX',
    step3_title: 'فريقنا يتواصل',
    step3_desc: 'سيتواصل معك Eng. Adam Farouk وتحديد موعد للصيانة',
    step4_title: 'حل المشكلة',
    step4_desc: 'تابع حالة طلبك حتى يتم حل مشكلتك بنجاح',
    
    // FAQ
    faq_title: 'الأسئلة الشائعة',
    faq_subtitle: 'إجابات على أكثر الأسئلة شيوعاً عن خدمة الدعم الفني',
    faq_q1: 'كيف أتابع حالة طلب الدعم الفني؟',
    faq_a1: 'بعد إنشاء الطلب، ستحصل على رقم فريد بصيغة YAS-SUP-XXXXX. يمكنك استخدام هذا الرقم في صفحة "متابعة الطلب" للاطلاع على الحالة الحالية وجميع التحديثات في الوقت الفعلي. كما ستصلك رسالة بالبريد الإلكتروني مع كل تحديث في حالة طلبك.',
    faq_q2: 'ما هي أنواع الأجهزة التي تدعمها YAS؟',
    faq_a2: 'تدعم YAS مجموعة واسعة من الأجهزة تشمل: اللاب توب، الكمبيوتر المكتبي، أجهزة الكاشير POS، كاميرات وأنظمة Hikvision، البروجكتر، الشاشات، الطابعات، أجهزة الشبكات، والملحقات المختلفة. إذا كان جهازك غير مدرج، تواصل معنا وسنساعدك.',
    faq_q3: 'كم يستغرق الرد على طلب الدعم؟',
    faq_a3: 'يتم استلام الطلبات فور تقديمها، ويسعى فريقنا للتواصل معك خلال ساعات العمل. الطلبات العاجلة تحظى بالأولوية وقد يتم الرد عليها في غضون ساعة. الطلبات العادية يتم الرد عليها خلال 24 ساعة.',
    faq_q4: 'هل يمكنني تقديم طلب خارج ساعات العمل؟',
    faq_a4: 'نعم، يمكنك تقديم الطلب في أي وقت عبر البوابة الإلكترونية. سيتم استلام الطلب وتعيينه تلقائياً، وسيتم التواصل معك في أقرب وقت ممكن خلال ساعات العمل الرسمية. البوابة متاحة 24/7 لتسجيل الطلبات.',
    faq_q5: 'هل توجد تكلفة على خدمة الدعم الفني؟',
    faq_a5: 'تكلفة الخدمة تعتم الاتفاق عليها بناءً على نوع المشكلة وطبيعة العمل المطلوبة. خدمات الدعم الفني الأساسية ضمن الضمان تكون مجانية. للصيانة خارج الضمان أو التركيب الجديد، يتم تحديد التكلفة بعد التقييم.',
    faq_q6: 'ما الفرق بين طلب الصيانة وطلب الدعم الفني؟',
    faq_a6: 'الدعم الفني يشمل المساعدة في حل المشكلات البرمجية والتقنية عن بُعد أو بزيارة. أما الصيانة فتعني الفحص الفيزيائي للجهاز وإصلاح الأعطال المادية، وقد تتطلب استلام الجهاز في مقر YAS.',
    faq_q7: 'كيف أتواصل مع Eng. Adam Farouk مباشرة؟',
    faq_a7: 'يمكنك التواصل مع Eng. Adam Farouk عبر الواتساب (+20 11 01267185) أو البريد الإلكتروني: adam@yas.sa. سيتواصل معك في أقرب وقت ممكن.',
    
    // Footer
    footer_company: 'Technical Support & Customer Service',
    footer_availability: 'مواعيد العمل متاح دايماً التسجيل',
    footer_supervision: 'إشراف',
    footer_rights: 'جميع الحقوق محفوظة لـ YAS © 2026',
    footer_whatsapp: 'واتساب',
    footer_email: 'البريد الإلكتروني',
    footer_track: 'تتبع الطلب',
    footer_about: 'عن الشركة',
    footer_portfolio: 'Portfolio',
    footer_shop: 'المتجر'
  },
  
  en: {
    // Header
    nav_home: 'Home',
    nav_support: 'Submit Ticket',
    nav_tracking: 'Track Ticket',
    nav_faq: 'FAQ',
    language_btn: 'Language',

    // Tracking
    tracking_title: 'Track Technical Support Ticket',
    tracking_subtitle: 'Enter the ticket number you received when you submitted your request',
    tracking_search: 'Search',
    tracking_example: 'Example: YAS-SUP-10482 | You can also enter only the numbers: 10482',
    tracking_timeline: 'Ticket Timeline',
    tracking_updates: 'Technician Updates & Notes',
    tracking_no_updates: 'No updates yet',
    tracking_new_ticket: 'New Support Ticket',
    tracking_search_again: 'Search Again',
    tracking_help_title: 'Don\'t remember your ticket number?',
    tracking_help_desc: 'Check the message sent to you by the system when you submitted the ticket. If you encounter any issues, contact Eng. Adam Farouk directly.',
    
    // Hero
    hero_badge: 'Professional Technical Support',
    hero_title: 'Need Help? We\'re Here For You.',
    hero_description: 'The YAS specialized team is ready to help you solve all device and system technical issues. Submit a ticket, track its status, and get technical support has never been easier.',
    btn_submit_ticket: 'Submit Support Ticket',
    btn_track_ticket: 'Track Ticket',
    trust_247: '24/7 Support',
    trust_quality: 'Quality Assurance',
    trust_team: 'Expert Team',
    trust_response: 'Fast Response',
    
    // Categories
    cat_title: 'Technical Support Services',
    cat_subtitle: 'We provide a comprehensive range of technical support services to ensure your systems operate efficiently',
    cat_technical: 'Technical Support',
    cat_technical_desc: 'Solve technical problems and device troubleshooting',
    cat_maintenance: 'Maintenance & Repair',
    cat_maintenance_desc: 'Regular maintenance and software/hardware repair',
    cat_warranty: 'Warranty Services',
    cat_warranty_desc: 'Warranty inquiries and guaranteed services',
    cat_installation: 'Installation & Setup',
    cat_installation_desc: 'Installation and setup of new devices and systems',
    cat_network: 'Network & Connectivity',
    cat_network_desc: 'Setup and maintenance of networks and communication devices',
    cat_software: 'Software & Applications',
    cat_software_desc: 'Software installation, updates, and system integration',
    
    // How it works
    how_title: 'How It Works?',
    how_subtitle: 'Four simple steps to get professional technical support',
    step1_title: 'Submit Your Request',
    step1_desc: 'Enter your details, device information, and describe the problem in detail',
    step2_title: 'Get Your Number',
    step2_desc: 'You will immediately receive a unique ticket number YAS-SUP-XXXXX',
    step3_title: 'Our Team Contacts You',
    step3_desc: 'Eng. Adam Farouk will contact you to schedule maintenance',
    step4_title: 'Problem Solved',
    step4_desc: 'Track your ticket status until your problem is successfully resolved',
    
    // FAQ
    faq_title: 'Frequently Asked Questions',
    faq_subtitle: 'Answers to the most common questions about technical support',
    faq_q1: 'How do I track my technical support ticket?',
    faq_a1: 'After creating a ticket, you will receive a unique number in the format YAS-SUP-XXXXX. You can use this number on the "Track Ticket" page to view the current status and all real-time updates. You will also receive an email with each status update.',
    faq_q2: 'What types of devices does YAS support?',
    faq_a2: 'YAS supports a wide range of devices including: laptops, desktop computers, POS machines, Hikvision cameras and systems, projectors, monitors, printers, network devices, and various accessories. If your device is not listed, contact us and we will help you.',
    faq_q3: 'How long does it take to respond to a support request?',
    faq_a3: 'Requests are received immediately upon submission, and our team strives to contact you during business hours. Urgent requests are prioritized and may be responded to within an hour. Regular requests are responded to within 24 hours.',
    faq_q4: 'Can I submit a request outside business hours?',
    faq_a4: 'Yes, you can submit a request at any time through the online portal. The request will be received and automatically assigned, and we will contact you as soon as possible during official business hours. The portal is available 24/7 for request submission.',
    faq_q5: 'Is there a cost for technical support services?',
    faq_a5: 'Service costs depend on the type of problem and the nature of the work required. Basic technical support services under warranty are free. For out-of-warranty maintenance or new installation, costs are determined after evaluation.',
    faq_q6: 'What is the difference between maintenance and technical support?',
    faq_a6: 'Technical support includes assistance in solving software and technical problems remotely or via visit. Maintenance means physical inspection of the device and repair of hardware issues, which may require receiving the device at YAS headquarters.',
    faq_q7: 'How can I contact Eng. Adam Farouk directly?',
    faq_a7: 'You can contact Eng. Adam Farouk via WhatsApp (+20 11 01267185) or email: adam@yas.sa. He will contact you as soon as possible.',
    
    // Footer
    footer_company: 'Technical Support & Customer Service',
    footer_availability: 'Available 24/7 for Registration',
    footer_supervision: 'Supervised by',
    footer_rights: 'All rights reserved to YAS © 2026',
    footer_whatsapp: 'WhatsApp',
    footer_email: 'Email',
    footer_track: 'Track Ticket',
    footer_about: 'About',
    footer_portfolio: 'Portfolio',
    footer_shop: 'Shop'
  },
  
  zh: {
    // Header
    nav_home: '首页',
    nav_support: '提交工单',
    nav_tracking: '跟踪工单',
    nav_faq: '常见问题',
    language_btn: '语言',

    // Tracking
    tracking_title: '跟踪技术支持工单',
    tracking_subtitle: '输入您提交请求时收到的工单号码',
    tracking_search: '搜索',
    tracking_example: '示例：YAS-SUP-10482 | 您也可以只输入数字：10482',
    tracking_timeline: '工单时间线',
    tracking_updates: '技术员更新和备注',
    tracking_no_updates: '暂无更新',
    tracking_new_ticket: '新支持工单',
    tracking_search_again: '再次搜索',
    tracking_help_title: '不记得您的工单号码？',
    tracking_help_desc: '检查系统在您提交工单时发送给您的消息。如果遇到任何问题，请直接联系 Eng. Adam Farouk。',
    
    // Hero
    hero_badge: '专业技术支持',
    hero_title: '需要帮助吗？我们随时为您服务。',
    hero_description: 'YAS 专业团队随时准备帮助您解决所有设备和系统技术问题。提交工单、跟踪状态、获取技术支持从未如此简单。',
    btn_submit_ticket: '提交支持工单',
    btn_track_ticket: '跟踪工单',
    trust_247: '24/7 支持',
    trust_quality: '质量保证',
    trust_team: '专业团队',
    trust_response: '快速响应',
    
    // Categories
    cat_title: '技术支持服务',
    cat_subtitle: '我们提供全面的技术支持服务，确保您的系统高效运行',
    cat_technical: '技术支持',
    cat_technical_desc: '解决技术问题和设备故障排除',
    cat_maintenance: '维护与维修',
    cat_maintenance_desc: '定期维护和软件/硬件维修',
    cat_warranty: '保修服务',
    cat_warranty_desc: '保修查询和保修服务',
    cat_installation: '安装与设置',
    cat_installation_desc: '新设备和系统的安装与设置',
    cat_network: '网络与连接',
    cat_network_desc: '网络和通信设备的设置与维护',
    cat_software: '软件与应用',
    cat_software_desc: '软件安装、更新和系统集成',
    
    // How it works
    how_title: '如何运作？',
    how_subtitle: '获得专业技术支持的四个简单步骤',
    step1_title: '提交您的请求',
    step1_desc: '输入您的详细信息、设备信息并详细描述问题',
    step2_title: '获取您的号码',
    step2_desc: '您将立即收到唯一的工单号码 YAS-SUP-XXXXX',
    step3_title: '我们的团队联系您',
    step3_desc: 'Eng. Adam Farouk 将联系您安排维护',
    step4_title: '问题解决',
    step4_desc: '跟踪您的工单状态，直到问题成功解决',
    
    // FAQ
    faq_title: '常见问题',
    faq_subtitle: '关于技术支持的最常见问题解答',
    faq_q1: '如何跟踪我的技术支持工单？',
    faq_a1: '创建工单后，您将收到格式为 YAS-SUP-XXXXX 的唯一号码。您可以在"跟踪工单"页面上使用此号码查看当前状态和所有实时更新。每次状态更新时，您还会收到电子邮件。',
    faq_q2: 'YAS 支持哪些类型的设备？',
    faq_a2: 'YAS 支持广泛的设备，包括：笔记本电脑、台式计算机、POS 机、海康威视摄像头和系统、投影仪、显示器、打印机、网络设备和各种配件。如果您的设备未列出，请联系我们，我们将为您提供帮助。',
    faq_q3: '响应支持请求需要多长时间？',
    faq_a3: '请求在提交后立即被接收，我们的团队努力在工作时间内与您联系。紧急请求优先处理，可能在一小时内得到响应。常规请求在 24 小时内得到响应。',
    faq_q4: '我可以在工作时间外提交请求吗？',
    faq_a4: '是的，您可以随时通过在线门户提交请求。请求将被接收并自动分配，我们将在官方工作时间内尽快与您联系。门户全天候 24/7 可用于提交请求。',
    faq_q5: '技术支持服务有费用吗？',
    faq_a5: '服务费用取决于问题类型和所需工作的性质。保修内的基本技术支持服务是免费的。对于保修外维护或新安装，费用在评估后确定。',
    faq_q6: '维护和技术支持有什么区别？',
    faq_a6: '技术支持包括通过远程访问或访问来解决软件和技术问题。维护意味着对设备进行物理检查和维修硬件问题，可能需要将设备送到 YAS 总部。',
    faq_q7: '如何直接联系 Eng. Adam Farouk？',
    faq_a7: '您可以通过 WhatsApp (+20 11 01267185) 或电子邮件：adam@yas.sa 联系 Eng. Adam Farouk。他将尽快与您联系。',
    
    // Footer
    footer_company: 'Technical Support & Customer Service',
    footer_availability: '全天候 24/7 可注册',
    footer_supervision: '监督',
    footer_rights: 'YAS 版权所有 © 2026',
    footer_whatsapp: 'WhatsApp',
    footer_email: '电子邮件',
    footer_track: '跟踪工单',
    footer_about: '关于',
    footer_portfolio: '作品集',
    footer_shop: '商店'
  }
};

// Current language (default: Arabic)
let currentLang = localStorage.getItem('yas-lang') || 'ar';

// Function to set language
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('yas-lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  updatePageContent();
  updateLanguageButton();
}

// Function to get translation
function t(key) {
  return translations[currentLang][key] || translations['ar'][key] || key;
}

// Function to update all elements with data-i18n attribute
function updatePageContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  
  // Update hrefs
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.getAttribute('data-i18n-href');
    el.href = t(key);
  });
}

// Function to update language button text
function updateLanguageButton() {
  const langBtn = document.getElementById('language-btn');
  if (langBtn) {
    langBtn.textContent = t('language_btn');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  
  // Language switcher
  const langBtn = document.getElementById('language-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const langs = ['ar', 'en', 'zh'];
      const currentIndex = langs.indexOf(currentLang);
      const nextIndex = (currentIndex + 1) % langs.length;
      setLanguage(langs[nextIndex]);
    });
  }
});
