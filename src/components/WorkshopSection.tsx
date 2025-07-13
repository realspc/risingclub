import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, ArrowLeft } from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../0-firebase/config';
import { Workshop } from '../types';
import format from 'date-fns/format';
import arSA from 'date-fns/locale/ar-SA';
import WorkshopRegistrationModal from './WorkshopRegistrationModal';

interface WorkshopSectionProps {
  onBack: () => void;
}

const WorkshopSection = ({ onBack }: WorkshopSectionProps) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'workshops'), 
      where('isActive', '==', true)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workshopsData: Workshop[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const workshopDate = data.date?.toDate();
        
        if (workshopDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (workshopDate >= today) {
            workshopsData.push({ 
              id: doc.id, 
              ...data,
              date: workshopDate,
              createdAt: data.createdAt?.toDate()
            } as Workshop);
          }
        }
      });
      
      workshopsData.sort((a, b) => a.date.getTime() - b.date.getTime());
      setWorkshops(workshopsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching workshops:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleWorkshopRegister = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">جاري تحميل الورش...</p>
        </div>
      </div>
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
      <div className="max-w-6xl mx-auto px-4">
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
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">الورش المجانية القادمة</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            انضم إلى ورشنا المجانية واكتسب مهارات جديدة
          </p>
        </motion.div>

        {workshops.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl p-12 shadow-2xl">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد ورش متاحة حالياً</h3>
              <p className="text-gray-500">تابعونا للحصول على آخر التحديثات حول الورش القادمة</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={workshop.imageUrl}
                    alt={workshop.arabicName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-sm font-semibold text-gray-800">مجاني</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {workshop.arabicName}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {workshop.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={18} className="ml-3 text-yellow-500" />
                      <span className="font-medium">
                        {format(workshop.date, 'EEEE، dd MMMM yyyy', { locale: arSA })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={18} className="ml-3 text-yellow-500" />
                      <span>{workshop.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users size={18} className="ml-3 text-yellow-500" />
                      <span>
                        {workshop.maxParticipants - workshop.currentParticipants} مقعد متبقي
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="ml-3 text-yellow-500" />
                      <span>أكاديمية رايزين</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWorkshopRegister(workshop)}
                    disabled={workshop.currentParticipants >= workshop.maxParticipants}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                      workshop.currentParticipants >= workshop.maxParticipants
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-yellow-500/25'
                    }`}
                  >
                    {workshop.currentParticipants >= workshop.maxParticipants 
                      ? 'الورشة مكتملة' 
                      : 'سجل الآن مجاناً'
                    }
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Workshop Registration Modal */}
      {selectedWorkshop && (
        <WorkshopRegistrationModal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </motion.div>
  );
};

export default WorkshopSection;