import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';

interface InternApplication {
  id: string;
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  academicSpecialization: string;
  skills: string;
  applicationDate: any;
  status: 'pending' | 'approved' | 'rejected';
}

export default function InternApplications() {
  const [applications, setApplications] = useState<InternApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<InternApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<InternApplication | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'internApplications'), orderBy('applicationDate', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apps: InternApplication[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({
          id: doc.id,
          ...data,
          applicationDate: data.applicationDate?.toDate()
        } as InternApplication);
      });
      setApplications(apps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = applications;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.fullName?.toLowerCase().includes(term) ||
        app.phone?.includes(term) ||
        app.email?.toLowerCase().includes(term)
      );
    }
    
    setFilteredApplications(result);
  }, [applications, searchTerm]);

  const handleStatusChange = async (appId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'internApplications', appId), { status: newStatus });
      Alert.alert('نجح', 'تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تحديث الحالة');
    }
  };

  const handleDelete = async (appId: string) => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذا الطلب؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'internApplications', appId));
            Alert.alert('نجح', 'تم حذف الطلب بنجاح');
          } catch (error) {
            Alert.alert('خطأ', 'حدث خطأ أثناء حذف الطلب');
          }
        }
      }
    ]);
  };

  const openModal = (application: InternApplication) => {
    setSelectedApplication(application);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedApplication(null);
    setModalVisible(false);
  };

  const renderApplicationItem = ({ item }: { item: InternApplication }) => (
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
          <Text style={styles.specializationText}>{item.academicSpecialization}</Text>
          <Text style={styles.ageText}>العمر: {item.age}</Text>
          <Text style={styles.phoneText}>{item.phone}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => openModal(item)}
          >
            <Ionicons name="eye" size={16} color="#6366f1" />
            <Text style={styles.viewButtonText}>عرض</Text>
          </TouchableOpacity>
          
          {item.status !== 'approved' && (
            <TouchableOpacity 
              style={styles.approveButton}
              onPress={() => handleStatusChange(item.id, 'approved')}
            >
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.approveButtonText}>قبول</Text>
            </TouchableOpacity>
          )}
          
          {item.status !== 'rejected' && (
            <TouchableOpacity 
              style={styles.rejectButton}
              onPress={() => handleStatusChange(item.id, 'rejected')}
            >
              <Ionicons name="close-circle" size={16} color="#ef4444" />
              <Text style={styles.rejectButtonText}>رفض</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
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
        <Text style={styles.loadingText}>جاري تحميل طلبات التدريب...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>طلبات التدريب</Text>
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث بالاسم أو الهاتف..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicationItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد طلبات تدريب</Text>
          </View>
        }
      />

      {/* Application Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>تفاصيل طلب التدريب</Text>
              
              {selectedApplication && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>الاسم:</Text>
                    <Text style={styles.detailValue}>{selectedApplication.fullName}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>العمر:</Text>
                    <Text style={styles.detailValue}>{selectedApplication.age} سنة</Text>
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
                    <Text style={styles.detailLabel}>تاريخ الميلاد:</Text>
                    <Text style={styles.detailValue}>{selectedApplication.dateOfBirth}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>مكان الميلاد:</Text>
                    <Text style={styles.detailValue}>{selectedApplication.placeOfBirth}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>العنوان:</Text>
                    <Text style={styles.detailValue}>{selectedApplication.address}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>التخصص الدراسي:</Text>
                    <Text style={styles.detailValue}>{selectedApplication.academicSpecialization}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>المهارات:</Text>
                    <Text style={styles.detailValue}>{selectedApplication.skills}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>الحالة:</Text>
                    <Text style={[styles.detailValue, 
                      selectedApplication.status === 'approved' ? styles.approvedText :
                      selectedApplication.status === 'rejected' ? styles.rejectedText : styles.pendingText
                    ]}>
                      {selectedApplication.status === 'pending' ? 'قيد المراجعة' : 
                       selectedApplication.status === 'approved' ? 'مقبول' : 'مرفوض'}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  specializationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  ageText: {
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
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  viewButtonText: {
    color: '#6366f1',
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
    flex: 1,
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
    width: '90%',
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
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 100,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    textAlign: 'left',
  },
  approvedText: {
    color: '#10b981',
    fontWeight: '600',
  },
  rejectedText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  pendingText: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#6366f1',
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