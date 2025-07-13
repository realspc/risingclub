import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../0-firebase/config';
import { Application, WorkshopRegistration, ClubApplication, JobApplication, InternApplication } from '../types';
import format from 'date-fns/format';
import arSA from 'date-fns/locale/ar-SA';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  eachMonthOfInterval,
  getMonth,
  getYear
} from 'date-fns';

const StatisticsPanel = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [workshopRegistrations, setWorkshopRegistrations] = useState<WorkshopRegistration[]>([]);
  const [clubApplications, setClubApplications] = useState<ClubApplication[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [internApplications, setInternApplications] = useState<InternApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'month' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // Applications
    const applicationsQuery = query(collection(db, 'applications'));
    unsubscribes.push(onSnapshot(applicationsQuery, (snapshot) => {
      const apps: Application[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          submissionDate: data.submissionDate?.toDate() 
        } as Application);
      });
      setApplications(apps);
    }));

    // Workshop Registrations
    const workshopQuery = query(collection(db, 'workshopRegistrations'));
    unsubscribes.push(onSnapshot(workshopQuery, (snapshot) => {
      const regs: WorkshopRegistration[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        regs.push({ 
          id: doc.id, 
          ...data,
          registrationDate: data.registrationDate?.toDate() 
        } as WorkshopRegistration);
      });
      setWorkshopRegistrations(regs);
    }));

    // Club Applications
    const clubQuery = query(collection(db, 'clubApplications'));
    unsubscribes.push(onSnapshot(clubQuery, (snapshot) => {
      const apps: ClubApplication[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          applicationDate: data.applicationDate?.toDate() 
        } as ClubApplication);
      });
      setClubApplications(apps);
    }));

    // Job Applications
    const jobQuery = query(collection(db, 'jobApplications'));
    unsubscribes.push(onSnapshot(jobQuery, (snapshot) => {
      const apps: JobApplication[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          applicationDate: data.applicationDate?.toDate() 
        } as JobApplication);
      });
      setJobApplications(apps);
    }));

    // Intern Applications
    const internQuery = query(collection(db, 'internApplications'));
    unsubscribes.push(onSnapshot(internQuery, (snapshot) => {
      const apps: InternApplication[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          applicationDate: data.applicationDate?.toDate() 
        } as InternApplication);
      });
      setInternApplications(apps);
      setLoading(false);
    }));

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const getFilteredData = () => {
    const startDate = filterType === 'month' 
      ? startOfMonth(selectedDate) 
      : startOfYear(selectedDate);
    const endDate = filterType === 'month' 
      ? endOfMonth(selectedDate) 
      : endOfYear(selectedDate);

    return {
      applications: applications.filter(app => 
        app.submissionDate >= startDate && app.submissionDate <= endDate
      ),
      workshops: workshopRegistrations.filter(reg => 
        reg.registrationDate >= startDate && reg.registrationDate <= endDate
      ),
      clubs: clubApplications.filter(app => 
        app.applicationDate >= startDate && app.applicationDate <= endDate
      ),
      jobs: jobApplications.filter(app => 
        app.applicationDate >= startDate && app.applicationDate <= endDate
      ),
      interns: internApplications.filter(app => 
        app.applicationDate >= startDate && app.applicationDate <= endDate
      )
    };
  };

  const getChartData = () => {
    const filtered = getFilteredData();
    
    if (filterType === 'month') {
      // Daily data for the month
      const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
      const dailyData = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        const dayStart = new Date(dayDate);
        const dayEnd = new Date(dayDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        dailyData.push({
          label: day.toString(),
          applications: filtered.applications.filter(app => 
            app.submissionDate >= dayStart && app.submissionDate <= dayEnd
          ).length,
          workshops: filtered.workshops.filter(reg => 
            reg.registrationDate >= dayStart && reg.registrationDate <= dayEnd
          ).length,
          clubs: filtered.clubs.filter(app => 
            app.applicationDate >= dayStart && app.applicationDate <= dayEnd
          ).length,
          jobs: filtered.jobs.filter(app => 
            app.applicationDate >= dayStart && app.applicationDate <= dayEnd
          ).length,
          interns: filtered.interns.filter(app => 
            app.applicationDate >= dayStart && app.applicationDate <= dayEnd
          ).length
        });
      }
      
      return dailyData;
    } else {
      // Monthly data for the year
      const monthsInYear = eachMonthOfInterval({
        start: startOfYear(selectedDate),
        end: endOfYear(selectedDate)
      });
      
      return monthsInYear.map(month => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        
        return {
          label: format(month, 'MMM', { locale: arSA }),
          applications: applications.filter(app => 
            app.submissionDate >= monthStart && app.submissionDate <= monthEnd
          ).length,
          workshops: workshopRegistrations.filter(reg => 
            reg.registrationDate >= monthStart && reg.registrationDate <= monthEnd
          ).length,
          clubs: clubApplications.filter(app => 
            app.applicationDate >= monthStart && app.applicationDate <= monthEnd
          ).length,
          jobs: jobApplications.filter(app => 
            app.applicationDate >= monthStart && app.applicationDate <= monthEnd
          ).length,
          interns: internApplications.filter(app => 
            app.applicationDate >= monthStart && app.applicationDate <= monthEnd
          ).length
        };
      });
    }
  };

  const chartData = getChartData();
  const filtered = getFilteredData();
  const maxValue = Math.max(...chartData.map(d => 
    d.applications + d.workshops + d.clubs + d.jobs + d.interns
  ));

  const exportStatistics = () => {
    const headers = ['التاريخ', 'طلبات الدورات', 'تسجيلات الورش', 'طلبات النوادي', 'طلبات التوظيف', 'طلبات التدريب', 'الإجمالي'].join(',');
    
    const rows = chartData.map(data => [
      `"${data.label}"`,
      data.applications,
      data.workshops,
      data.clubs,
      data.jobs,
      data.interns,
      data.applications + data.workshops + data.clubs + data.jobs + data.interns
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `إحصائيات_${filterType === 'month' ? 'شهرية' : 'سنوية'}_${format(selectedDate, 'yyyy-MM')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22b0fc] mx-auto mb-4"></div>
          <p className="text-lg">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">الإحصائيات والتقارير</h2>
          <p className="text-gray-600 mt-1">تحليل شامل لجميع البيانات والطلبات</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={exportStatistics}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"
        >
          <Download size={18} />
          تصدير الإحصائيات
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilterType('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'month'
                  ? 'bg-[#22b0fc] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              شهري
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilterType('year')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'year'
                  ? 'bg-[#22b0fc] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              سنوي
            </motion.button>
          </div>
          
          <input
            type={filterType === 'month' ? 'month' : 'number'}
            value={filterType === 'month' 
              ? format(selectedDate, 'yyyy-MM') 
              : selectedDate.getFullYear()
            }
            onChange={(e) => {
              if (filterType === 'month') {
                setSelectedDate(new Date(e.target.value + '-01'));
              } else {
                setSelectedDate(new Date(parseInt(e.target.value), 0, 1));
              }
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22b0fc] focus:border-[#22b0fc] outline-none"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { 
            title: 'طلبات الدورات', 
            value: filtered.applications.length, 
            icon: Users, 
            color: 'bg-[#22b0fc]' 
          },
          { 
            title: 'تسجيلات الورش', 
            value: filtered.workshops.length, 
            icon: Calendar, 
            color: 'bg-yellow-500' 
          },
          { 
            title: 'طلبات النوادي', 
            value: filtered.clubs.length, 
            icon: Users, 
            color: 'bg-purple-500' 
          },
          { 
            title: 'طلبات التوظيف', 
            value: filtered.jobs.length, 
            icon: Users, 
            color: 'bg-green-500' 
          },
          { 
            title: 'طلبات التدريب', 
            value: filtered.interns.length, 
            icon: Users, 
            color: 'bg-indigo-500' 
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

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            المنحنى البياني - {filterType === 'month' ? 'يومي' : 'شهري'}
          </h3>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#22b0fc]" />
            <span className="text-sm text-gray-600">
              {format(selectedDate, filterType === 'month' ? 'MMMM yyyy' : 'yyyy', { locale: arSA })}
            </span>
          </div>
        </div>

        <div className="relative h-80 overflow-x-auto">
          <div className="flex items-end justify-between h-full min-w-full" style={{ minWidth: `${chartData.length * 60}px` }}>
            {chartData.map((data, index) => {
              const total = data.applications + data.workshops + data.clubs + data.jobs + data.interns;
              const height = maxValue > 0 ? (total / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center group relative">
                  <div className="flex flex-col items-center mb-2 space-y-1">
                    {/* Stacked bars */}
                    <div className="flex flex-col-reverse items-center">
                      {data.applications > 0 && (
                        <div 
                          className="w-8 bg-[#22b0fc] rounded-t-sm transition-all duration-300 group-hover:w-10"
                          style={{ height: `${(data.applications / maxValue) * 240}px` }}
                        />
                      )}
                      {data.workshops > 0 && (
                        <div 
                          className="w-8 bg-yellow-500 transition-all duration-300 group-hover:w-10"
                          style={{ height: `${(data.workshops / maxValue) * 240}px` }}
                        />
                      )}
                      {data.clubs > 0 && (
                        <div 
                          className="w-8 bg-purple-500 transition-all duration-300 group-hover:w-10"
                          style={{ height: `${(data.clubs / maxValue) * 240}px` }}
                        />
                      )}
                      {data.jobs > 0 && (
                        <div 
                          className="w-8 bg-green-500 transition-all duration-300 group-hover:w-10"
                          style={{ height: `${(data.jobs / maxValue) * 240}px` }}
                        />
                      )}
                      {data.interns > 0 && (
                        <div 
                          className="w-8 bg-indigo-500 rounded-b-sm transition-all duration-300 group-hover:w-10"
                          style={{ height: `${(data.interns / maxValue) * 240}px` }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <span className="text-xs text-gray-600 font-medium">{data.label}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    <div>الإجمالي: {total}</div>
                    <div>دورات: {data.applications}</div>
                    <div>ورش: {data.workshops}</div>
                    <div>نوادي: {data.clubs}</div>
                    <div>وظائف: {data.jobs}</div>
                    <div>تدريب: {data.interns}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t">
          {[
            { label: 'طلبات الدورات', color: 'bg-[#22b0fc]' },
            { label: 'تسجيلات الورش', color: 'bg-yellow-500' },
            { label: 'طلبات النوادي', color: 'bg-purple-500' },
            { label: 'طلبات التوظيف', color: 'bg-green-500' },
            { label: 'طلبات التدريب', color: 'bg-indigo-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;