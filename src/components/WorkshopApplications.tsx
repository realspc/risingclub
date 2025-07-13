import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Eye, 
  Download, 
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  User,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../0-firebase/config';
import { WorkshopRegistration, Workshop } from '../types';
import format from 'date-fns/format';
import arSA from 'date-fns/locale/ar-SA';

const WorkshopApplications = () => {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<WorkshopRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch workshop registrations
    const registrationsQuery = query(
      collection(db, 'workshopRegistrations'), 
      orderBy('registrationDate', 'desc')
    );
    
    const unsubscribeRegistrations = onSnapshot(registrationsQuery, (querySnapshot) => {
      const regs: WorkshopRegistration[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        regs.push({ 
          id: doc.id, 
          ...data,
          registrationDate: data.registrationDate?.toDate() 
        } as WorkshopRegistration);
      });
      setRegistrations(regs);
      setLoading(false);
    });

    // Fetch workshops for filtering
    const workshopsQuery = query(collection(db, 'workshops'), orderBy('date', 'desc'));
    
    const unsubscribeWorkshops = onSnapshot(workshopsQuery, (querySnapshot) => {
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
    });

    return () => {
      unsubscribeRegistrations();
      unsubscribeWorkshops();
    };
  }, []);

  const filteredRegistrations = registrations.filter(reg => {
    const matchesWorkshop = selectedWorkshop === 'all' || reg.workshopId === selectedWorkshop;
    const matchesSearch = !searchTerm || 
      reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesWorkshop && matchesSearch;
  });

  const handleStatusChange = async (regId: string, newStatus: 'registered' | 'attended' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'workshopRegistrations', regId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (regId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التسجيل؟')) {
      try {
        await deleteDoc(doc(db, 'workshopRegistrations', regId));
      } catch (error) {
        console.error('Error deleting registration:', error);
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      'الاسم الكامل', 
      'العمر', 
      'الهاتف', 
      'البريد الإلكتروني', 
      'مستوى اللغة',
      'الورشة', 
      'الحالة', 
      'تاريخ التسجيل'
    ].join(',');

    const rows = filteredRegistrations.map(reg => [
      `"${reg.fullName}"`,
      `"${reg.age}"`,
      `"${reg.phone}"`,
      `"${reg.email || ''}"`,
      `"${reg.languageLevel}"`,
      `"${reg.workshopName}"`,
      reg.status === 'registered' ? 'مسجل' : 
        reg.status === 'attended' ? 'حضر' : 'ملغي',
      `"${format(reg.registrationDate, 'yyyy-MM-dd HH:mm', { locale: arSA })}"`
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تسجيلات_الورش_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWorkshopName = (workshopId: string) => {
    const workshop = workshops.find(w => w.id === workshopId);
    return workshop?.arabicName || 'ورشة محذوفة';
  };

  const stats = {
    total: registrations.length,
    registered: registrations.filter(reg => reg.status === 'registered').length,
    attended: registrations.filter(reg => reg.status === 'attended').length,
    cancelled: registrations.filter(reg => reg.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22b0fc] mx-auto mb-4"></div>
          <p className="text-lg">جاري تحميل تسجيلات الورش...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">تسجيلات الورش المجانية</h2>
          <p className="text-gray-600 mt-1">إدارة ومتابعة المسجلين في الورش</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={exportToCSV}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"
        >
          <Download size={18} />
          تصدير البيانات
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'إجمالي التسجيلات', 
            value: stats.total, 
            icon: Users, 
            color: 'bg-[#22b0fc]' 
          },
          { 
            title: 'مسجلين', 
            value: stats.registered, 
            icon: User, 
            color: 'bg-blue-500' 
          },
          { 
            title: 'حضروا', 
            value: stats.attended, 
            icon: CheckCircle, 
            color: 'bg-green-500' 
          },
          { 
            title: 'ملغية', 
            value: stats.cancelled, 
            icon: XCircle, 
            color: 'bg-red-500' 
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.color} text-white rounded-xl p-4 shadow-md`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالاسم أو الهاتف أو البريد..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22b0fc] focus:border-[#22b0fc] outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Workshop Filter */}
          <div className="md:w-64">
            <select
              value={selectedWorkshop}
              onChange={(e) => setSelectedWorkshop(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22b0fc] focus:border-[#22b0fc] outline-none"
            >
              <option value="all">جميع الورش</option>
              {workshops.map((workshop) => (
                <option key={workshop.id} value={workshop.id}>
                  {workshop.arabicName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الاسم</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">العمر</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الهاتف</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">مستوى اللغة</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الورشة</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((registration, index) => (
                  <motion.tr
                    key={registration.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{registration.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{registration.age}</td>
                    <td className="px-4 py-3 text-sm text-gray-800" dir="ltr">{registration.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{registration.languageLevel}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{getWorkshopName(registration.workshopId)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        registration.status === 'registered'
                          ? 'bg-blue-100 text-blue-800'
                          : registration.status === 'attended'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {registration.status === 'registered' 
                          ? 'مسجل' 
                          : registration.status === 'attended' 
                            ? 'حضر' 
                            : 'ملغي'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {format(registration.registrationDate, 'yyyy/MM/dd', { locale: arSA })}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedRegistration(registration)}
                          className="p-1.5 text-[#22b0fc] hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={18} />
                        </motion.button>
                        
                        {registration.status !== 'attended' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStatusChange(registration.id!, 'attended')}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            title="تأكيد الحضور"
                          >
                            <CheckCircle size={18} />
                          </motion.button>
                        )}
                        
                        {registration.status !== 'cancelled' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStatusChange(registration.id!, 'cancelled')}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="إلغاء التسجيل"
                          >
                            <XCircle size={18} />
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(registration.id!)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف التسجيل"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">لا توجد تسجيلات متطابقة مع معايير البحث</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRegistration(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">تفاصيل تسجيل الورشة</h2>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="إغلاق"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">المعلومات الشخصية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">الاسم الكامل</p>
                    <p className="font-medium">{selectedRegistration.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">العمر</p>
                    <p className="font-medium">{selectedRegistration.age} سنة</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-medium" dir="ltr">{selectedRegistration.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium">{selectedRegistration.email || 'غير متوفر'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">مستوى اللغة</p>
                    <p className="font-medium">{selectedRegistration.languageLevel}</p>
                  </div>
                </div>
              </div>

              {/* Workshop Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">معلومات الورشة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">اسم الورشة</p>
                    <p className="font-medium">{selectedRegistration.workshopName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">حالة التسجيل</p>
                    <p className="font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedRegistration.status === 'registered'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedRegistration.status === 'attended'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedRegistration.status === 'registered' 
                          ? 'مسجل' 
                          : selectedRegistration.status === 'attended' 
                            ? 'حضر' 
                            : 'ملغي'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تاريخ التسجيل</p>
                    <p className="font-medium">
                      {format(selectedRegistration.registrationDate, 'yyyy/MM/dd HH:mm', { locale: arSA })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStatusChange(selectedRegistration.id!, 'attended')}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    selectedRegistration.status === 'attended'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  disabled={selectedRegistration.status === 'attended'}
                >
                  <CheckCircle size={18} />
                  {selectedRegistration.status === 'attended' ? 'تم الحضور' : 'تأكيد الحضور'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStatusChange(selectedRegistration.id!, 'cancelled')}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    selectedRegistration.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  disabled={selectedRegistration.status === 'cancelled'}
                >
                  <XCircle size={18} />
                  {selectedRegistration.status === 'cancelled' ? 'تم الإلغاء' : 'إلغاء التسجيل'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDelete(selectedRegistration.id!)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  حذف التسجيل
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default WorkshopApplications;