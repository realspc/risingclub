import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { 
  LogOut, 
  Filter, 
  Eye, 
  Download, 
  Users, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Printer,
  Settings,
  FileText,
  UserCheck,
  Briefcase,
  Award,
  User,
  BarChart3,
  PieChart
} from 'lucide-react';

import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';

import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

import { auth, db } from '../0-firebase/config';
import { Application } from '../types';
import format from 'date-fns/format';
import arSA from 'date-fns/locale/ar-SA';


import WorkshopManagement from './WorkshopManagement';
import WorkshopApplications from './WorkshopApplications';
import ClubManagement from './ClubManagement';
import ClubApplications from './ClubApplications';
import JobApplications from './JobApplications';
import InternApplications from './InternApplications';
import StatisticsPanel from './StatisticsPanel';

const AdminDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [registrationTypeFilter, setRegistrationTypeFilter] = useState<'all' | 'basic' | 'full'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'workshops' | 'workshop-applications' | 'clubs' | 'club-applications' | 'job-applications' | 'intern-applications' | 'statistics'>('applications');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const formatDate = (date: Date) => {
    try {
      return format(date, 'yyyy/MM/dd HH:mm', { locale: arSA });
    } catch (error) {
      console.error('Date formatting error:', error);
      return date.toLocaleDateString('ar-SA');
    }
  };

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const q = query(collection(db, 'applications'), orderBy('submissionDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apps: Application[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          status: data.status || 'pending',
          submissionDate: data.submissionDate?.toDate() 
        } as Application);
      });
      setApplications(apps);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    let result = applications;
    
    if (filter !== 'all') {
      result = result.filter(app => app.status === filter);
    }
    
    if (registrationTypeFilter !== 'all') {
      result = result.filter(app => 
        app.registrationType?.toLowerCase() === registrationTypeFilter
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.fullName?.toLowerCase().includes(term) ||
        app.phone?.includes(term) ||
        app.email?.toLowerCase().includes(term)
      );
    }
    
    setFilteredApplications(result);
  }, [applications, filter, registrationTypeFilter, searchTerm]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: newStatus,
        reviewedAt: new Date(),
        reviewedBy: currentUser?.uid
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (appId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      try {
        await deleteDoc(doc(db, 'applications', appId));
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      'الاسم الكامل', 
      'الهاتف', 
      'البريد الإلكتروني', 
      'الدورة', 
      'نوع التسجيل', 
      'الحالة', 
      'تاريخ التسجيل'
    ].join(',');

    const rows = filteredApplications.map(app => [
      `"${app.fullName || ''}"`,
      `"${app.phone || ''}"`,
      `"${app.email || ''}"`,
      `"${app.course || ''}"`,
      app.registrationType === 'Basic' ? 'أولي' : 'كامل',
      app.status === 'pending' ? 'قيد المراجعة' : 
        app.status === 'approved' ? 'مقبول' : 'مرفوض',
      `"${format(app.submissionDate, 'yyyy-MM-dd HH:mm', { locale: arSA })}"`
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `طلبات_التسجيل_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    basic: applications.filter(app => app.registrationType === 'Basic').length,
    full: applications.filter(app => app.registrationType === 'Full').length,
    thisMonth: applications.filter(app => {
      const appDate = new Date(app.submissionDate);
      const now = new Date();
      return appDate.getMonth() === now.getMonth() && 
             appDate.getFullYear() === now.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center text-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22b0fc] mx-auto mb-4"></div>
          <p className="text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-4 md:p-8"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">لوحة التحكم الإدارية</h1>
            <p className="text-gray-600 mt-1">إدارة جميع طلبات التسجيل والخدمات</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {activeTab === 'applications' && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={exportToCSV}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"
              >
                <Download size={18} />
                تصدير البيانات
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"
            >
              <LogOut size={18} />
              تسجيل الخروج
            </motion.button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 mb-6 shadow-md">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${
              activeTab === 'applications'
                ? 'bg-[#22b0fc] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText size={16} />
            طلبات الدورات
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('statistics')}
            className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${
              activeTab === 'statistics'
                ? 'bg-[#22b0fc] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={16} />
            الإحصائيات
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('workshops')}
            className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${
              activeTab === 'workshops'
                ? 'bg-[#22b0fc] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={16} />
            إدارة الورش
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('workshop-applications')}
            className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${
              activeTab === 'workshop-applications'
                ? 'bg-[#22b0fc] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCheck size={16} />
            تسجيلات الورش
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('clubs')}
            className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${
              activeTab === 'clubs'
                ? 'bg-[#22b0fc] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users size={16} />
            إدارة النوادي
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('club-applications')}
            className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${
              activeTab === 'club-applications'
                ? 'bg-[#22b0fc] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Award size={16} />
            طلبات النوادي
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('job-applications')}
            className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${
              activeTab === 'job-applications'
                ? 'bg-[#22b0fc] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Briefcase size={16} />
            طلبات التوظيف
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('intern-applications')}
            className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${
              activeTab === 'intern-applications'
                ? 'bg-[#22b0fc] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User size={16} />
            طلبات التدريب
          </motion.button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'workshops' ? (
        <WorkshopManagement />
      ) : activeTab === 'statistics' ? (
        <StatisticsPanel />
      ) : activeTab === 'intern-applications' ? (
        <InternApplications />
      ) : activeTab === 'workshop-applications' ? (
        <WorkshopApplications />
      ) : activeTab === 'clubs' ? (
        <ClubManagement />
      ) : activeTab === 'club-applications' ? (
        <ClubApplications />
      ) : activeTab === 'job-applications' ? (
        <JobApplications />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { 
                title: 'إجمالي الطلبات', 
                value: stats.total, 
                icon: Users, 
                color: 'bg-[#22b0fc]' 
              },
              { 
                title: 'طلبات أولية', 
                value: stats.basic, 
                icon: Users, 
                color: 'bg-cyan-500' 
              },
              { 
                title: 'طلبات كاملة', 
                value: stats.full, 
                icon: TrendingUp, 
                color: 'bg-green-500' 
              },
              { 
                title: 'هذا الشهر', 
                value: stats.thisMonth, 
                icon: Calendar, 
                color: 'bg-purple-500' 
              },
              { 
                title: 'قيد المراجعة', 
                value: stats.pending, 
                icon: Edit, 
                color: 'bg-yellow-500' 
              },
              { 
                title: 'مقبولة', 
                value: stats.approved, 
                icon: CheckCircle, 
                color: 'bg-green-500' 
              },
              { 
                title: 'مرفوضة', 
                value: stats.rejected, 
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

          {/* Filters Section */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-md">
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
              
              {/* Status Filter */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'الكل', color: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
                  { key: 'pending', label: 'قيد المراجعة', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
                  { key: 'approved', label: 'مقبولة', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
                  { key: 'rejected', label: 'مرفوضة', color: 'bg-red-100 hover:bg-red-200 text-red-800' },
                ].map((filterOption) => (
                  <motion.button
                    key={filterOption.key}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${filterOption.color} ${
                      filter === filterOption.key ? 'ring-2 ring-offset-2 ring-[#22b0fc]' : ''
                    }`}
                  >
                    {filterOption.label}
                  </motion.button>
                ))}
              </div>
              
              {/* Registration Type Filter */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'الكل', color: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
                  { key: 'basic', label: 'أولي', color: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
                  { key: 'full', label: 'كامل', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
                ].map((typeOption) => (
                  <motion.button
                    key={typeOption.key}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRegistrationTypeFilter(typeOption.key as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${typeOption.color} ${
                      registrationTypeFilter === typeOption.key ? 'ring-2 ring-offset-2 ring-[#22b0fc]' : ''
                    }`}
                  >
                    {typeOption.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الاسم</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الهاتف</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الدورة</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">النوع</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app, index) => (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{app.fullName}</td>
                        <td className="px-4 py-3 text-sm text-gray-800" dir="ltr">{app.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{app.course}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            app.registrationType === 'Basic'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {app.registrationType === 'Basic' ? 'أولي' : 'كامل'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            !app.status || app.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : app.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {!app.status || app.status === 'pending' 
                              ? 'قيد المراجعة' 
                              : app.status === 'approved' 
                                ? 'مقبول' 
                                : 'مرفوض'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {format(app.submissionDate, 'yyyy/MM/dd', { locale: arSA })}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2 justify-end">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedApplication(app)}
                              className="p-1.5 text-[#22b0fc] hover:bg-blue-50 rounded-lg transition-colors"
                              title="عرض التفاصيل"
                            >
                              <Eye size={18} />
                            </motion.button>
                            
                            {app.status !== 'approved' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleStatusChange(app.id, 'approved')}
                                className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                title="قبول الطلب"
                              >
                                <CheckCircle size={18} />
                              </motion.button>
                            )}
                            
                            {app.status !== 'rejected' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleStatusChange(app.id, 'rejected')}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="رفض الطلب"
                              >
                                <XCircle size={18} />
                              </motion.button>
                            )}
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(app.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف الطلب"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">لا توجد طلبات متطابقة مع معايير البحث</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Application Details Modal */}
          {selectedApplication && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedApplication(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-800">تفاصيل طلب التسجيل</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="طباعة"
                    >
                      <Printer size={18} />
                    </button>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="إغلاق"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3">المعلومات الشخصية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">الاسم الكامل</p>
                        <p className="font-medium">{selectedApplication.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">رقم الهاتف</p>
                        <p className="font-medium" dir="ltr">{selectedApplication.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                        <p className="font-medium">{selectedApplication.email || 'غير متوفر'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">العمر</p>
                        <p className="font-medium">{selectedApplication.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الولاية</p>
                        <p className="font-medium">{selectedApplication.wilaya}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">المستوى التعليمي</p>
                        <p className="font-medium">{selectedApplication.education}</p>
                      </div>
                    </div>
                  </div>

                  {/* Course Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3">معلومات الدورة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">الدورة المطلوبة</p>
                        <p className="font-medium">{selectedApplication.course}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">نوع التسجيل</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            selectedApplication.registrationType === 'Basic'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedApplication.registrationType === 'Basic' ? 'أولي' : 'كامل'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">حالة الطلب</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            !selectedApplication.status || selectedApplication.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : selectedApplication.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {!selectedApplication.status || selectedApplication.status === 'pending' 
                              ? 'قيد المراجعة' 
                              : selectedApplication.status === 'approved' 
                                ? 'مقبول' 
                                : 'مرفوض'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">تاريخ التسجيل</p>
                        <p className="font-medium">
                          {format(selectedApplication.submissionDate, 'yyyy/MM/dd HH:mm', { locale: arSA })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {(selectedApplication.experience || selectedApplication.comments) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-3">معلومات إضافية</h3>
                      <div className="space-y-4">
                        {selectedApplication.experience && (
                          <div>
                            <p className="text-sm text-gray-500">الخبرة السابقة</p>
                            <p className="font-medium">{selectedApplication.experience}</p>
                          </div>
                        )}
                        {selectedApplication.comments && (
                          <div>
                            <p className="text-sm text-gray-500">ملاحظات إضافية</p>
                            <p className="font-medium">{selectedApplication.comments}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Full Registration Documents */}
                  {selectedApplication.registrationType === 'Full' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-3">مستندات التسجيل الكامل</h3>
                      <div className="space-y-6">
                        {/* Payment Information */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">معلومات الدفع</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">طريقة الدفع</p>
                              <p className="font-medium">{selectedApplication.paymentMethod || 'غير محدد'}</p>
                            </div>
                            {selectedApplication.paymentProofUrl && (
                              <div>
                                <p className="text-sm text-gray-500 mb-2">إثبات الدفع</p>
                                <a 
                                  href={selectedApplication.paymentProofUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block"
                                >
                                  <img 
                                    src={selectedApplication.paymentProofUrl} 
                                    alt="إثبات الدفع"
                                    className="h-24 object-contain border border-gray-200 rounded-lg"
                                  />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ID Documents */}
                        {(selectedApplication.idFrontUrl || selectedApplication.idBackUrl) && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">صور بطاقة الهوية</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedApplication.idFrontUrl && (
                                <div>
                                  <p className="text-sm text-gray-500 mb-2">الوجه الأمامي</p>
                                  <a 
                                    href={selectedApplication.idFrontUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block"
                                  >
                                    <img 
                                      src={selectedApplication.idFrontUrl} 
                                      alt="بطاقة الهوية - الوجه الأمامي"
                                      className="h-24 object-contain border border-gray-200 rounded-lg"
                                    />
                                  </a>
                                </div>
                              )}
                              {selectedApplication.idBackUrl && (
                                <div>
                                  <p className="text-sm text-gray-500 mb-2">الوجه الخلفي</p>
                                  <a 
                                    href={selectedApplication.idBackUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block"
                                  >
                                    <img 
                                      src={selectedApplication.idBackUrl} 
                                      alt="بطاقة الهوية - الوجه الخلفي"
                                      className="h-24 object-contain border border-gray-200 rounded-lg"
                                    />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Signature */}
                        {selectedApplication.signature && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">التوقيع</h4>
                            <a 
                              href={selectedApplication.signature} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <img 
                                src={selectedApplication.signature} 
                                alt="توقيع المتقدم"
                                className="h-24 object-contain border border-gray-200 rounded-lg bg-white"
                              />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                        selectedApplication.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      disabled={selectedApplication.status === 'approved'}
                    >
                      <CheckCircle size={18} />
                      {selectedApplication.status === 'approved' ? 'تم القبول' : 'قبول الطلب'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                        selectedApplication.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                      disabled={selectedApplication.status === 'rejected'}
                    >
                      <XCircle size={18} />
                      {selectedApplication.status === 'rejected' ? 'تم الرفض' : 'رفض الطلب'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleDelete(selectedApplication.id)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      حذف الطلب
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AdminDashboard;