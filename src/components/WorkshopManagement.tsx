import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  Image as ImageIcon,
  Save,
  X,
  Eye
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../0-firebase/config';
import { Workshop } from '../types';
import format from 'date-fns/format';
import arSA from 'date-fns/locale/ar-SA';

const WorkshopManagement = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    arabicName: '',
    description: '',
    imageUrl: '',
    date: '',
    time: '',
    duration: '',
    maxParticipants: 20,
    isActive: true
  });

  useEffect(() => {
    const q = query(collection(db, 'workshops'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workshopsData: Workshop[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        workshopsData.push({ 
          id: doc.id, 
          ...data,
          date: data.date?.toDate(),
          createdAt: data.createdAt?.toDate()
        } as Workshop);
      });
      setWorkshops(workshopsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Combine date and time
      const workshopDateTime = new Date(`${formData.date}T${formData.time || '10:00'}`);
      
      const workshopData = {
        name: formData.name,
        arabicName: formData.arabicName,
        description: formData.description,
        imageUrl: formData.imageUrl,
        date: workshopDateTime,
        duration: formData.duration,
        maxParticipants: formData.maxParticipants,
        isActive: formData.isActive,
        currentParticipants: editingWorkshop?.currentParticipants || 0,
        createdAt: editingWorkshop?.createdAt || new Date()
      };

      if (editingWorkshop) {
        await updateDoc(doc(db, 'workshops', editingWorkshop.id!), workshopData);
      } else {
        await addDoc(collection(db, 'workshops'), {
          ...workshopData,
          createdAt: new Date()
        });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving workshop:', error);
    }
  };

  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      name: workshop.name,
      arabicName: workshop.arabicName,
      description: workshop.description,
      imageUrl: workshop.imageUrl,
      date: format(workshop.date, 'yyyy-MM-dd'),
      time: format(workshop.date, 'HH:mm'),
      duration: workshop.duration,
      maxParticipants: workshop.maxParticipants,
      isActive: workshop.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (workshopId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الورشة؟')) {
      try {
        await deleteDoc(doc(db, 'workshops', workshopId));
      } catch (error) {
        console.error('Error deleting workshop:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      arabicName: '',
      description: '',
      imageUrl: '',
      date: '',
      time: '',
      duration: '',
      maxParticipants: 20,
      isActive: true
    });
    setEditingWorkshop(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22b0fc]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الورش المجانية</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-[#22b0fc] hover:bg-[#1a9de8] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة ورشة جديدة
        </motion.button>
      </div>

      {/* Workshop Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => resetForm()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingWorkshop ? 'تعديل الورشة' : 'إضافة ورشة جديدة'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    اسم الورشة (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                    placeholder="Workshop Name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    اسم الورشة (بالعربية)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.arabicName}
                    onChange={(e) => setFormData(prev => ({ ...prev, arabicName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                    placeholder="اسم الورشة"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  وصف الورشة
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent resize-none"
                  placeholder="وصف مختصر عن الورشة..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  رابط صورة الورشة
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    تاريخ الورشة
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    وقت الورشة
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    مدة الورشة
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                    placeholder="3 ساعات"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    عدد المشاركين الأقصى
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-[#22b0fc] border-gray-300 rounded focus:ring-[#22b0fc]"
                />
                <label htmlFor="isActive" className="mr-2 text-gray-700">
                  الورشة نشطة ومتاحة للتسجيل
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-[#22b0fc] hover:bg-[#1a9de8] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {editingWorkshop ? 'تحديث الورشة' : 'إضافة الورشة'}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium"
                >
                  إلغاء
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop, index) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={workshop.imageUrl}
                alt={workshop.arabicName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  workshop.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {workshop.isActive ? 'نشطة' : 'غير نشطة'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {workshop.arabicName}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {workshop.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="ml-2" />
                  {format(workshop.date, 'yyyy/MM/dd HH:mm', { locale: arSA })}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="ml-2" />
                  {workshop.duration}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="ml-2" />
                  {workshop.currentParticipants} / {workshop.maxParticipants} مشارك
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(workshop)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Edit size={14} />
                  تعديل
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(workshop.id!)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  حذف
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {workshops.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد ورش مضافة</h3>
          <p className="text-gray-500">ابدأ بإضافة ورشة جديدة لعرضها للطلاب</p>
        </div>
      )}
    </div>
  );
};

export default WorkshopManagement;