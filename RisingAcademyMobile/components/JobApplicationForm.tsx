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
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase.config';
import { TEACHING_LANGUAGES, STAFF_FIELDS } from '../constants/data';

interface JobApplicationFormProps {
  onBack: () => void;
}

const JobApplicationForm = ({ onBack }: JobApplicationFormProps) => {
  const [jobType, setJobType] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    placeOfBirth: '',
    address: '',
    teachingLanguage: '',
    staffField: '',
    skills: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!jobType) {
      Alert.alert('خطأ', 'يرجى اختيار نوع الوظيفة');
      return;
    }

    if (!formData.fullName || !formData.age || !formData.phone || !formData.dateOfBirth || 
        !formData.placeOfBirth || !formData.address) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (jobType === 'teacher' && !formData.teachingLanguage) {
      Alert.alert('خطأ', 'يرجى اختيار المادة التي تريد تدريسها');
      return;
    }

    if (jobType === 'staff' && !formData.staffField) {
      Alert.alert('خطأ', 'يرجى اختيار المجال الإداري');
      return;
    }

    setIsSubmitting(true);

    try {
      const baseData = {
        jobType,
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email || null,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        address: formData.address,
        skills: formData.skills || null,
        cvUrl: null, // Mobile CV upload would need special handling
        signature: '', // Mobile signature would need special handling
        agreedToContract: true,
        applicationDate: new Date(),
        status: 'pending'
      };

      if (jobType === 'teacher') {
        baseData.teachingLanguage = formData.teachingLanguage;
      }
      if (jobType === 'staff') {
        baseData.staffField = formData.staffField;
      }

      await addDoc(collection(db, 'jobApplications'), baseData);

      Alert.alert(
        'تم التقديم بنجاح!',
        'تم تقديم طلب التوظيف بنجاح. سنتواصل معك قريباً لمراجعة طلبك.',
        [
          {
            text: 'موافق',
            onPress: () => {
              setJobType('');
              setFormData({
                fullName: '', age: '', phone: '', email: '', dateOfBirth: '',
                placeOfBirth: '', address: '', teachingLanguage: '', staffField: '', skills: ''
              });
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting job application:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التقديم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!jobType) {
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
              colors={['#10b981', '#059669']}
              style={styles.iconGradient}
            >
              <Ionicons name="briefcase" size={40} color="#ffffff" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>التقديم على وظيفة</Text>
          <Text style={styles.subtitle}>اختر نوع الوظيفة التي تريد التقديم عليها</Text>
        </View>

        {/* Job Type Selection */}
        <View style={styles.jobTypesContainer}>
          <TouchableOpacity
            style={styles.jobTypeCard}
            onPress={() => setJobType('teacher')}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.cardGradient}
            >
              <Ionicons name="school-outline" size={32} color="#ffffff" />
              <Text style={styles.cardTitle}>مدرس</Text>
              <Text style={styles.cardDescription}>
                انضم إلى فريق التدريس وشارك خبرتك مع الطلاب
              </Text>
              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>• تدريس اللغات المختلفة</Text>
                <Text style={styles.featureItem}>• بيئة تعليمية محفزة</Text>
                <Text style={styles.featureItem}>• تطوير مهني مستمر</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.jobTypeCard}
            onPress={() => setJobType('staff')}
          >
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              style={styles.cardGradient}
            >
              <Ionicons name="people-outline" size={32} color="#ffffff" />
              <Text style={styles.cardTitle}>موظف إداري</Text>
              <Text style={styles.cardDescription}>
                انضم إلى الفريق الإداري وساهم في تطوير الأكاديمية
              </Text>
              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>• وظائف إدارية متنوعة</Text>
                <Text style={styles.featureItem}>• فرص نمو وتطوير</Text>
                <Text style={styles.featureItem}>• بيئة عمل مميزة</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => setJobType('')}>
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
            colors={['#10b981', '#059669']}
            style={styles.logoGradient}
          >
            <Ionicons name="briefcase" size={32} color="#ffffff" />
          </LinearGradient>
        </View>
        <Text style={styles.headerTitle}>
          طلب توظيف - {jobType === 'teacher' ? 'مدرس' : 'موظف إداري'}
        </Text>
        <Text style={styles.headerSubtitle}>املأ النموذج التالي للتقديم على الوظيفة</Text>
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
        </View>

        {/* Job Specific Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات الوظيفة</Text>
          
          {jobType === 'teacher' ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>المادة التي تريد تدريسها *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.teachingLanguage}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, teachingLanguage: value }))}
                  style={styles.picker}
                >
                  <Picker.Item label="اختر المادة" value="" />
                  {TEACHING_LANGUAGES.map((language, index) => (
                    <Picker.Item key={index} label={language} value={language} />
                  ))}
                </Picker>
              </View>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>المجال الإداري *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.staffField}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, staffField: value }))}
                  style={styles.picker}
                >
                  <Picker.Item label="اختر المجال" value="" />
                  {STAFF_FIELDS.map((field, index) => (
                    <Picker.Item key={index} label={field} value={field} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

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

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={isSubmitting ? ['#9ca3af', '#6b7280'] : ['#10b981', '#059669']}
            style={styles.submitButtonGradient}
          >
            {isSubmitting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.submitButtonText}>جاري الإرسال...</Text>
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
    alignItems: 'center',
    marginBottom: 32,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    shadowColor: '#10b981',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  jobTypesContainer: {
    gap: 16,
  },
  jobTypeCard: {
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
    padding: 24,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  featuresList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    textAlign: 'right',
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
    marginBottom: 32,
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

export default JobApplicationForm;