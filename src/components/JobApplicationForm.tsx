import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Upload, Check, X } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../0-firebase/config';
import { TEACHING_LANGUAGES, STAFF_FIELDS, JOB_CONTRACT_TEXT } from '../data/constants';

const JobApplicationForm = ({ onBack }) => {
  const [jobType, setJobType] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    placeOfBirth: '',
    address: '',
    teachingLanguage: '',
    staffField: '',
    skills: '',
    agreedToContract: false
  });
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showContract, setShowContract] = useState(false);
  const signatureRef = useRef(null);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
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

      const baseData = {
        jobType,
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email || null,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        address: formData.address,
        skills: formData.skills || null,
        cvUrl: cvBase64, // null if no file uploaded
        signature: signatureRef.current.toDataURL(),
        agreedToContract: formData.agreedToContract,
        applicationDate: new Date(),
        status: 'pending'
      };

      if (jobType === 'teacher') {
        baseData.teachingLanguage = formData.teachingLanguage;
      }
      if (jobType === 'staff') {
        baseData.staffField = formData.staffField;
      }

      await addDoc(collection(db, 'jobApplications'), baseData);

      setSubmitStatus('success');
      setTimeout(() => {
        setJobType('');
        setFormData({
          fullName: '',
          age: '',
          phone: '',
          email: '',
          dateOfBirth: '',
          placeOfBirth: '',
          address: '',
          teachingLanguage: '',
          staffField: '',
          skills: '',
          agreedToContract: false
        });
        setCvFile(null);
        setSubmitStatus(null);
      }, 3000);

    } catch (err) {
      console.error('Error submitting job application:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };



  if (!jobType) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen py-8"
        dir="rtl"
      >
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mb-6 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للخلف
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">التقديم على وظيفة</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              اختر نوع الوظيفة التي تريد التقديم عليها
            </p>
          </motion.div>

          {/* Job Type Selection */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group cursor-pointer"
              onClick={() => setJobType('teacher')}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">مدرس</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    انضم إلى فريق التدريس وشارك خبرتك مع الطلاب
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                      تدريس اللغات المختلفة
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                      بيئة تعليمية محفزة
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                      تطوير مهني مستمر
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ scale: 1.05, rotateY: -5 }}
              className="group cursor-pointer"
              onClick={() => setJobType('staff')}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">موظف إداري</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    انضم إلى الفريق الإداري وساهم في تطوير الأكاديمية
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-3"></div>
                      وظائف إدارية متنوعة
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-3"></div>
                      فرص نمو وتطوير
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-3"></div>
                      بيئة عمل مميزة
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen py-8"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setJobType('')}
          className="mb-6 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
          العودة للخلف
        </motion.button>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              طلب توظيف - {jobType === 'teacher' ? 'مدرس' : 'موظف إداري'}
            </h1>
            <p className="text-gray-600 text-lg">
              املأ النموذج التالي للتقديم على الوظيفة
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
              <p className="text-gray-600">
                تم تقديم طلب التوظيف بنجاح. سنتواصل معك قريباً لمراجعة طلبك.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
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
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="العمر"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
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
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    تاريخ الميلاد <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
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
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="العنوان الكامل"
                />
              </div>

              {/* Job Specific Fields */}
              {jobType === 'teacher' ? (
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    المادة التي تريد تدريسها <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.teachingLanguage}
                    onChange={(e) => setFormData(prev => ({ ...prev, teachingLanguage: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">اختر المادة</option>
                    {TEACHING_LANGUAGES.map((language, index) => (
                      <option key={index} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    المجال الإداري <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.staffField}
                    onChange={(e) => setFormData(prev => ({ ...prev, staffField: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">اختر المجال</option>
                    {STAFF_FIELDS.map((field, index) => (
                      <option key={index} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  المهارات (اختياري)
                </label>
                <textarea
                  rows={3}
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="اذكر مهاراتك وخبراتك..."
                />
              </div>

              {/* CV Upload */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  السيرة الذاتية (CV) <span className="text-red-500"></span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpegs"
                  
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500 file:text-white"
                />
                <p className="text-sm text-gray-500 mt-1">
   </p>
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
                    className="mt-1 w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-800 text-sm">
                    أوافق على 
                    <button
                      type="button"
                      onClick={() => setShowContract(true)}
                      className="text-green-500 hover:underline mx-1"
                    >
                      شروط وأحكام التوظيف
                    </button>
                    والسياسات المعمول بها
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

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isSubmitting
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
                  'تقديم الطلب'
                )}
              </motion.button>
            </form>
          )}
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
                <h2 className="text-2xl font-bold text-gray-800">شروط وأحكام التوظيف</h2>
                <button
                  onClick={() => setShowContract(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <pre className="whitespace-pre-wrap font-sans">{JOB_CONTRACT_TEXT}</pre>
              </div>
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowContract(false)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  إغلاق
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default JobApplicationForm;