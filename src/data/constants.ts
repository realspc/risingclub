import { CourseOption, WilayaOption, LanguageLevel } from '../types';

export const COURSES: CourseOption[] = [
  // Professional Courses
  { id: 'it', name: 'IT', arabicName: 'الإعلام الآلي', category: 'professional' },
  { id: 'programming', name: 'Programming', arabicName: 'البرمجة', category: 'professional' },
  { id: 'cybersecurity', name: 'Cyber Security', arabicName: 'الأمن السيبراني', category: 'professional' },
  { id: 'webdev', name: 'Web Development', arabicName: 'برمجة المواقع', category: 'professional' },
  { id: 'video-editing', name: 'Video Editing', arabicName: 'مونتاج الفيديو', category: 'professional' },
  { id: 'graphic-design', name: 'Graphic Design', arabicName: 'التصميم الجرافيكي', category: 'professional' },
  { id: 'digital-marketing', name: 'Digital Marketing', arabicName: 'التسويق الرقمي', category: 'professional' },
  { id: 'photography', name: 'Photography', arabicName: 'التصوير الفوتوغرافي', category: 'professional' },
  { id: 'accounting', name: 'Accounting', arabicName: 'المحاسبة', category: 'professional' },
  { id: 'trading', name: 'Trading', arabicName: 'التداول', category: 'professional' },
  { id: 'project-management', name: 'Project Management', arabicName: 'إدارة المشاريع', category: 'professional' },
  
  // Language Courses
  { id: 'english', name: 'English', arabicName: 'الإنجليزية', category: 'language' },
  { id: 'french', name: 'French', arabicName: 'الفرنسية', category: 'language' },
  { id: 'spanish', name: 'Spanish', arabicName: 'الإسبانية', category: 'language' },
  { id: 'italian', name: 'Italian', arabicName: 'الإيطالية', category: 'language' },
  { id: 'russian', name: 'Russian', arabicName: 'الروسية', category: 'language' },
  { id: 'german', name: 'German', arabicName: 'الألمانية', category: 'language' },
];

export const WILAYAS: WilayaOption[] = [
  { code: '01', name: 'Adrar' },
  { code: '02', name: 'Chlef' },
  { code: '03', name: 'Laghouat' },
  { code: '04', name: 'Oum El Bouaghi' },
  { code: '05', name: 'Batna' },
  { code: '06', name: 'Béjaïa' },
  { code: '07', name: 'Biskra' },
  { code: '08', name: 'Béchar' },
  { code: '09', name: 'Blida' },
  { code: '10', name: 'Bouira' },
  { code: '11', name: 'Tamanrasset' },
  { code: '12', name: 'Tébessa' },
  { code: '13', name: 'Tlemcen' },
  { code: '14', name: 'Tiaret' },
  { code: '15', name: 'Tizi Ouzou' },
  { code: '16', name: 'Algiers' },
  { code: '17', name: 'Djelfa' },
  { code: '18', name: 'Jijel' },
  { code: '19', name: 'Sétif' },
  { code: '20', name: 'Saïda' },
  { code: '21', name: 'Skikda' },
  { code: '22', name: 'Sidi Bel Abbès' },
  { code: '23', name: 'Annaba' },
  { code: '24', name: 'Guelma' },
  { code: '25', name: 'Constantine' },
  { code: '26', name: 'Médéa' },
  { code: '27', name: 'Mostaganem' },
  { code: '28', name: "M'Sila" },
  { code: '29', name: 'Mascara' },
  { code: '30', name: 'Ouargla' },
  { code: '31', name: 'Oran' },
  { code: '32', name: 'El Bayadh' },
  { code: '33', name: 'Illizi' },
  { code: '34', name: 'Bordj Bou Arréridj' },
  { code: '35', name: 'Boumerdès' },
  { code: '36', name: 'El Tarf' },
  { code: '37', name: 'Tindouf' },
  { code: '38', name: 'Tissemsilt' },
  { code: '39', name: 'El Oued' },
  { code: '40', name: 'Khenchela' },
  { code: '41', name: 'Souk Ahras' },
  { code: '42', name: 'Tipaza' },
  { code: '43', name: 'Mila' },
  { code: '44', name: 'Aïn Defla' },
  { code: '45', name: 'Naâma' },
  { code: '46', name: 'Aïn Témouchent' },
  { code: '47', name: 'Ghardaïa' },
  { code: '48', name: 'Relizane' },
  { code: '49', name: 'Timimoun' },
  { code: '50', name: 'Bordj Badji Mokhtar' },
  { code: '51', name: 'Ouled Djellal' },
  { code: '52', name: 'Béni Abbès' },
  { code: '53', name: 'In Salah' },
  { code: '54', name: 'In Guezzam' },
  { code: '55', name: 'Touggourt' },
  { code: '56', name: 'Djanet' },
  { code: '57', name: "El M'Ghair" },
  { code: '58', name: 'El Meniaa' },
];

export const EDUCATION_LEVELS = [
  'طالب جامعي',
  'عامل مؤسسة',
  'صاحب مؤسسة',
  'عاطل عن العمل',
  'غير ذلك'
];

export const LANGUAGE_LEVELS: LanguageLevel[] = [
  { id: 'a1', name: 'A1', description: 'مبتدئ - Beginner' },
  { id: 'a2', name: 'A2', description: 'أساسي - Elementary' },
  { id: 'b1', name: 'B1', description: 'متوسط - Intermediate' },
  { id: 'b2', name: 'B2', description: 'متوسط عالي - Upper Intermediate' },
  { id: 'c1', name: 'C1', description: 'متقدم - Advanced' },
  { id: 'c2', name: 'C2', description: 'إتقان - Proficiency' },
  { id: 'native', name: 'Native', description: 'لغة أم - Native Speaker' },
  { id: 'none', name: 'None', description: 'لا أتحدث اللغة - No Knowledge' }
];

export const TEACHING_LANGUAGES = [
  'الإنجليزية - English',
  'الفرنسية - French',
  'الإسبانية - Spanish',
  'الإيطالية - Italian',
  'الألمانية - German',
  'الروسية - Russian',
  'العربية - Arabic',
  'محاسبة – Accounting',
  'محاسبة – Accounting',
'إدارة أعمال – Business Management',
'تسويق رقمي – Digital Marketing',
'تداول – Trading',
'الاقتصاد الشخصي – Personal Finance',
'برمجة – Programming',
'برمجة جافاسكربت – JavaScript Programming',
'برمجة بايثون – Python Programming',
'تطوير مواقع – Web Development',
'تطوير تطبيقات موبايل – Mobile App Development',
'الذكاء الاصطناعي – Artificial Intelligence (AI)',
'علوم البيانات – Data Science',
'الأمن السيبراني – Cybersecurity',
'تصميم جرافيك – Graphic Design',
'تصميم داخلي – Interior Design',
'مونتاج فيديو – Video Editing',
'تصوير فوتوغرافي – Photography'


];

export const STAFF_FIELDS = [
  'التسويق - Marketing',
  'النظافة - Cleaning',
  'الاستقبال - Reception',
  'الإدارة - Administration',
  'الدعم التقني - Technical Support',
  'المحاسبة - Accounting',
  'الأمن - Security',
  'الصيانة - Maintenance'
];

export const HEALTH_PROBLEMS = [
  'القلق الاجتماعي - Social Anxiety',
  'اضطراب نقص الانتباه وفرط النشاط - ADHD',
  'الخوف من المجتمع - Social Phobia',
  'الاكتئاب - Depression',
  'اضطرابات النوم - Sleep Disorders',
  'مشاكل في السمع - Hearing Problems',
  'مشاكل في البصر - Vision Problems',
  'أخرى - Other'
];

export const PAYMENT_METHODS = [
  { 
    id: 'ccp', 
    name: 'CCP', 
    icon: '💳',
    description: 'الحساب الجاري البريدي',
    details: 'رقم الحساب: 0020547896 - المفتاح: 25\nاسم صاحب الحساب: أكاديمية رايزين\nيرجى إرسال إثبات الدفع بعد التحويل'
  },
  { 
    id: 'baridimob', 
    name: 'Baridimob', 
    icon: '📱',
    description: 'تطبيق بريدي موب',
    details: 'رقم الهاتف: 0555 123 456\nاسم المستفيد: أكاديمية رايزين\nيرجى إرسال لقطة شاشة للعملية'
  },
  { 
    id: 'check', 
    name: 'Check', 
    icon: '📄',
    description: 'شيك بنكي',
    details: 'يرجى كتابة الشيك باسم: أكاديمية رايزين\nتسليم الشيك في مقر الأكاديمية\nأو إرسال صورة واضحة للشيك'
  }
];

export const CONTRACT_TEXT = `شروط وأحكام التسجيل في الأكاديمية

أولاً: التزامات الطالب
يتعهد الطالب بالالتزام الكامل بكافة القوانين والأنظمة المعمول بها في الأكاديمية.

الالتزام بالحضور والانضباط في الدراسة وفقًا للجدول الزمني المحدد.

الالتزام بالسلوك الشخصي والأخلاقي داخل الأكاديمية.

الالتزام بارتداء ملابس مناسبة تتوافق مع معايير الأكاديمية.

الإبلاغ عن الحالات المرضية التي تستدعي الغياب مع تقديم الوثائق اللازمة.

ثانيًا: النظام المالي للتسجيل
يجب دفع حقوق التسجيل المقدرة بـ 1000 دينار جزائري عند التسجيل ولا تُسترجع تحت أي ظرف.

يتم تسديد مستحقات التكوين على أقساط شهرية أو دفعة واحدة حسب الاتفاق المسبق.

لا يتم استرجاع أي جزء من رسوم التكوين بعد بدء الدراسة.

في حال انسحاب الطالب بعد بدء الدراسة، لا يتم استرجاع الرسوم المدفوعة.

تُدفع رسوم قدرها 3000 دينار جزائري عند استخراج شهادة التكوين أو أي وثائق رسمية أخرى.

ثالثًا: المعايير الأكاديمية
يجب على الطالب تحقيق المعايير الأكاديمية لاجتياز الوحدات الدراسية بنجاح.

تُمنح الشهادات فقط بعد اجتياز جميع الوحدات واجتياز الاختبارات بنجاح.

يمكن للطالب طلب إعادة تقييم نتائجه عبر تقديم طلب رسمي ودفع الرسوم المحددة.

رابعًا: سياسة التعويض الدراسي
التعويض الدراسي المبرر: يُسمح للطالب الذي يغيب بسبب مبرر موثق بتعويض الدروس مجانًا ضمن شروط محددة.

التعويض الدراسي غير المبرر: يمكن تعويض الدروس بمبلغ مالي قدره 1000 دينار جزائري لكل درس.

خامسًا: توثيق الفعاليات والأنشطة
توافق بتسجيلك على إمكانية تصوير الفعاليات التعليمية وعرضها لأغراض تعليمية أو دعائية بما يتوافق مع سياسة الخصوصية للأكاديمية.

سادسًا: حقوق الأكاديمية وواجبات الطالب
تحتفظ الأكاديمية بحق تعديل البرامج الدراسية، مواعيد الحصص، أو السياسات الأكاديمية.

لا تلتزم الأكاديمية برد الرسوم في حالة انسحاب الطالب أو فصله بسبب مخالفة القوانين أو سوء السلوك.

لا يحق للطالب المطالبة باسترداد المبالغ المدفوعة بعد بدء الدراسة.

توضيح رسمي
تُعتبر هذه الوثيقة الاتفاقية الرسمية والنهائية التي تحدد الحقوق والواجبات بين الطالب والأكاديمية. وأي اتفاقات أو تعهدات أخرى خارج هذه الوثيقة غير معترف بها ما لم تكن موثقة رسميًا.`;

export const CLUB_CONTRACT_TEXT = `شروط وأحكام الانضمام للنوادي

أولاً: التزامات العضو
يتعهد العضو بالالتزام الكامل بكافة القوانين والأنظمة المعمول بها في النادي.

الالتزام بالحضور والمشاركة الفعالة في الأنشطة المحددة.

الالتزام بالسلوك الأخلاقي والاحترام المتبادل مع جميع الأعضاء.

المحافظة على ممتلكات النادي وعدم إلحاق الضرر بها.

ثانيًا: الأنشطة والفعاليات
المشاركة في الأنشطة التطوعية والثقافية والاجتماعية.

الالتزام بالمواعيد المحددة للاجتماعات والفعاليات.

المساهمة الإيجابية في تطوير النادي وأنشطته.

ثالثًا: الحقوق والواجبات
حق العضو في المشاركة في جميع الأنشطة المتاحة.

حق العضو في التعبير عن آرائه ومقترحاته.

واجب العضو في دفع الرسوم المحددة في حالة وجودها.

واجب العضو في الحفاظ على سرية المعلومات الداخلية للنادي.

رابعًا: الانسحاب والفصل
يحق للعضو الانسحاب من النادي بتقديم طلب رسمي.

يحق للنادي فصل العضو في حالة مخالفة القوانين أو سوء السلوك.

لا يتم استرداد أي رسوم مدفوعة في حالة الانسحاب أو الفصل.`;

export const JOB_CONTRACT_TEXT = `شروط وأحكام التقديم للوظائف

أولاً: شروط التقديم
يجب أن يكون المتقدم مؤهلاً للوظيفة المطلوبة.

تقديم جميع الوثائق المطلوبة بشكل صحيح وكامل.

الالتزام بالصدق والأمانة في تقديم المعلومات.

ثانيًا: عملية التوظيف
سيتم مراجعة جميع الطلبات من قبل لجنة متخصصة.

قد يتم إجراء مقابلات شخصية أو اختبارات تقييمية.

سيتم إشعار المتقدمين بنتائج طلباتهم خلال فترة زمنية محددة.

ثالثًا: التزامات الموظف
الالتزام بأوقات العمل المحددة.

الالتزام بسياسات وإجراءات الأكاديمية.

المحافظة على سرية المعلومات والبيانات.

تقديم أفضل مستوى من الخدمة للطلاب والعملاء.

رابعًا: حقوق الموظف
الحصول على راتب عادل ومناسب للوظيفة.

الحصول على التدريب والتطوير المهني.

بيئة عمل آمنة ومحترمة.

الحصول على الإجازات والعطل المقررة.`;