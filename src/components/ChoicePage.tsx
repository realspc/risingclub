import { useState } from 'react';

import { motion } from 'framer-motion';
import { GraduationCap, CreditCard, Calendar, Users, Briefcase, Shield, ArrowLeft, UserPlus, Sparkles, Star } from 'lucide-react';

interface ChoicePageProps {
  onChoiceSelect: (type: 'internapplication' | 'courses' | 'workshops' | 'clubs' | 'jobs' | 'admin' | 'basic' | 'full') => void;
  onBack?: () => void;
  showCourseTypes?: boolean;
}

const ChoicePage = ({ onChoiceSelect, onBack, showCourseTypes }: ChoicePageProps) => {
  if (showCourseTypes) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen flex flex-col items-center justify-center p-4"
        dir="rtl"
      >
        <div className="max-w-4xl w-full">
          {/* Back Button */}
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="mb-6 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة للخلف
            </motion.button>
          )}

          {/* Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative mb-8"
            >
              <div className="w-24 h-24 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#22b0fc] rounded-full animate-pulse shadow-2xl"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <img 
                    src="/mainlogo.png" 
                    alt="Rising Academy Logo" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <GraduationCap className="w-12 h-12 text-[#22b0fc] hidden" />
                </div>
                {/* Floating sparkles */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1
                  }}
                  className="absolute -bottom-2 -left-2"
                >
                  <Star className="w-5 h-5 text-blue-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              اختر نوع التسجيل في الدورات
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              اختر طريقة التسجيل التي تناسبك في الدورات المدفوعة
            </p>
          </motion.div>

          {/* Course Type Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                boxShadow: "0 25px 50px -12px rgba(34, 176, 252, 0.25)"
              }}
              className="group cursor-pointer"
              onClick={() => onChoiceSelect('basic')}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-[#22b0fc]/25 transition-all duration-500 relative overflow-hidden border border-gray-100 hover:border-[#22b0fc]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#22b0fc]/5 to-cyan-500/5 group-hover:from-[#22b0fc]/10 group-hover:to-cyan-500/10 transition-all duration-500"></div>
                
                {/* Animated background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full"
                  >
                    <GraduationCap className="w-full h-full text-[#22b0fc]" />
                  </motion.div>
                </div>
                
                <div className="relative z-10">
                  <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="w-16 h-16 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <GraduationCap className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">تسجيل أولي</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    تسجيل كمرحلة اولى يحتاج منك التوجه الى المركز بعد التواصل
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="w-3 h-3 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-3 shadow-sm"
                      ></motion.div>
                      <span className="group-hover:text-gray-800 transition-colors">حجز مكانك في الدورة</span>
                    </li>
                    <li className="flex items-center">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="w-3 h-3 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-3 shadow-sm"
                      ></motion.div>
                      <span className="group-hover:text-gray-800 transition-colors">معلومات تفصيلية عن المنهج</span>
                    </li>
                    <li className="flex items-center">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="w-3 h-3 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-3 shadow-sm"
                      ></motion.div>
                      <span className="group-hover:text-gray-800 transition-colors">إمكانية التواصل المباشر</span>
                    </li>
                  </ul>
                  
                  {/* Hover effect badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="mt-6 inline-flex items-center px-3 py-1 bg-[#22b0fc]/10 text-[#22b0fc] text-sm font-medium rounded-full"
                  >
                    <Sparkles className="w-4 h-4 ml-2" />
                    مجاني ومرن
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: -5,
                boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)"
              }}
              className="group cursor-pointer"
              onClick={() => onChoiceSelect('full')}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 relative overflow-hidden border border-gray-100 hover:border-green-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
                
                {/* Animated background pattern */}
                <div className="absolute top-0 left-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full"
                  >
                    <CreditCard className="w-full h-full text-green-500" />
                  </motion.div>
                </div>
                
                <div className="relative z-10">
                  <motion.div 
                    whileHover={{ rotate: -5, scale: 1.1 }}
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <CreditCard className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">تسجيل كلي</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    تسجيل كامل مع دفع اما مرة واحدة او جزئيا وضمان مكانك في الدورة
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full ml-3 shadow-sm"
                      ></motion.div>
                      <span className="group-hover:text-gray-800 transition-colors">ضمان مكانك بنسبة 100%</span>
                    </li>
                    <li className="flex items-center">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full ml-3 shadow-sm"
                      ></motion.div>
                      <span className="group-hover:text-gray-800 transition-colors">امكانية التسجيل عن بعد كليا</span>
                    </li>
                    <li className="flex items-center">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full ml-3 shadow-sm"
                      ></motion.div>
                      <span className="group-hover:text-gray-800 transition-colors">متابعة مستمرة بعد الدورة</span>
                    </li>
                  </ul>
                  
                  {/* Hover effect badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="mt-6 inline-flex items-center px-3 py-1 bg-green-500/10 text-green-600 text-sm font-medium rounded-full"
                  >
                    <Star className="w-4 h-4 ml-2" />
                    الأكثر شمولية
                  </motion.div>
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
      className="min-h-screen flex flex-col items-center justify-center p-4"
      dir="rtl"
    >
      <div className="max-w-6xl w-full">
        {/* Logo and Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-32 h-32 mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#22b0fc] rounded-full animate-pulse shadow-2xl"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
              <img 
                src="/mainlogo.png" 
                alt="Rising Academy Logo" 
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <GraduationCap className="w-16 h-16 text-[#22b0fc] hidden" />
            </div>
            
            {/* Floating elements around logo */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
            </motion.div>
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 2
              }}
              className="absolute -bottom-4 -left-4"
            >
              <Star className="w-6 h-6 text-blue-400 drop-shadow-lg" />
            </motion.div>
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 12,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
              className="absolute top-0 -left-6"
            >
              <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-lg"></div>
            </motion.div>
          </motion.div>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            أكاديمية رايزين
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            اختر الخدمة التي تناسبك من خدماتنا المتنوعة
          </p>
        </motion.div>

        {/* Main Choice Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Paid Courses */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 25px 50px -12px rgba(34, 176, 252, 0.25)"
            }}
            className="group cursor-pointer"
            onClick={() => onChoiceSelect('courses')}
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-[#22b0fc]/25 transition-all duration-500 relative overflow-hidden h-full border border-gray-100 hover:border-[#22b0fc]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#22b0fc]/5 to-cyan-500/5 group-hover:from-[#22b0fc]/10 group-hover:to-cyan-500/10 transition-all duration-500"></div>
              
              {/* Animated background pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full"
                >
                  <GraduationCap className="w-full h-full text-[#22b0fc]" />
                </motion.div>
              </div>
              
              <div className="relative z-10">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-16 h-16 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                >
                  <GraduationCap className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">دورات مدفوعة</h3>
                <p className="text-gray-600 text-lg mb-6">
                  دورات تدريبية متخصصة في مختلف المجالات التقنية واللغوية
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="w-3 h-3 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-3 shadow-sm"
                    ></motion.div>
                    <span className="group-hover:text-gray-800 transition-colors">دورات البرمجة والتكنولوجيا</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="w-3 h-3 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-3 shadow-sm"
                    ></motion.div>
                    <span className="group-hover:text-gray-800 transition-colors">دورات اللغات الأجنبية</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="w-3 h-3 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-3 shadow-sm"
                    ></motion.div>
                    <span className="group-hover:text-gray-800 transition-colors">شهادات معتمدة</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Free Workshops */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: -5,
              boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.25)"
            }}
            className="group cursor-pointer"
            onClick={() => onChoiceSelect('workshops')}
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 relative overflow-hidden h-full border border-gray-100 hover:border-yellow-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <motion.div 
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                >
                  <Calendar className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">ورشات مجانية</h3>
                <p className="text-gray-600 text-lg mb-6">
                  ورش تدريبية مجانية أسبوعية لتطوير المهارات
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full ml-3 shadow-sm"
                    ></motion.div>
                    <span className="group-hover:text-gray-800 transition-colors">ورش أسبوعية مجانية</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full ml-3 shadow-sm"
                    ></motion.div>
                    <span className="group-hover:text-gray-800 transition-colors">مواضيع متنوعة ومفيدة</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full ml-3 shadow-sm"
                    ></motion.div>
                    <span className="group-hover:text-gray-800 transition-colors">شهادات حضور</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Club Membership */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="group cursor-pointer"
            onClick={() => onChoiceSelect('clubs')}
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">الانخراط في النوادي</h3>
                <p className="text-gray-600 text-lg mb-6">
                  انضم إلى نوادينا المتخصصة وطور مهاراتك مع المجتمع
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full ml-3"></div>
                    نوادي متخصصة متنوعة
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full ml-3"></div>
                    أنشطة جماعية ومشاريع
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full ml-3"></div>
                    تطوير المهارات الاجتماعية
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Job Applications */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotateY: -5 }}
            className="group cursor-pointer"
            onClick={() => onChoiceSelect('jobs')}
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">التقديم على وظيفة</h3>
                <p className="text-gray-600 text-lg mb-6">
                  انضم إلى فريق العمل كمدرس أو موظف إداري
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                    وظائف تدريس متنوعة
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                    وظائف إدارية وتقنية
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                    بيئة عمل محفزة
                  </li>
                </ul>
              </div>
            </div>
          </motion.div> 

          {/* Internship Application */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="group cursor-pointer"
            onClick={() => onChoiceSelect('internapplication')}
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 group-hover:from-indigo-500/10 group-hover:to-blue-500/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">طلب تربص</h3>
                <p className="text-gray-600 text-lg mb-6">
                  قدم للتدريب واكتسب خبرة عملية معنا
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full ml-3"></div>
                    فرصة للتعلم الميداني
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full ml-3"></div>
                    إشراف مباشر من خبراء
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full ml-3"></div>
                    شهادة تدريب في نهاية الفترة
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Admin Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChoiceSelect('admin')}
            className="bg-gradient-to-r from-[#22b0fc] to-blue-600 hover:from-[#1a9de8] hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-[#22b0fc]/25 transition-all duration-300 flex items-center mx-auto"
          >
            <Shield className="w-6 h-6 ml-3" />
            الدخول للإدارة
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChoicePage;