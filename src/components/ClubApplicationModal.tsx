import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Check } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../0-firebase/config';
import { Club, ClubApplication } from '../types';
import { LANGUAGE_LEVELS, HEALTH_PROBLEMS, CLUB_CONTRACT_TEXT } from '../data/constants';

interface ClubApplicationModalProps {
  club: Club;
  onClose: () => void;
}

const ClubApplicationModal = ({ club, onClose }: ClubApplicationModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    placeOfBirth: '',
    skills: '',
    address: '',
    languageLevel: '',
    healthProblems: '',
    departmentId: '',
    agreedToContract: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [showContract, setShowContract] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedDepartment = club.departments.find(dept => dept.id === formData.departmentId);
      
      if (!selectedDepartment) {
        throw new Error('Department not found');
      }

      if (!signatureRef.current || signatureRef.current.isEmpty()) {
        throw new Error('Signature is required');
      }

      const applicationData: Omit<ClubApplication, 'id'> = {
        clubId: club.id!,
        clubName: club.arabicName,
        departmentId: formData.departmentId,
        departmentName: selectedDepartment.arabicName,
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        skills: formData.skills,
        address: formData.address,
        languageLevel: formData.languageLevel,
        healthProblems: formData.healthProblems,
        signature: signatureRef.current.toDataURL(),
        agreedToContract: formData.agreedToContract,
        applicationDate: new Date(),
        status: 'pending'
      };

      await addDoc(collection(db, 'clubApplications'), applicationData);

      setSubmitStatus('success');
      
      setTimeout(() => {
        setFormData({
          fullName: '', age: '', phone: '', email: '', dateOfBirth: '',
          placeOfBirth: '', skills: '', address: '', languageLevel: '',
          healthProblems: '', departmentId: '', agreedToContract: false
        });
        setSubmitStatus(null);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting club application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">الانضمام للنادي</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Club Info */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={club.imageUrl}
              alt={club.arabicName}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {club.arabicName}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{club.description}</p>
              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="ml-2" />
                {club.departments.length} أقسام متاحة
              </div>
            </div>
          </div>
        </div>

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
              تم تقديم طلب انضمامك للنادي بنجاح. سنتواصل معك قريباً.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department Selection */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                اختر القسم <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">اختر القسم</option>
                {club.departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.arabicName} - {dept.description}
                  </option>
                ))}
              </select>
            </div>

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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                  min="16"
                  max="65"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="العنوان الكامل"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  مستوى اللغة <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.languageLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, languageLevel: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">اختر مستوى اللغة</option>
                  {LANGUAGE_LEVELS.map((level) => (
                    <option key={level.id} value={level.name}>
                      {level.name} - {level.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  المشاكل الصحية (اختياري)
                </label>
                <select
                  value={formData.healthProblems}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthProblems: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">لا توجد مشاكل صحية</option>
                  {HEALTH_PROBLEMS.map((problem, index) => (
                    <option key={index} value={problem}>
                      {problem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                المهارات (اختياري)
              </label>
              <textarea
                rows={3}
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="اذكر مهاراتك وخبراتك..."
              />
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
                  className="mt-1 w-5 h-5 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-gray-800 text-sm">
                  أوافق على 
                  <button
                    type="button"
                    onClick={() => setShowContract(true)}
                    className="text-purple-500 hover:underline mx-1"
                  >
                    شروط وأحكام النادي
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

            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
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
                onClick={onClose}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium"
              >
                إلغاء
              </motion.button>
            </div>
          </form>
        )}

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
                <h2 className="text-2xl font-bold text-gray-800">شروط وأحكام النادي</h2>
                <button
                  onClick={() => setShowContract(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <pre className="whitespace-pre-wrap font-sans">{CLUB_CONTRACT_TEXT}</pre>
              </div>
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowContract(false)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  إغلاق
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ClubApplicationModal;