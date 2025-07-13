import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  BackHandler
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase.config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import AdminApplications from './AdminApplications';
import InternApplications from './InternApplications';

const { width } = Dimensions.get('window');

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    applications: 0,
    workshops: 0,
    clubs: 0,
    jobs: 0,
    interns: 0
  });

  useEffect(() => {
    // Load statistics
    const unsubscribes: (() => void)[] = [];

    // Applications
    const applicationsQuery = query(collection(db, 'applications'), orderBy('submissionDate', 'desc'));
    unsubscribes.push(onSnapshot(applicationsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, applications: snapshot.size }));
    }));

    // Workshop registrations
    const workshopsQuery = query(collection(db, 'workshopRegistrations'));
    unsubscribes.push(onSnapshot(workshopsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, workshops: snapshot.size }));
    }));

    // Club applications
    const clubsQuery = query(collection(db, 'clubApplications'));
    unsubscribes.push(onSnapshot(clubsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, clubs: snapshot.size }));
    }));

    // Job applications
    const jobsQuery = query(collection(db, 'jobApplications'));
    unsubscribes.push(onSnapshot(jobsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, jobs: snapshot.size }));
    }));

    // Intern applications
    const internsQuery = query(collection(db, 'internApplications'));
    unsubscribes.push(onSnapshot(internsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, interns: snapshot.size }));
    }));

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
        return true;
      }
      onBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [activeTab, onBack]);

  const handleLogout = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              onBack();
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }
        }
      ]
    );
  };

  const renderDashboard = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <LinearGradient
        colors={['rgba(34, 176, 252, 0.1)', 'rgba(34, 176, 252, 0.05)']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>لوحة التحكم الإدارية</Text>
            <Text style={styles.headerSubtitle}>إدارة جميع طلبات التسجيل والخدمات</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutButtonText}>خروج</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'applications' && styles.activeTab]}
              onPress={() => setActiveTab('applications')}
            >
              <Ionicons name="document-text" size={20} color={activeTab === 'applications' ? '#ffffff' : '#6b7280'} />
              <Text style={[styles.tabText, activeTab === 'applications' && styles.activeTabText]}>
                طلبات الدورات
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'interns' && styles.activeTab]}
              onPress={() => setActiveTab('interns')}
            >
              <Ionicons name="person-add-outline" size={20} color={activeTab === 'interns' ? '#ffffff' : '#6b7280'} />
              <Text style={[styles.tabText, activeTab === 'interns' && styles.activeTabText]}>
                طلبات التدريب
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <Text style={styles.sectionTitle}>إحصائيات سريعة</Text>
        <View style={styles.statsGrid}>
          {[
            { title: 'طلبات الدورات', value: stats.applications, icon: 'school-outline', color: '#22b0fc' },
            { title: 'تسجيلات الورش', value: stats.workshops, icon: 'calendar-outline', color: '#f59e0b' },
            { title: 'طلبات النوادي', value: stats.clubs, icon: 'people-outline', color: '#8b5cf6' },
            { title: 'طلبات التوظيف', value: stats.jobs, icon: 'briefcase-outline', color: '#10b981' },
            { title: 'طلبات التدريب', value: stats.interns, icon: 'person-add-outline', color: '#6366f1' },
          ].map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statCardContent}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Info Message */}
      <View style={styles.infoMessage}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={32} color="#22b0fc" />
          <Text style={styles.infoTitle}>لوحة التحكم المحمولة</Text>
          <Text style={styles.infoText}>
            يمكنك الآن إدارة طلبات التسجيل مباشرة من هاتفك المحمول. اضغط على "طلبات الدورات" أعلاه للبدء.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.mainContainer}>
      {activeTab === 'dashboard' ? renderDashboard() : null}
      {activeTab === 'applications' ? <AdminApplications /> : null}
      {activeTab === 'interns' ? <InternApplications /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#22b0fc',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  quickStats: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardContent: {
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoMessage: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AdminDashboard;