import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';

interface Application {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  course: string;
  registrationType: 'Basic' | 'Full';
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: any;
  age: number;
  wilaya: string;
  education: string;
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
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

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = applications;
    
    if (filter !== 'all') {
      result = result.filter(app => app.status === filter);
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
  }, [applications, filter, searchTerm]);

  const approveApplication = async (id: string) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status: 'approved' });
      Alert.alert('نجح', 'تم قبول الطلب بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء قبول الطلب');
    }
  };

  const rejectApplication = async (id: string) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status: 'rejected' });
      Alert.alert('نجح', 'تم رفض الطلب');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء رفض الطلب');
    }
  };

  const deleteApplication = async (id: string) => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذا الطلب؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'applications', id));
            Alert.alert('نجح', 'تم حذف الطلب بنجاح');
          } catch (error) {
            Alert.alert('خطأ', 'حدث خطأ أثناء حذف الطلب');
          }
        }
      }
    ]);
  };

  const renderApplicationItem = ({ item }: { item: Application }) => (
    <View style={styles.applicationCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.applicantName}>{item.fullName}</Text>
          <View style={[styles.statusBadge, 
            item.status === 'approved' ? styles.approvedBadge :
            item.status === 'rejected' ? styles.rejectedBadge : styles.pendingBadge
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'pending' ? 'قيد المراجعة' : 
               item.status === 'approved' ? 'مقبول' : 'مرفوض'}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.courseText}>{item.course}</Text>
          <Text style={styles.typeText}>
            {item.registrationType === 'Basic' ? 'تسجيل أولي' : 'تسجيل كامل'}
          </Text>
          <Text style={styles.phoneText}>{item.phone}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => setSelectedApplication(item)}
          >
            <Ionicons name="eye" size={16} color="#22b0fc" />
            <Text style={styles.viewButtonText}>عرض</Text>
          </TouchableOpacity>
          
          {item.status !== 'approved' && (
            <TouchableOpacity 
              style={styles.approveButton}
              onPress={() => approveApplication(item.id)}
            >
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.approveButtonText}>قبول</Text>
            </TouchableOpacity>
          )}
          
          {item.status !== 'rejected' && (
            <TouchableOpacity 
              style={styles.rejectButton}
              onPress={() => rejectApplication(item.id)}
            >
              <Ionicons name="close-circle" size={16} color="#ef4444" />
              <Text style={styles.rejectButtonText}>رفض</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteApplication(item.id)}
          >
            <Ionicons name="trash" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري تحميل الطلبات...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>طلبات التسجيل</Text>
      
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث بالاسم أو الهاتف..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {[
          { key: 'all', label: 'الكل' },
          { key: 'pending', label: 'قيد المراجعة' },
          { key: 'approved', label: 'مقبولة' },
          { key: 'rejected', label: 'مرفوضة' },
        ].map((filterOption) => (
          <TouchableOpacity
            key={filterOption.key}
            style={[styles.filterButton, filter === filterOption.key && styles.activeFilter]}
            onPress={() => setFilter(filterOption.key as any)}
          >
            <Text style={[styles.filterText, filter === filterOption.key && styles.activeFilterText]}>
              {filterOption.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicationItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد طلبات</Text>
          </View>
        }
      />

      {/* Application Details Modal */}
      {selectedApplication && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>تفاصيل الطلب</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الاسم:</Text>
                <Text style={styles.detailValue}>{selectedApplication.fullName}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>العمر:</Text>
                <Text style={styles.detailValue}>{selectedApplication.age}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الهاتف:</Text>
                <Text style={styles.detailValue}>{selectedApplication.phone}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>البريد الإلكتروني:</Text>
                <Text style={styles.detailValue}>{selectedApplication.email || 'غير متوفر'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الدورة:</Text>
                <Text style={styles.detailValue}>{selectedApplication.course}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الولاية:</Text>
                <Text style={styles.detailValue}>{selectedApplication.wilaya}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>المستوى التعليمي:</Text>
                <Text style={styles.detailValue}>{selectedApplication.education}</Text>
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedApplication(null)}
            >
              <Text style={styles.closeButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeFilter: {
    backgroundColor: '#22b0fc',
    borderColor: '#22b0fc',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  applicationCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  approvedBadge: {
    backgroundColor: '#d1fae5',
  },
  rejectedBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardContent: {
    marginBottom: 16,
  },
  courseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  typeText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  viewButtonText: {
    color: '#22b0fc',
    fontSize: 12,
    fontWeight: '600',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  approveButtonText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  rejectButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#22b0fc',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});