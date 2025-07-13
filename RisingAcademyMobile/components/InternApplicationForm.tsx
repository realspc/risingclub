import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase.config';

interface InternApplicationFormProps {
  onBack: () => void;
}

const InternApplicationForm = ({ onBack }: InternApplicationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    placeOfBirth: '',
    address: '',
    academicSpecialization: '',
    skills: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.age || !formData.phone || !formData.dateOfBirth || 
        !formData.placeOfBirth || !formData.address || !formData.academicSpecialization || !formData.skills) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email || null,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        address: formData.address,
        academicSpecialization: formData.academicSpecialization,
        skills: formData.skills,
        cvUrl: null, // Mobile CV upload would need special handling
        signature: '', // Mobile signature would need special handling
        agreedToContract: true,
        applicationDate: new Date(),
        status: 'pending'
      };

      await addDoc(collection(db, 'internApplications'), applicationData);

      Alert.alert(
        'تم التقديم بنجاح!',
        'تم تقديم طلب التدريب بنجاح. سنتواصل معك قريباً.',
        [
          {
            text: 'موافق',
            onPress: () => {
              setFormData({
                fullName: '', age: '', phone: '', email: '', dateOfBirth: '',
                placeOfBirth: '', address: '', academicSpecialization: '', skills: ''
              });
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting intern application:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التقديم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#ffffff" />
        <Text style={styles.backButtonText}>العودة للخلف</Text>
      </TouchableOpacity>

      {/* Header */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#6366f1', '#4f46e5']}
            style={styles.logoGradient}
          >
            <Ionicons name="person-add" size={32} color="#ffffff" />
          </LinearGradient>
        </View>
        <Text style={styles.headerTitle}>طلب تـربص</Text>
        <Text style={styles.headerSubtitle}>املأ النموذج التالي للتقديم على فرصة التدريب</Text>
      </LinearGradient>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
          
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
            <Text style={styles.label}>التخصص الدراسي *</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: هندسة معلوماتية، إدارة أعمال، إلخ..."
              value={formData.academicSpecialization}
              onChangeText={(text) => setFormData(prev => ({ ...prev, academicSpecialization: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>المهارات والخبرات *</Text>
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

        {/* Technology Requirements Note */}
        <View style={styles.noteContainer}>
          <View style={styles.noteHeader}>
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <Text style={styles.noteTitle}>متطلبات تقنية مهمة</Text>
          </View>
          <Text style={styles.noteText}>
            يجب على المتدرب أن يكون لديه معرفة أساسية باستخدام التكنولوجيا مثل:
          </Text>
          <View style={styles.noteList}>
            <Text style={styles.noteListItem}>• استخدام الحاسوب والإنترنت</Text>
            <Text style={styles.noteListItem}>• التعامل مع البريد الإلكتروني</Text>
            <Text style={styles.noteListItem}>• استخدام برامج Office الأساسية (Word, Excel)</Text>
            <Text style={styles.noteListItem}>• القدرة على التعلم والتكيف مع الأدوات الجديدة</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={isSubmitting ? ['#9ca3af', '#6b7280'] : ['#6366f1', '#4f46e5']}
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
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
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
  noteContainer: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginLeft: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 8,
  },
  noteList: {
    marginTop: 8,
  },
  noteListItem: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 4,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
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

export default InternApplicationForm;