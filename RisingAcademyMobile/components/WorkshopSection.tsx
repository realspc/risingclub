import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  increment
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { Workshop, WorkshopRegistration } from '../types';
import { LANGUAGE_LEVELS } from '../constants/data';

interface WorkshopSectionProps {
  onBack: () => void;
}

const WorkshopSection = ({ onBack }: WorkshopSectionProps) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'workshops'), 
      where('isActive', '==', true)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workshopsData: Workshop[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const workshopDate = data.date?.toDate();
        
        if (workshopDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (workshopDate >= today) {
            workshopsData.push({ 
              id: doc.id, 
              ...data,
              date: workshopDate,
              createdAt: data.createdAt?.toDate()
            } as Workshop);
          }
        }
      });
      
      workshopsData.sort((a, b) => a.date.getTime() - b.date.getTime());
      setWorkshops(workshopsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleWorkshopRegister = (workshop: Workshop) => {
    if (workshop.currentParticipants >= workshop.maxParticipants) {
      Alert.alert('عذراً', 'الورشة مكتملة العدد');
      return;
    }
    setSelectedWorkshop(workshop);
    setShowRegistrationForm(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>جاري تحميل الورش...</Text>
      </View>
    );
  }

  if (showRegistrationForm && selectedWorkshop) {
    return (
      <WorkshopRegistrationForm
        workshop={selectedWorkshop}
        onBack={() => {
          setShowRegistrationForm(false);
          setSelectedWorkshop(null);
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
            colors={['#f59e0b', '#d97706']}
            style={styles.iconGradient}
          >
            <Ionicons name="calendar" size={40} color="#ffffff" />
          </LinearGradient>
        </View>
        <Text style={styles.title}>الورش المجانية القادمة</Text>
        <Text style={styles.subtitle}>انضم إلى ورشنا المجانية واكتسب مهارات جديدة</Text>
      </View>

      {/* Workshops List */}
      {workshops.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
            style={styles.emptyCard}
          >
            <Ionicons name="calendar-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>لا توجد ورش متاحة حالياً</Text>
            <Text style={styles.emptySubtitle}>تابعونا للحصول على آخر التحديثات حول الورش القادمة</Text>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.workshopsContainer}>
          {workshops.map((workshop, index) => (
            <View key={workshop.id} style={styles.workshopCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
                style={styles.cardGradient}
              >
                <Image
                  source={{ uri: workshop.imageUrl }}
                  style={styles.workshopImage}
               //   defaultSource={require('../assets/placeholder.png')}
                />
                
                <View style={styles.cardContent}>
                  <Text style={styles.workshopTitle}>{workshop.arabicName}</Text>
                  <Text style={styles.workshopDescription} numberOfLines={2}>
                    {workshop.description}
                  </Text>

                  <View style={styles.workshopDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#f59e0b" />
                      <Text style={styles.detailText}>
                        {workshop.date.toLocaleDateString('ar-SA')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color="#f59e0b" />
                      <Text style={styles.detailText}>{workshop.duration}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="people-outline" size={16} color="#f59e0b" />
                      <Text style={styles.detailText}>
                        {workshop.maxParticipants - workshop.currentParticipants} مقعد متبقي
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={16} color="#f59e0b" />
                      <Text style={styles.detailText}>أكاديمية رايزين</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.registerButton,
                      workshop.currentParticipants >= workshop.maxParticipants && styles.disabledButton
                    ]}
                    onPress={() => handleWorkshopRegister(workshop)}
                    disabled={workshop.currentParticipants >= workshop.maxParticipants}
                  >
                    <LinearGradient
                      colors={
                        workshop.currentParticipants >= workshop.maxParticipants
                          ? ['#9ca3af', '#6b7280']
                          : ['#f59e0b', '#d97706']
                      }
                      style={styles.registerButtonGradient}
                    >
                      <Text style={styles.registerButtonText}>
                        {workshop.currentParticipants >= workshop.maxParticipants 
                          ? 'الورشة مكتملة' 
                          : 'سجل الآن مجاناً'
                        }
                      </Text>
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

// Workshop Registration Form Component
const WorkshopRegistrationForm = ({ workshop, onBack }: { workshop: Workshop; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    languageLevel: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.age || !formData.phone || !formData.languageLevel) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData: Omit<WorkshopRegistration, 'id'> = {
        workshopId: workshop.id!,
        workshopName: workshop.arabicName,
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email,
        languageLevel: formData.languageLevel,
        registrationDate: new Date(),
        status: 'registered'
      };

      await addDoc(collection(db, 'workshopRegistrations'), registrationData);
      await updateDoc(doc(db, 'workshops', workshop.id!), {
        currentParticipants: increment(1)
      });

      Alert.alert(
        'تم التسجيل بنجاح!',
        'تم تسجيلك في الورشة بنجاح. سنتواصل معك قريباً بتفاصيل أكثر.',
        [{ text: 'موافق', onPress: onBack }]
      );
    } catch (error) {
      console.error('Error registering for workshop:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
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
        <Text style={styles.formTitle}>التسجيل في الورشة</Text>
        
        {/* Workshop Info */}
        <View style={styles.workshopInfo}>
          <Image source={{ uri: workshop.imageUrl }} style={styles.workshopInfoImage} />
          <View style={styles.workshopInfoContent}>
            <Text style={styles.workshopInfoTitle}>{workshop.arabicName}</Text>
            <Text style={styles.workshopInfoDate}>
              {workshop.date.toLocaleDateString('ar-SA')} - {workshop.duration}
            </Text>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formFields}>
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
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={isSubmitting ? ['#9ca3af', '#6b7280'] : ['#22b0fc', '#1e40af']}
            style={styles.submitButtonGradient}
          >
            {isSubmitting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.submitButtonText}>جاري التسجيل...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>تأكيد التسجيل</Text>
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
    shadowColor: '#f59e0b',
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
  workshopsContainer: {
    gap: 16,
  },
  workshopCard: {
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
  workshopImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 20,
  },
  workshopTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  workshopDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  workshopDetails: {
    marginBottom: 20,
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
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  registerButtonText: {
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
  workshopInfo: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  workshopInfoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  workshopInfoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  workshopInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  workshopInfoDate: {
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

export default WorkshopSection;