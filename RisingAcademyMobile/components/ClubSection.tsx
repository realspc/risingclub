import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { Club, ClubApplication } from '../types';
import { LANGUAGE_LEVELS } from '../constants/data';

interface ClubSectionProps {
  onBack: () => void;
}

const ClubSection = ({ onBack }: ClubSectionProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

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
    });

    return () => unsubscribe();
  }, []);

  const handleClubJoin = (club: Club) => {
    setSelectedClub(club);
    setShowApplicationForm(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>جاري تحميل النوادي...</Text>
      </View>
    );
  }

  if (showApplicationForm && selectedClub) {
    return (
      <ClubApplicationForm
        club={selectedClub}
        onBack={() => {
          setShowApplicationForm(false);
          setSelectedClub(null);
        }}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#ffffff" />
        <Text style={styles.backButtonText}>العودة للخلف</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            style={styles.iconGradient}
          >
            <Ionicons name="people" size={40} color="#ffffff" />
          </LinearGradient>
        </View>
        <Text style={styles.title}>النوادي المتاحة</Text>
        <Text style={styles.subtitle}>انضم إلى نوادينا المتخصصة وطور مهاراتك مع المجتمع</Text>
      </View>

      {/* Clubs List */}
      {clubs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
            style={styles.emptyCard}
          >
            <Ionicons name="people-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>لا توجد نوادي متاحة حالياً</Text>
            <Text style={styles.emptySubtitle}>تابعونا للحصول على آخر التحديثات حول النوادي الجديدة</Text>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.clubsContainer}>
          {clubs.map((club, index) => (
            <View key={club.id} style={styles.clubCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
                style={styles.cardGradient}
              >
                <Image
                  source={{ uri: club.imageUrl }}
                  style={styles.clubImage}
                  defaultSource={require('../assets/placeholder.png')}
                />
                
                <View style={styles.cardContent}>
                  <Text style={styles.clubTitle}>{club.arabicName}</Text>
                  <Text style={styles.clubDescription} numberOfLines={2}>
                    {club.description}
                  </Text>

                  <View style={styles.clubDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="people-outline" size={16} color="#8b5cf6" />
                      <Text style={styles.detailText}>
                        {club.departments.length} أقسام متاحة
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={16} color="#8b5cf6" />
                      <Text style={styles.detailText}>أكاديمية رايزين</Text>
                    </View>
                  </View>

                  {/* Departments Preview */}
                  <View style={styles.departmentsPreview}>
                    <Text style={styles.departmentsTitle}>الأقسام المتاحة:</Text>
                    <View style={styles.departmentTags}>
                      {club.departments.slice(0, 3).map((dept) => (
                        <View key={dept.id} style={styles.departmentTag}>
                          <Text style={styles.departmentTagText}>{dept.arabicName}</Text>
                        </View>
                      ))}
                      {club.departments.length > 3 && (
                        <View style={styles.departmentTag}>
                          <Text style={styles.departmentTagText}>+{club.departments.length - 3} المزيد</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => handleClubJoin(club)}
                  >
                    <LinearGradient
                      colors={['#8b5cf6', '#7c3aed']}
                      style={styles.joinButtonGradient}
                    >
                      <Text style={styles.joinButtonText}>انضم للنادي</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Club Application Form Component
const ClubApplicationForm = ({ club, onBack }: { club: Club; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    placeOfBirth: '',
    skills: '',
    address: '',
    languageLevel: '',
    departmentId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.age || !formData.phone || !formData.dateOfBirth || 
        !formData.placeOfBirth || !formData.address || !formData.languageLevel || !formData.departmentId) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDepartment = club.departments.find(dept => dept.id === formData.departmentId);
      
      if (!selectedDepartment) {
        throw new Error('Department not found');
      }

      const applicationData: Omit<ClubApplication, 'id'> = {
        clubId: club.id!,
        clubName: club.arabicName,
        departmentId: formData.departmentId,
        departmentName: selectedDepartment.arabicName,
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        skills: formData.skills,
        address: formData.address,
        languageLevel: formData.languageLevel,
        signature: '', // Mobile signature would need special handling
        agreedToContract: true,
        applicationDate: new Date(),
        status: 'pending'
      };

      await addDoc(collection(db, 'clubApplications'), applicationData);

      Alert.alert(
        'تم التقديم بنجاح!',
        'تم تقديم طلب انضمامك للنادي بنجاح. سنتواصل معك قريباً.',
        [{ text: 'موافق', onPress: onBack }]
      );
    } catch (error) {
      console.error('Error submitting club application:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التقديم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#ffffff" />
        <Text style={styles.backButtonText}>العودة</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>الانضمام للنادي</Text>
        
        {/* Club Info */}
        <View style={styles.clubInfo}>
          <Image source={{ uri: club.imageUrl }} style={styles.clubInfoImage} />
          <View style={styles.clubInfoContent}>
            <Text style={styles.clubInfoTitle}>{club.arabicName}</Text>
            <Text style={styles.clubInfoDescription} numberOfLines={2}>
              {club.description}
            </Text>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formFields}>
          {/* Department Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>اختر القسم *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.departmentId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}
                style={styles.picker}
              >
                <Picker.Item label="اختر القسم" value="" />
                {club.departments.map((dept) => (
                  <Picker.Item 
                    key={dept.id} 
                    label={`${dept.arabicName} - ${dept.description}`} 
                    value={dept.id} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>الاسم الكامل *</Text>
            <TextInput
              style={styles.input}
              placeholder="أدخل اسمك الكامل"
              value={formData.fullName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>العمر *</Text>
              <TextInput
                style={styles.input}
                placeholder="العمر"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>رقم الهاتف *</Text>
              <TextInput
                style={styles.input}
                placeholder="0555 123 456"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>البريد الإلكتروني (اختياري)</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>تاريخ الميلاد *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dateOfBirth: text }))}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>مكان الميلاد *</Text>
              <TextInput
                style={styles.input}
                placeholder="مكان الميلاد"
                value={formData.placeOfBirth}
                onChangeText={(text) => setFormData(prev => ({ ...prev, placeOfBirth: text }))}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>العنوان *</Text>
            <TextInput
              style={styles.input}
              placeholder="العنوان الكامل"
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>مستوى اللغة *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.languageLevel}
                onValueChange={(value) => setFormData(prev => ({ ...prev, languageLevel: value }))}
                style={styles.picker}
              >
                <Picker.Item label="اختر مستوى اللغة" value="" />
                {LANGUAGE_LEVELS.map((level) => (
                  <Picker.Item 
                    key={level.id} 
                    label={`${level.name} - ${level.description}`} 
                    value={level.name} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>المهارات (اختياري)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="اذكر مهاراتك وخبراتك..."
              multiline
              numberOfLines={4}
              value={formData.skills}
              onChangeText={(text) => setFormData(prev => ({ ...prev, skills: text }))}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={isSubmitting ? ['#9ca3af', '#6b7280'] : ['#8b5cf6', '#7c3aed']}
            style={styles.submitButtonGradient}
          >
            {isSubmitting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.submitButtonText}>جاري التقديم...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>تقديم الطلب</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    borderRadius: 24,
    padding: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  clubsContainer: {
    gap: 16,
  },
  clubCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    padding: 0,
  },
  clubImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 20,
  },
  clubTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  clubDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  clubDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  departmentsPreview: {
    marginBottom: 20,
  },
  departmentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  departmentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  departmentTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  departmentTagText: {
    fontSize: 12,
    color: '#5b21b6',
    fontWeight: '500',
  },
  joinButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  clubInfo: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  clubInfoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  clubInfoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  clubInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  clubInfoDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  formFields: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default ClubSection;