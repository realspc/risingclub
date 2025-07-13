import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Check, X, GraduationCap, Info } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { COURSES, WILAYAS, EDUCATION_LEVELS, PAYMENT_METHODS, CONTRACT_TEXT } from '../data/constants';
import { Application } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../0-firebase/config';

interface RegistrationFormProps {
  type: 'basic' | 'full';
  onBack: () => void;
}

const RegistrationForm = ({ type, onBack }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<Partial<Application>>({
    registrationType: type === 'full' ? 'Full' : 'Basic',
  });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showContract, setShowContract] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [files, setFiles] = useState<{
    idFront?: File;
    idBack?: File;
    paymentProof?: File;
  }>({});
  const signatureRef = useRef<SignatureCanvas>(null);

  const professionalCourses = COURSES.filter(course => course.category === 'professional');
  const languageCourses = COURSES.filter(course => course.category === 'language');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      setFiles(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    handleInputChange('paymentMethod', method);
    setShowPaymentDetails(true);
  };

  const getSelectedPaymentMethodDetails = () => {
    return PAYMENT_METHODS.find(method => method.name === selectedPaymentMethod);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const applicationData: Application = {
        ...formData,
        course: selectedCourse,
        submissionDate: new Date(),
      } as Application;

      // Handle file uploads for full registration by converting to base64
      if (type === 'full') {
        if (files.idFront) {
          applicationData.idFrontUrl = await convertFileToBase64(files.idFront);
        }
        if (files.idBack) {
          applicationData.idBackUrl = await convertFileToBase64(files.idBack);
        }
        if (files.paymentProof) {
          applicationData.paymentProofUrl = await convertFileToBase64(files.paymentProof);
        }

        // Add signature
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
          applicationData.signature = signatureRef.current.toDataURL();
        }
      }

      // Save to Firestore
      await addDoc(collection(db, 'applications'), applicationData);

      setSubmitStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ registrationType: type === 'full' ? 'Full' : 'Basic' });
        setSelectedCourse('');
        setSelectedPaymentMethod('');
        setShowPaymentDetails(false);
        setFiles({});
        if (signatureRef.current) {
          signatureRef.current.clear();
        }
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen py-8"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-[#22b0fc]/10"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-[#22b0fc] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <img 
              src="/mainlogo.png" 
              alt="Rising Academy Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                // Fallback to graduation cap if logo fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <GraduationCap className="w-12 h-12 text-white hidden" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Rising Academy</h1>
          <p className="text-gray-600 text-lg">
            {type === 'full' ? 'تسجيل كامل عن بعد' : 'تسجيل أولي مجاني'}
          </p>
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="mb-6 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors duration-300"
      >
        <ArrowLeft className="w-5 h-5 ml-2" />
        العودة للخلف
      </motion.button>

      {/* Form */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                الاسم الكامل <span className="text-sm text-gray-500">Full Name</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent transition-all duration-300"
                placeholder="أدخل اسمك الكامل"
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                العمر <span className="text-sm text-gray-500">Age</span>
              </label>
              <input
                type="number"
                min="16"
                max="65"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent transition-all duration-300"
                placeholder="العمر"
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                رقم الهاتف <span className="text-sm text-gray-500">Phone</span>
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent transition-all duration-300"
                placeholder="0555 123 456"
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                البريد الإلكتروني (اختياري) <span className="text-sm text-gray-500">Email (Optional)</span>
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent transition-all duration-300"
                placeholder="example@email.com"
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                الولاية <span className="text-sm text-gray-500">Wilaya</span>
              </label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent transition-all duration-300"
                onChange={(e) => handleInputChange('wilaya', e.target.value)}
              >
                <option value="">اختر الولاية</option>
                {WILAYAS.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.name}>
                    {wilaya.code} - {wilaya.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                المستوى التعليمي <span className="text-sm text-gray-500">Education</span>
              </label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent transition-all duration-300"
                onChange={(e) => handleInputChange('education', e.target.value)}
              >
                <option value="">اختر المستوى التعليمي</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-gray-800 font-semibold mb-4">
              الدورة المطلوبة <span className="text-sm text-gray-500">Course Selection</span>
            </label>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-3">الدورات المهنية - Professional Courses</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {professionalCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input
                        type="radio"
                        id={course.id}
                        name="course"
                        value={course.name}
                        checked={selectedCourse === course.name}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={course.id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                          selectedCourse === course.name
                            ? 'bg-[#22b0fc] border-[#22b0fc] text-white shadow-lg'
                            : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-semibold">{course.name}</div>
                        <div className="text-sm opacity-80">{course.arabicName}</div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-yellow-600 mb-3">دورات اللغات - Language Courses</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {languageCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input
                        type="radio"
                        id={course.id}
                        name="course"
                        value={course.name}
                        checked={selectedCourse === course.name}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={course.id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                          selectedCourse === course.name
                            ? 'bg-yellow-500 border-yellow-400 text-white shadow-lg'
                            : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-yellow-50'
                        }`}
                      >
                        <div className="font-semibold">{course.name}</div>
                        <div className="text-sm opacity-80">{course.arabicName}</div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                الخبرة السابقة (اختياري) <span className="text-sm text-gray-500">Experience</span>
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent transition-all duration-300 resize-none"
                placeholder="اكتب عن خبرتك السابقة..."
                onChange={(e) => handleInputChange('experience', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                ملاحظات أو استفسارات (اختياري) <span className="text-sm text-gray-500">Comments</span>
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent transition-all duration-300 resize-none"
                placeholder="أي استفسارات أو ملاحظات؟"
                onChange={(e) => handleInputChange('comments', e.target.value)}
              />
            </div>
          </div>

          {/* Full Registration Additional Fields */}
          {type === 'full' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
              className="space-y-6 border-t border-gray-200 pt-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">معلومات إضافية للتسجيل الكامل</h3>
              
              {/* ID Photos */}
              <div>
                <label className="block text-gray-800 font-semibold mb-4">
                  صور بطاقة الهوية <span className="text-sm text-gray-500">ID Card Photos</span>
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">الوجه الأمامي</label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => handleFileChange('idFront', e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#22b0fc] file:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">الوجه الخلفي</label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => handleFileChange('idBack', e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#22b0fc] file:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-gray-800 font-semibold mb-4">
                  طريقة الدفع <span className="text-sm text-gray-500">Payment Method</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {PAYMENT_METHODS.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input
                        type="radio"
                        id={method.id}
                        name="paymentMethod"
                        value={method.name}
                        checked={selectedPaymentMethod === method.name}
                        onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                        className="sr-only"
                        required
                      />
                      <label
                        htmlFor={method.id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                          selectedPaymentMethod === method.name
                            ? 'bg-green-500 border-green-400 text-white shadow-lg'
                            : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-2xl mb-2">{method.icon}</div>
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-xs opacity-80 mt-1">{method.description}</div>
                      </label>
                    </motion.div>
                  ))}
                </div>

                {/* Payment Details */}
                {showPaymentDetails && selectedPaymentMethod && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">
                          تفاصيل الدفع - {getSelectedPaymentMethodDetails()?.name}
                        </h4>
                        <div className="text-sm text-blue-700 whitespace-pre-line">
                          {getSelectedPaymentMethodDetails()?.details}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Payment Proof */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  إثبات الدفع <span className="text-sm text-gray-500">Payment Proof</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => handleFileChange('paymentProof', e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500 file:text-white"
                />
              </div>

              {/* Signature */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  التوقيع <span className="text-sm text-gray-500">Signature</span>
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
                    className="mt-1 w-5 h-5 text-[#22b0fc] border-gray-300 rounded focus:ring-[#22b0fc]"
                    onChange={(e) => handleInputChange('agreedToContract', e.target.checked)}
                  />
                  <span className="text-gray-800 text-sm">
                    أوافق على 
                    <button
                      type="button"
                      onClick={() => setShowContract(true)}
                      className="text-[#22b0fc] hover:underline mx-1"
                    >
                      شروط وأحكام الأكاديمية
                    </button>
                    وسياسة الاسترداد
                    <span className="block text-gray-600 mt-1">
                      I agree to the academy's terms and conditions and refund policy
                    </span>
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !selectedCourse}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              isSubmitting || !selectedCourse
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-green-500/25'
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-3"></div>
                جاري الإرسال...
              </div>
            ) : (
              'إرسال التسجيل'
            )}
          </motion.button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500 text-white p-4 rounded-xl flex items-center"
            >
              <Check className="w-6 h-6 ml-3" />
              تم إرسال التسجيل بنجاح! سنتواصل معك قريباً.
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500 text-white p-4 rounded-xl flex items-center"
            >
              <X className="w-6 h-6 ml-3" />
              حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.
            </motion.div>
          )}
        </form>
      </div>

      {/* Contract Modal */}
      {showContract && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowContract(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">شروط وأحكام التسجيل</h2>
              <button
                onClick={() => setShowContract(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <pre className="whitespace-pre-wrap font-sans">{CONTRACT_TEXT}</pre>
            </div>
            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowContract(false)}
                className="bg-[#22b0fc] hover:bg-[#1a9de8] text-white px-6 py-3 rounded-lg font-medium"
              >
                إغلاق
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RegistrationForm;