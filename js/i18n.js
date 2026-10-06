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
    nav_troubleshooting: 'دليل المشاكل',
    nav_faq: 'الأسئلة الشائعة',
    language_btn: 'اللغة',

    // Support Form
    support_page_title: 'تسجيل طلب دعم — YAS Help Desk',
    step1_customer: 'بيانات العميل',
    step2_device: 'بيانات الجهاز',
    step3_details: 'تفاصيل الطلب',
    step4_review: 'المراجعة',
    form_customer_title: 'بيانات العميل',
    form_customer_subtitle: 'أدخل معلوماتك الشخصية للتواصل معك',
    label_name: 'الاسم الكامل',
    label_phone: 'رقم الجوال',
    label_whatsapp: 'رقم واتساب',
    label_email: 'البريد الإلكتروني',
    label_company: 'الشركة / المؤسسة',
    placeholder_name: 'مثال: محمد أحمد العمري',
    placeholder_phone: '05XXXXXXXX',
    placeholder_whatsapp: 'اتركه فارغاً إذا مطابق للجوال',
    placeholder_email: 'example@email.com',
    placeholder_company: 'اسم الشركة أو المؤسسة (اختياري)',
    hint_whatsapp: 'اتركه فارغاً إذا كان نفس رقم الجوال',
    step_1_of_4: 'الخطوة 1 من 4',
    btn_next: 'التالي',
    form_device_title: 'بيانات الجهاز',
    form_device_subtitle: 'أخبرنا عن الجهاز الذي تحتاج إلى دعم له',
    label_device_type: 'نوع الجهاز',
    label_device_brand: 'الماركة / الشركة المصنعة',
    label_device_model: 'الموديل',
    label_serial_number: 'الرقم التسلسلي (Serial Number)',
    label_purchase_date: 'تاريخ الشراء',
    label_warranty: 'حالة الضمان',
    placeholder_device_brand: 'مثال: Dell، HP، Lenovo، Apple',
    placeholder_device_model: 'مثال: Latitude 5420، EliteBook 840',
    placeholder_serial_number: 'اختياري — يساعد في التتبع',
    device_laptop: 'لاب توب',
    device_desktop: 'كمبيوتر',
    device_pos: 'كاشير',
    device_hikvision: 'Hikvision',
    device_projector: 'بروجكتر',
    device_monitor: 'شاشة',
    device_printer: 'طابعة',
    device_network: 'شبكة',
    device_accessories: 'ملحقات',
    device_other: 'أخرى',
    warranty_unknown: 'غير محدد',
    warranty_active: 'الضمان ساري',
    warranty_expiring: 'الضمان يقترب من الانتهاء',
    warranty_expired: 'الضمان منتهي',
    step_2_of_4: 'الخطوة 2 من 4',
    btn_back: 'السابق',
    form_details_title: 'تفاصيل الطلب',
    form_details_subtitle: 'صف مشكلتك بوضوح حتى نتمكن من مساعدتك بشكل أفضل',
    label_issue_type: 'نوع الطلب',
    label_priority: 'الأولوية',
    label_description: 'وصف المشكلة',
    label_attachments: 'إرفاق صور أو ملفات (اختياري)',
    select_issue_type: 'اختر نوع الطلب',
    issue_technical: 'دعم فني — مشكلة تقنية',
    issue_maintenance: 'صيانة — فحص وإصلاح',
    issue_warranty: 'ضمان — استفسار أو طلب ضمان',
    issue_complaint: 'شكوى — مشكلة في الخدمة',
    issue_inquiry: 'استفسار — سؤال عن منتج أو خدمة',
    issue_installation: 'تركيب — إعداد وتركيب',
    issue_followup: 'متابعة — طلب سابق',
    issue_other: 'أخرى',
    priority_low: 'عادية',
    priority_low_sub: 'مشكلة بسيطة',
    priority_normal: 'مهمة',
    priority_normal_sub: 'تؤثر على العمل',
    priority_high: 'عالية',
    priority_high_sub: 'مشكلة حرجة',
    priority_urgent: 'عاجلة',
    priority_urgent_sub: 'توقف كامل',
    placeholder_description: 'صف المشكلة بالتفصيل: متى بدأت؟ ما هي الأعراض؟ هل جربت أي حلول؟ ما تأثيرها على عملك؟',
    hint_description: 'كلما كان الوصف أوضح، كلما تمكنا من مساعدتك أسرع',
    file_upload_text: 'اسحب الملفات هنا أو اضغط للاختيار',
    file_upload_hint: 'PNG, JPG, PDF — بحد أقصى 10MB',
    step_3_of_4: 'الخطوة 3 من 4',
    btn_review: 'مراجعة الطلب',
    form_review_title: 'مراجعة الطلب',
    form_review_subtitle: 'تأكد من صحة البيانات قبل الإرسال',
    review_customer: 'بيانات العميل',
    review_device: 'بيانات الجهاز',
    review_details: 'تفاصيل الطلب',
    review_label_name: 'الاسم',
    review_label_phone: 'الجوال',
    review_label_whatsapp: 'واتساب',
    review_label_email: 'البريد',
    review_label_company: 'الشركة',
    review_label_device_type: 'نوع الجهاز',
    review_label_device_brand: 'الماركة',
    review_label_device_model: 'الموديل',
    review_label_serial_number: 'الرقم التسلسلي',
    review_label_purchase_date: 'تاريخ الشراء',
    review_label_warranty: 'الضمان',
    review_label_issue_type: 'نوع الطلب',
    review_label_priority: 'الأولوية',
    review_label_description: 'وصف المشكلة',
    review_notice: 'بعد الإرسال، سيتم تعيين طلبك إلى Eng. Adam Farouk وسيتم التواصل معك قريباً.',
    step_4_of_4: 'الخطوة 4 من 4',
    btn_edit: 'تعديل',
    btn_submit_ticket: 'إرسال طلب الدعم',
    success_title: 'تم إرسال طلبك بنجاح!',
    success_message: 'شكراً لتواصلك مع YAS. تم استلام طلبك وسيتم التواصل معك قريباً.',
    success_ticket_label: 'رقم طلبك',
    success_ticket_hint: 'احتفظ بهذا الرقم لمتابعة حالة طلبك في أي وقت',
    btn_track_ticket: 'متابعة الطلب',
    btn_copy_id: 'نسخ الرقم',
    btn_copy_code: 'نسخ الكود',
    btn_back_home: 'العودة للرئيسية',
    whats_next_title: 'ماذا سيحدث الآن؟',
    whats_next_step1: 'سيراجع Eng. Adam Farouk طلبك',
    whats_next_step1_sub: 'خلال ساعات العمل الرسمية',
    whats_next_step2: 'سيتم التواصل معك عبر الهاتف أو واتساب',
    whats_next_step2_sub: 'للاستفسار عن تفاصيل إضافية إذا لزم',
    whats_next_step3: 'تابع حالة طلبك',
    whats_next_step3_sub: 'باستخدام الرقم أعلاه في صفحة المتابعة',

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

    // Support Form
    form_customer_title: 'بيانات العميل',
    form_customer_subtitle: 'أدخل معلوماتك الشخصية للتواصل معك',
    label_name: 'الاسم الكامل',
    label_phone: 'رقم الجوال',
    label_whatsapp: 'رقم واتساب',
    label_email: 'البريد الإلكتروني',
    label_company: 'الشركة / المؤسسة',
    placeholder_name: 'مثال: محمد أحمد العمري',
    placeholder_phone: '05XXXXXXXX',
    placeholder_whatsapp: 'اتركه فارغاً إذا مطابق للجوال',
    placeholder_email: 'example@email.com',
    placeholder_company: 'اسم الشركة أو المؤسسة (اختياري)',
    hint_whatsapp: 'اتركه فارغاً إذا كان نفس رقم الجوال',
    step_1_of_4: 'الخطوة 1 من 4',
    btn_next: 'التالي',
    btn_back: 'السابق',

    form_device_title: 'بيانات الجهاز',
    form_device_subtitle: 'أخبرنا عن الجهاز الذي تحتاج إلى دعم له',
    label_device_type: 'نوع الجهاز',
    label_device_brand: 'الماركة / الشركة المصنعة',
    label_device_model: 'الموديل',
    label_serial_number: 'الرقم التسلسلي',
    label_purchase_date: 'تاريخ الشراء',
    label_warranty: 'الضمان',
    placeholder_device_brand: 'مثال: Dell، HP، Lenovo، Apple',
    placeholder_device_model: 'مثال: Latitude 5420، EliteBook 840',
    placeholder_serial_number: 'الرقم التسلسلي الموجود على الجهاز',
    placeholder_purchase_date: 'YYYY-MM-DD',
    device_laptop: 'لاب توب',
    device_desktop: 'كمبيوتر',
    device_pos: 'كاشير',
    device_hikvision: 'Hikvision',
    device_projector: 'بروجكتر',
    device_monitor: 'شاشة',
    device_printer: 'طابعة',
    device_network: 'شبكة',
    device_accessories: 'ملحقات',
    device_other: 'أخرى',
    step_2_of_4: 'الخطوة 2 من 4',

    form_details_title: 'تفاصيل الطلب',
    form_details_subtitle: 'صف المشكلة التي تواجهها بالتفصيل',
    label_issue_type: 'نوع الطلب',
    label_priority: 'الأولوية',
    label_description: 'وصف المشكلة',
    issue_technical: 'دعم فني',
    issue_maintenance: 'صيانة',
    issue_warranty: 'ضمان',
    issue_installation: 'تركيب',
    issue_network: 'شبكات',
    issue_software: 'برمجيات',
    issue_other: 'أخرى',
    priority_low: 'منخفضة',
    priority_normal: 'عادية',
    priority_high: 'عالية',
    priority_urgent: 'عاجلة',
    placeholder_description: 'اكتب وصفاً تفصيلياً للمشكلة التي تواجهها...',
    hint_description: 'كلما كان الوصف أكثر تفصيلاً، تمكنا من مساعدتك بشكل أسرع',
    step_3_of_4: 'الخطوة 3 من 4',

    form_review_title: 'مراجعة الطلب',
    form_review_subtitle: 'تأكد من صحة جميع المعلومات قبل الإرسال',
    review_customer: 'بيانات العميل',
    review_device: 'بيانات الجهاز',
    review_details: 'تفاصيل الطلب',
    step_4_of_4: 'الخطوة 4 من 4',
    btn_edit: 'تعديل',
    btn_submit_ticket: 'إرسال طلب الدعم',
    success_title: 'تم إرسال طلبك بنجاح!',
    success_message: 'شكراً لتواصلك مع YAS. تم استلام طلبك وسيتم التواصل معك قريباً.',
    success_ticket_label: 'رقم طلبك',
    success_ticket_hint: 'احتفظ بهذا الرقم لمتابعة حالة طلبك في أي وقت',
    btn_track_ticket: 'متابعة الطلب',
    btn_copy_id: 'نسخ الرقم',
    btn_copy_code: 'نسخ الكود',
    btn_back_home: 'العودة للرئيسية',
    whats_next_title: 'ماذا سيحدث الآن؟',
    whats_next_step1: 'سيراجع Eng. Adam Farouk طلبك',
    whats_next_step1_sub: 'خلال ساعات العمل الرسمية',
    whats_next_step2: 'سيتم التواصل معك عبر الهاتف أو واتساب',
    whats_next_step2_sub: 'للاستفسار عن تفاصيل إضافية إذا لزم',
    whats_next_step3: 'تابع حالة طلبك',
    whats_next_step3_sub: 'باستخدام الرقم أعلاه في صفحة المتابعة',

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
    nav_troubleshooting: 'Troubleshooting Guide',
    nav_faq: 'FAQ',
    language_btn: 'Language',

    // Support Form
    support_page_title: 'Submit Support Ticket — YAS Help Desk',
    step1_customer: 'Customer Info',
    step2_device: 'Device Info',
    step3_details: 'Request Details',
    step4_review: 'Review',
    form_customer_title: 'Customer Information',
    form_customer_subtitle: 'Enter your personal information for contact',
    label_name: 'Full Name',
    label_phone: 'Mobile Number',
    label_whatsapp: 'WhatsApp Number',
    label_email: 'Email Address',
    label_company: 'Company / Organization',
    placeholder_name: 'Example: Mohamed Ahmed Al-Omari',
    placeholder_phone: '05XXXXXXXX',
    placeholder_whatsapp: 'Leave blank if same as mobile',
    placeholder_email: 'example@email.com',
    placeholder_company: 'Company or organization name (optional)',
    hint_whatsapp: 'Leave blank if same as mobile number',
    step_1_of_4: 'Step 1 of 4',
    btn_next: 'Next',
    form_device_title: 'Device Information',
    form_device_subtitle: 'Tell us about the device you need support for',
    label_device_type: 'Device Type',
    label_device_brand: 'Brand / Manufacturer',
    label_device_model: 'Model',
    label_serial_number: 'Serial Number',
    label_purchase_date: 'Purchase Date',
    label_warranty: 'Warranty',
    placeholder_device_brand: 'Example: Dell, HP, Lenovo, Apple',
    placeholder_device_model: 'Example: Latitude 5420, EliteBook 840',
    placeholder_serial_number: 'Serial number found on the device',
    placeholder_purchase_date: 'YYYY-MM-DD',
    device_laptop: 'Laptop',
    device_desktop: 'Desktop',
    device_pos: 'POS',
    device_hikvision: 'Hikvision',
    device_projector: 'Projector',
    device_monitor: 'Monitor',
    device_printer: 'Printer',
    device_network: 'Network',
    device_accessories: 'Accessories',
    device_other: 'Other',
    step_2_of_4: 'Step 2 of 4',
    btn_back: 'Back',

    form_details_title: 'Request Details',
    form_details_subtitle: 'Describe the problem you are facing in detail',
    label_issue_type: 'Request Type',
    label_priority: 'Priority',
    label_description: 'Problem Description',
    issue_technical: 'Technical Support',
    issue_maintenance: 'Maintenance',
    issue_warranty: 'Warranty',
    issue_installation: 'Installation',
    issue_network: 'Network',
    issue_software: 'Software',
    issue_other: 'Other',
    priority_low: 'Low',
    priority_normal: 'Normal',
    priority_high: 'High',
    priority_urgent: 'Urgent',
    placeholder_description: 'Write a detailed description of the problem you are facing...',
    hint_description: 'The more detailed the description, the faster we can help you',
    step_3_of_4: 'Step 3 of 4',

    form_review_title: 'Review Request',
    form_review_subtitle: 'Verify all information is correct before submitting',
    review_customer: 'Customer Information',
    review_device: 'Device Information',
    review_details: 'Request Details',
    step_4_of_4: 'Step 4 of 4',
    btn_edit: 'Edit',
    btn_submit_ticket: 'Submit Support Ticket',
    success_title: 'Your request has been submitted successfully!',
    success_message: 'Thank you for contacting YAS. Your request has been received and we will contact you soon.',
    success_ticket_label: 'Your Ticket Number',
    success_ticket_hint: 'Keep this number to track your request status at any time',
    btn_track_ticket: 'Track Ticket',
    btn_copy_id: 'Copy Number',
    btn_copy_code: 'Copy Code',
    btn_back_home: 'Back to Home',
    whats_next_title: 'What happens next?',
    whats_next_step1: 'Eng. Adam Farouk will review your request',
    whats_next_step1_sub: 'During official working hours',
    whats_next_step2: 'You will be contacted via phone or WhatsApp',
    whats_next_step2_sub: 'For additional details if needed',
    whats_next_step3: 'Track your request status',
    whats_next_step3_sub: 'Using the number above on the tracking page',
    label_device_brand: 'Brand / Manufacturer',
    label_device_model: 'Model',
    label_serial_number: 'Serial Number',
    label_purchase_date: 'Purchase Date',
    label_warranty: 'Warranty Status',
    placeholder_device_brand: 'Example: Dell, HP, Lenovo, Apple',
    placeholder_device_model: 'Example: Latitude 5420, EliteBook 840',
    placeholder_serial_number: 'Optional — helps with tracking',
    device_laptop: 'Laptop',
    device_desktop: 'Desktop',
    device_pos: 'POS',
    device_hikvision: 'Hikvision',
    device_projector: 'Projector',
    device_monitor: 'Monitor',
    device_printer: 'Printer',
    device_network: 'Network',
    device_accessories: 'Accessories',
    device_other: 'Other',
    warranty_unknown: 'Unknown',
    warranty_active: 'Warranty Active',
    warranty_expiring: 'Warranty Expiring Soon',
    warranty_expired: 'Warranty Expired',
    step_2_of_4: 'Step 2 of 4',
    btn_back: 'Back',
    form_details_title: 'Request Details',
    form_details_subtitle: 'Describe your problem clearly so we can help you better',
    label_issue_type: 'Request Type',
    label_priority: 'Priority',
    label_description: 'Problem Description',
    label_attachments: 'Attach images or files (optional)',
    select_issue_type: 'Select request type',
    issue_technical: 'Technical Support — Technical issue',
    issue_maintenance: 'Maintenance — Inspection and repair',
    issue_warranty: 'Warranty — Inquiry or warranty request',
    issue_complaint: 'Complaint — Service issue',
    issue_inquiry: 'Inquiry — Question about product or service',
    issue_installation: 'Installation — Setup and installation',
    issue_followup: 'Follow-up — Previous request',
    issue_other: 'Other',
    priority_low: 'Low',
    priority_low_sub: 'Minor issue',
    priority_normal: 'Normal',
    priority_normal_sub: 'Affects work',
    priority_high: 'High',
    priority_high_sub: 'Critical issue',
    priority_urgent: 'Urgent',
    priority_urgent_sub: 'Complete stop',
    placeholder_description: 'Describe the problem in detail: When did it start? What are the symptoms? Have you tried any solutions? What is its impact on your work?',
    hint_description: 'The clearer the description, the faster we can help you',
    file_upload_text: 'Drag files here or click to select',
    file_upload_hint: 'PNG, JPG, PDF — Max 10MB',
    step_3_of_4: 'Step 3 of 4',
    btn_review: 'Review Request',
    form_review_title: 'Review Request',
    form_review_subtitle: 'Verify the information before submitting',
    review_customer: 'Customer Information',
    review_device: 'Device Information',
    review_details: 'Request Details',
    review_label_name: 'Name',
    review_label_phone: 'Mobile',
    review_label_whatsapp: 'WhatsApp',
    review_label_email: 'Email',
    review_label_company: 'Company',
    review_label_device_type: 'Device Type',
    review_label_device_brand: 'Brand',
    review_label_device_model: 'Model',
    review_label_serial_number: 'Serial Number',
    review_label_purchase_date: 'Purchase Date',
    review_label_warranty: 'Warranty',
    review_label_issue_type: 'Request Type',
    review_label_priority: 'Priority',
    review_label_description: 'Problem Description',
    review_notice: 'After submission, your request will be assigned to Eng. Adam Farouk and you will be contacted soon.',
    step_4_of_4: 'Step 4 of 4',
    btn_edit: 'Edit',
    btn_submit_ticket: 'Submit Support Ticket',
    success_title: 'Your request has been submitted successfully!',
    success_message: 'Thank you for contacting YAS. Your request has been received and you will be contacted soon.',
    success_ticket_label: 'Your Ticket Number',
    success_ticket_hint: 'Keep this number to track your request status at any time',
    btn_track_ticket: 'Track Ticket',
    btn_copy_id: 'Copy Number',
    btn_copy_code: 'Copy Code',
    btn_back_home: 'Back to Home',
    whats_next_title: 'What happens next?',
    whats_next_step1: 'Eng. Adam Farouk will review your request',
    whats_next_step1_sub: 'During official business hours',
    whats_next_step2: 'You will be contacted via phone or WhatsApp',
    whats_next_step2_sub: 'For additional details if needed',
    whats_next_step3: 'Track your request status',
    whats_next_step3_sub: 'Using the number above on the tracking page',

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
    nav_troubleshooting: '故障排除指南',
    nav_faq: '常见问题',
    language_btn: '语言',

    // Support Form
    support_page_title: '提交支持工单 — YAS Help Desk',
    step1_customer: '客户信息',
    step2_device: '设备信息',
    step3_details: '请求详情',
    step4_review: '审查',
    form_customer_title: '客户信息',
    form_customer_subtitle: '输入您的个人信息以便联系',
    label_name: '全名',
    label_phone: '手机号码',
    label_whatsapp: 'WhatsApp 号码',
    label_email: '电子邮件地址',
    label_company: '公司 / 组织',
    placeholder_name: '示例：Mohamed Ahmed Al-Omari',
    placeholder_phone: '05XXXXXXXX',
    placeholder_whatsapp: '如果与手机相同请留空',
    placeholder_email: 'example@email.com',
    placeholder_company: '公司或组织名称（可选）',
    hint_whatsapp: '如果与手机号码相同请留空',
    step_1_of_4: '第 1 步，共 4 步',
    btn_next: '下一步',
    form_device_title: '设备信息',
    form_device_subtitle: '告诉我们您需要支持的设备',
    label_device_type: '设备类型',
    label_device_brand: '品牌 / 制造商',
    label_device_model: '型号',
    label_serial_number: '序列号',
    label_purchase_date: '购买日期',
    label_warranty: '保修',
    placeholder_device_brand: '示例：Dell、HP、Lenovo、Apple',
    placeholder_device_model: '示例：Latitude 5420、EliteBook 840',
    placeholder_serial_number: '设备上的序列号',
    placeholder_purchase_date: 'YYYY-MM-DD',
    device_laptop: '笔记本电脑',
    device_desktop: '台式机',
    device_pos: 'POS',
    device_hikvision: 'Hikvision',
    device_projector: '投影仪',
    device_monitor: '显示器',
    device_printer: '打印机',
    device_network: '网络',
    device_accessories: '配件',
    device_other: '其他',
    step_2_of_4: '第 2 步，共 4 步',
    btn_back: '上一步',

    form_details_title: '请求详情',
    form_details_subtitle: '详细描述您面临的问题',
    label_issue_type: '请求类型',
    label_priority: '优先级',
    label_description: '问题描述',
    issue_technical: '技术支持',
    issue_maintenance: '维护',
    issue_warranty: '保修',
    issue_installation: '安装',
    issue_network: '网络',
    issue_software: '软件',
    issue_other: '其他',
    priority_low: '低',
    priority_normal: '普通',
    priority_high: '高',
    priority_urgent: '紧急',
    placeholder_description: '写下您面临的问题的详细描述...',
    hint_description: '描述越详细，我们就能越快帮助您',
    step_3_of_4: '第 3 步，共 4 步',

    form_review_title: '审查请求',
    form_review_subtitle: '提交前确认所有信息正确',
    review_customer: '客户信息',
    review_device: '设备信息',
    review_details: '请求详情',
    step_4_of_4: '第 4 步，共 4 步',
    btn_edit: '编辑',
    btn_submit_ticket: '提交支持工单',
    success_title: '您的请求已成功提交！',
    success_message: '感谢您联系 YAS。您的请求已收到，我们将尽快与您联系。',
    success_ticket_label: '您的工单号',
    success_ticket_hint: '保留此号码以便随时跟踪您的请求状态',
    btn_track_ticket: '跟踪工单',
    btn_copy_id: '复制号码',
    btn_copy_code: '复制代码',
    btn_back_home: '返回首页',
    whats_next_title: '接下来会发生什么？',
    whats_next_step1: 'Eng. Adam Farouk 将审查您的请求',
    whats_next_step1_sub: '在官方工作时间内',
    whats_next_step2: '我们将通过电话或 WhatsApp 与您联系',
    whats_next_step2_sub: '如需更多详细信息',
    whats_next_step3: '跟踪您的请求状态',
    whats_next_step3_sub: '使用上面的号码在跟踪页面上',
    placeholder_phone: '05XXXXXXXX',
    placeholder_whatsapp: '如果与手机号码相同请留空',
    placeholder_email: 'example@email.com',
    placeholder_company: '公司或组织名称（可选）',
    hint_whatsapp: '如果与手机号码相同请留空',
    step_1_of_4: '步骤 1 / 4',
    btn_next: '下一步',
    form_device_title: '设备信息',
    form_device_subtitle: '告诉我们您需要支持的设备',
    label_device_type: '设备类型',
    label_device_brand: '品牌 / 制造商',
    label_device_model: '型号',
    label_serial_number: '序列号',
    label_purchase_date: '购买日期',
    label_warranty: '保修状态',
    placeholder_device_brand: '示例：Dell, HP, Lenovo, Apple',
    placeholder_device_model: '示例：Latitude 5420, EliteBook 840',
    placeholder_serial_number: '可选 — 有助于跟踪',
    device_laptop: '笔记本电脑',
    device_desktop: '台式机',
    device_pos: 'POS 机',
    device_hikvision: 'Hikvision',
    device_projector: '投影仪',
    device_monitor: '显示器',
    device_printer: '打印机',
    device_network: '网络',
    device_accessories: '配件',
    device_other: '其他',
    warranty_unknown: '未知',
    warranty_active: '保修有效',
    warranty_expiring: '保修即将到期',
    warranty_expired: '保修已过期',
    step_2_of_4: '步骤 2 / 4',
    btn_back: '返回',
    form_details_title: '请求详情',
    form_details_subtitle: '清楚地描述您的问题，以便我们更好地帮助您',
    label_issue_type: '请求类型',
    label_priority: '优先级',
    label_description: '问题描述',
    label_attachments: '附加图片或文件（可选）',
    select_issue_type: '选择请求类型',
    issue_technical: '技术支持 — 技术问题',
    issue_maintenance: '维护 — 检查和维修',
    issue_warranty: '保修 — 查询或保修请求',
    issue_complaint: '投诉 — 服务问题',
    issue_inquiry: '咨询 — 关于产品或服务的问题',
    issue_installation: '安装 — 设置和安装',
    issue_followup: '跟进 — 之前的请求',
    issue_other: '其他',
    priority_low: '低',
    priority_low_sub: '小问题',
    priority_normal: '普通',
    priority_normal_sub: '影响工作',
    priority_high: '高',
    priority_high_sub: '严重问题',
    priority_urgent: '紧急',
    priority_urgent_sub: '完全停止',
    placeholder_description: '详细描述问题：何时开始？有什么症状？您是否尝试过任何解决方案？对您的工作有什么影响？',
    hint_description: '描述越清楚，我们就能越快帮助您',
    file_upload_text: '将文件拖到此处或点击选择',
    file_upload_hint: 'PNG, JPG, PDF — 最大 10MB',
    step_3_of_4: '步骤 3 / 4',
    btn_review: '审查请求',
    form_review_title: '审查请求',
    form_review_subtitle: '提交前验证信息',
    review_customer: '客户信息',
    review_device: '设备信息',
    review_details: '请求详情',
    review_label_name: '姓名',
    review_label_phone: '手机',
    review_label_whatsapp: 'WhatsApp',
    review_label_email: '电子邮件',
    review_label_company: '公司',
    review_label_device_type: '设备类型',
    review_label_device_brand: '品牌',
    review_label_device_model: '型号',
    review_label_serial_number: '序列号',
    review_label_purchase_date: '购买日期',
    review_label_warranty: '保修',
    review_label_issue_type: '请求类型',
    review_label_priority: '优先级',
    review_label_description: '问题描述',
    review_notice: '提交后，您的请求将分配给 Eng. Adam Farouk，我们将尽快与您联系。',
    step_4_of_4: '步骤 4 / 4',
    btn_edit: '编辑',
    btn_submit_ticket: '提交支持工单',
    success_title: '您的请求已成功提交！',
    success_message: '感谢您联系 YAS。您的请求已收到，我们将尽快与您联系。',
    success_ticket_label: '您的工单号码',
    success_ticket_hint: '保留此号码以便随时跟踪您的请求状态',
    btn_track_ticket: '跟踪工单',
    btn_copy_id: '复制号码',
    btn_copy_code: '复制代码',
    btn_back_home: '返回首页',
    whats_next_title: '接下来会发生什么？',
    whats_next_step1: 'Eng. Adam Farouk 将审查您的请求',
    whats_next_step1_sub: '在官方工作时间内',
    whats_next_step2: '我们将通过电话或 WhatsApp 与您联系',
    whats_next_step2_sub: '如需额外详情',
    whats_next_step3: '跟踪您的请求状态',
    whats_next_step3_sub: '使用上面的号码在跟踪页面上',

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

// Helper function to translate device type
function translateDeviceType(deviceType) {
  const key = `device_${deviceType}`;
  return translations[currentLang][key] || translations['ar'][key] || deviceType;
}

// Helper function to translate priority
function translatePriority(priority) {
  const key = `priority_${priority}`;
  return translations[currentLang][key] || translations['ar'][key] || priority;
}

// Helper function to translate issue type
function translateIssueType(issueType) {
  const key = `issue_${issueType}`;
  return translations[currentLang][key] || translations['ar'][key] || issueType;
}

// Helper function to translate warranty status
function translateWarrantyStatus(warrantyStatus) {
  const key = `warranty_${warrantyStatus}`;
  return translations[currentLang][key] || translations['ar'][key] || warrantyStatus;
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

  // Update select options
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update page title
  const titleEl = document.querySelector('title[data-i18n]');
  if (titleEl) {
    const key = titleEl.getAttribute('data-i18n');
    titleEl.textContent = t(key);
  }
}

// Function to update language button text
function updateLanguageButton() {
  const langBtn = document.getElementById('language-btn');
  if (langBtn) {
    const langNames = {
      'ar': 'العربية',
      'en': 'English',
      'zh': '中文'
    };
    langBtn.innerHTML = `🌐 ${langNames[currentLang]}`;
  }
}

// Toggle language dropdown
function toggleLanguageDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('language-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Close language dropdown when clicking outside
document.addEventListener('click', () => {
  const dropdown = document.getElementById('language-dropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);

  // Language switcher with dropdown
  const langBtn = document.getElementById('language-btn');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguageDropdown);
  }

  // Language dropdown options
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = option.getAttribute('data-lang');
      setLanguage(lang);
      const dropdown = document.getElementById('language-dropdown');
      if (dropdown) {
        dropdown.classList.remove('show');
      }
    });
  });
});
