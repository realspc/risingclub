import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Image as ImageIcon,
  Save,
  X,
  Settings
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
import { Club, ClubDepartment } from '../types';

const ClubManagement = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    arabicName: '',
    description: '',
    imageUrl: '',
    isActive: true,
    departments: [] as ClubDepartment[]
  });
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    arabicName: '',
    description: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'clubs'), orderBy('createdAt', 'desc'));
    
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
      setClubs(clubsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const clubData = {
        name: formData.name,
        arabicName: formData.arabicName,
        description: formData.description,
        imageUrl: formData.imageUrl,
        departments: formData.departments,
        isActive: formData.isActive,
        createdAt: editingClub?.createdAt || new Date()
      };

      if (editingClub) {
        await updateDoc(doc(db, 'clubs', editingClub.id!), clubData);
      } else {
        await addDoc(collection(db, 'clubs'), {
          ...clubData,
          createdAt: new Date()
        });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving club:', error);
    }
  };

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setFormData({
      name: club.name,
      arabicName: club.arabicName,
      description: club.description,
      imageUrl: club.imageUrl,
      isActive: club.isActive,
      departments: club.departments || []
    });
    setShowForm(true);
  };

  const handleDelete = async (clubId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا النادي؟')) {
      try {
        await deleteDoc(doc(db, 'clubs', clubId));
      } catch (error) {
        console.error('Error deleting club:', error);
      }
    }
  };

  const addDepartment = () => {
    if (newDepartment.name && newDepartment.arabicName) {
      const department: ClubDepartment = {
        id: Date.now().toString(),
        name: newDepartment.name,
        arabicName: newDepartment.arabicName,
        description: newDepartment.description
      };
      
      setFormData(prev => ({
        ...prev,
        departments: [...prev.departments, department]
      }));
      
      setNewDepartment({ name: '', arabicName: '', description: '' });
    }
  };

  const removeDepartment = (departmentId: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.filter(dept => dept.id !== departmentId)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      arabicName: '',
      description: '',
      imageUrl: '',
      isActive: true,
      departments: []
    });
    setNewDepartment({ name: '', arabicName: '', description: '' });
    setEditingClub(null);
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
        <h2 className="text-2xl font-bold text-gray-800">إدارة النوادي</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-[#22b0fc] hover:bg-[#1a9de8] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة نادي جديد
        </motion.button>
      </div>

      {/* Club Form Modal */}
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
            className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingClub ? 'تعديل النادي' : 'إضافة نادي جديد'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    اسم النادي (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                    placeholder="Club Name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    اسم النادي (بالعربية)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.arabicName}
                    onChange={(e) => setFormData(prev => ({ ...prev, arabicName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                    placeholder="اسم النادي"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  وصف النادي
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent resize-none"
                  placeholder="وصف مختصر عن النادي..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  رابط صورة النادي
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

              {/* Departments Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">أقسام النادي</h4>
                
                {/* Add New Department */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h5 className="font-medium text-gray-700 mb-3">إضافة قسم جديد</h5>
                  <div className="grid md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                      placeholder="اسم القسم (English)"
                    />
                    <input
                      type="text"
                      value={newDepartment.arabicName}
                      onChange={(e) => setNewDepartment(prev => ({ ...prev, arabicName: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                      placeholder="اسم القسم (العربية)"
                    />
                    <input
                      type="text"
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment(prev => ({ ...prev, description: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22b0fc] focus:border-transparent"
                      placeholder="وصف القسم"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addDepartment}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <Plus size={16} />
                    إضافة القسم
                  </button>
                </div>

                {/* Existing Departments */}
                {formData.departments.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">الأقسام المضافة:</h5>
                    {formData.departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                        <div>
                          <span className="font-medium">{dept.arabicName}</span>
                          <span className="text-gray-500 text-sm ml-2">({dept.name})</span>
                          {dept.description && (
                            <p className="text-sm text-gray-600">{dept.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDepartment(dept.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  النادي نشط ومتاح للانضمام
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
                  {editingClub ? 'تحديث النادي' : 'إضافة النادي'}
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

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club, index) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={club.imageUrl}
                alt={club.arabicName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  club.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {club.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {club.arabicName}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {club.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="ml-2" />
                  {club.departments?.length || 0} أقسام
                </div>
                {club.departments && club.departments.length > 0 && (
                  <div className="flex flex-wrap gap-1">
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
                        +{club.departments.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(club)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Edit size={14} />
                  تعديل
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(club.id!)}
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

      {clubs.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد نوادي مضافة</h3>
          <p className="text-gray-500">ابدأ بإضافة نادي جديد لعرضه للطلاب</p>
        </div>
      )}
    </div>
  );
};

export default ClubManagement;