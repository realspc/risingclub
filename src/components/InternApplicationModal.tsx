import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Check, UserPlus } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../0-firebase/config';

interface InternApplicationModalProps {
  onBack: () => void;
}

const InternApplicationModal = ({ onBack }: InternApplicationModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    placeOfBirth: '',
    address: '',
    academicSpecialization: '',
    skills: '',
    agreedToContract: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!signatureRef.current || signatureRef.current.isEmpty()) {
        throw new Error('Signature is required');
      }
      
      let cvBase64 = null;
      if (cvFile) {
        cvBase64 = await convertFileToBase64(cvFile);
      }
      
      const applicationData = {
        ...formData,
        age: parseInt(formData.age),
        cvUrl: cvBase64,
        signature: signatureRef.current.toDataURL(),
        applicationDate: new Date(),
        status: 'pending'
      };
      
      await addDoc(collection(db, 'internApplications'), applicationData);
      setSubmitStatus('success');
      
      setTimeout(() => {
        setFormData({
          fullName: '', age: '', phone: '', email: '', dateOfBirth: '',
          placeOfBirth: '', address: '', academicSpecialization: '', skills: '', agreedToContract: false
        });
        setCvFile(null);
        setSubmitStatus(null);
        onBack();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting intern application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen py-8"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10"></div>
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">طلب تـربص</h1>
            <p className="text-gray-600 text-lg">
              املأ النموذج التالي للتقديم على فرصة التدريب
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {submitStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تم التقديم بنجاح!</h3>
              <p className="text-gray-600">تم تقديم طلب التدريب بنجاح. سنتواصل معك قريباً.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    العمر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="35"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="العمر"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="0555 123 456"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    تاريخ الميلاد <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    مكان الميلاد <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="مكان الميلاد"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  العنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="العنوان الكامل"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  التخصص الدراسي <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.academicSpecialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicSpecialization: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="مثال: هندسة معلوماتية، إدارة أعمال، إلخ..."
                />
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  المهارات والخبرات <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="اذكر مهاراتك وخبراتك..."
                />
              </div>

              {/* CV Upload */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  السيرة الذاتية (CV) - اختياري
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white"
                />
                <p className="text-sm text-gray-500 mt-1">
                  يمكنك رفع السيرة الذاتية بصيغة PDF أو Word أو صورة
                </p>
              </div>

              {/* Technology Requirements Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">متطلبات تقنية مهمة</h4>
                    <p className="text-sm text-blue-700">
                      يجب على المتدرب أن يكون لديه معرفة أساسية باستخدام التكنولوجيا مثل:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• استخدام الحاسوب والإنترنت</li>
                      <li>• التعامل مع البريد الإلكتروني</li>
                      <li>• استخدام برامج Office الأساسية (Word, Excel)</li>
                      <li>• القدرة على التعلم والتكيف مع الأدوات الجديدة</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  التوقيع <span className="text-red-500">*</span>
                </label>
                <div className="bg-white rounded-xl p-4 border border-gray-300">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: 'w-full h-32 border border-gray-300 rounded-lg',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => signatureRef.current?.clear()}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    مسح التوقيع
                  </button>
                </div>
              </div>

              {/* Agreement */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreedToContract}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreedToContract: e.target.checked }))}
                    className="mt-1 w-5 h-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-800 text-sm">
                    أوافق على الشروط والسياسات المعمول بها في الأكاديمية
                  </span>
                </label>
              </div>

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-center"
                >
                  حدث خطأ أثناء التقديم. يرجى المحاولة مرة أخرى.
                </motion.div>
              )}

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-2xl hover:shadow-indigo-500/25'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-3"></div>
                      جاري التقديم...
                    </div>
                  ) : (
                    'تقديم الطلب'
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBack}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-medium"
                >
                  العودة
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InternApplicationModal;