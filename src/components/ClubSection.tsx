import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../0-firebase/config';
import { Club } from '../types';
import ClubApplicationModal from './ClubApplicationModal';

interface ClubSectionProps {
  onBack: () => void;
}

const ClubSection = ({ onBack }: ClubSectionProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'clubs'), 
      where('isActive', '==', true)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clubsData: Club[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        clubsData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate()
        } as Club);
      });
      
      clubsData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      setClubs(clubsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching clubs:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleClubJoin = (club: Club) => {
    setSelectedClub(club);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">جاري تحميل النوادي...</p>
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
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">النوادي المتاحة</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            انضم إلى نوادينا المتخصصة وطور مهاراتك مع المجتمع
          </p>
        </motion.div>

        {clubs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl p-12 shadow-2xl">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد نوادي متاحة حالياً</h3>
              <p className="text-gray-500">تابعونا للحصول على آخر التحديثات حول النوادي الجديدة</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={club.imageUrl}
                    alt={club.arabicName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-sm font-semibold text-gray-800">نادي</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {club.arabicName}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {club.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Users size={18} className="ml-3 text-purple-500" />
                      <span>{club.departments.length} أقسام متاحة</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="ml-3 text-purple-500" />
                      <span>أكاديمية رايزين</span>
                    </div>
                  </div>

                  {/* Departments Preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">الأقسام المتاحة:</h4>
                    <div className="flex flex-wrap gap-2">
                      {club.departments.slice(0, 3).map((dept) => (
                        <span
                          key={dept.id}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                        >
                          {dept.arabicName}
                        </span>
                      ))}
                      {club.departments.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{club.departments.length - 3} المزيد
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClubJoin(club)}
                    className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25"
                  >
                    انضم للنادي
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Club Application Modal */}
      {selectedClub && (
        <ClubApplicationModal
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
        />
      )}
    </motion.div>
  );
};

export default ClubSection;