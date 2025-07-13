import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { COURSES, WILAYAS, EDUCATION_LEVELS } from '../constants/data';
import { Application } from '../types';

interface RegistrationFormProps {
  type: 'basic' | 'full';
  onBack: () => void;
}

const RegistrationForm = ({ type, onBack }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<Partial<Application>>({
    registrationType: type === 'full' ? 'Full' : 'Basic',
  });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const professionalCourses = COURSES.filter(course => course.category === 'professional');
  const languageCourses = COURSES.filter(course => course.category === 'language');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      Alert.alert('خطأ', 'يرجى اختيار الدورة المطلوبة');
      return;
    }

    if (!formData.fullName || !formData.age || !formData.phone || !formData.wilaya || !formData.education) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData: Application = {
        ...formData,
        course: selectedCourse,
        submissionDate: new Date(),
      } as Application;

      await addDoc(collection(db, 'applications'), applicationData);

      Alert.alert(
        'تم بنجاح!',
        'تم إرسال التسجيل بنجاح! سنتواصل معك قريباً.',
        [
          {
            text: 'موافق',
            onPress: () => {
              setFormData({ registrationType: type === 'full' ? 'Full' : 'Basic' });
              setSelectedCourse('');
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#1e40af', '#22b0fc']}
            style={styles.logoGradient}
          >
            <Ionicons name="school" size={32} color="#ffffff" />
          </LinearGradient>
        </View>
        <Text style={styles.headerTitle}>Rising Academy</Text>
        <Text style={styles.headerSubtitle}>
          {type === 'full' ? 'تسجيل كامل عن بعد' : 'تسجيل أولي مجاني'}
        </Text>
      </LinearGradient>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#ffffff" />
        <Text style={styles.backButtonText}>العودة للخلف</Text>
      </TouchableOpacity>

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
              value={formData.fullName || ''}
              onChangeText={(text) => handleInputChange('fullName', text)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>العمر *</Text>
              <TextInput
                style={styles.input}
                placeholder="العمر"
                keyboardType="numeric"
                value={formData.age?.toString() || ''}
                onChangeText={(text) => handleInputChange('age', parseInt(text) || 0)}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>رقم الهاتف *</Text>
              <TextInput
                style={styles.input}
                placeholder="0555 123 456"
                keyboardType="phone-pad"
                value={formData.phone || ''}
                onChangeText={(text) => handleInputChange('phone', text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>البريد الإلكتروني (اختياري)</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              keyboardType="email-address"
              value={formData.email || ''}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>الولاية *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.wilaya || ''}
                  onValueChange={(value) => handleInputChange('wilaya', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="اختر الولاية" value="" />
                  {WILAYAS.map((wilaya) => (
                    <Picker.Item 
                      key={wilaya.code} 
                      label={`${wilaya.code} - ${wilaya.name}`} 
                      value={wilaya.name} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>المستوى التعليمي *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.education || ''}
                  onValueChange={(value) => handleInputChange('education', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="اختر المستوى" value="" />
                  {EDUCATION_LEVELS.map((level) => (
                    <Picker.Item key={level} label={level} value={level} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Course Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الدورة المطلوبة *</Text>
          
          <Text style={styles.subsectionTitle}>الدورات المهنية</Text>
          <View style={styles.coursesGrid}>
            {professionalCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseCard,
                  selectedCourse === course.name && styles.selectedCourseCard
                ]}
                onPress={() => setSelectedCourse(course.name)}
              >
                <Text style={[
                  styles.courseCardTitle,
                  selectedCourse === course.name && styles.selectedCourseCardTitle
                ]}>
                  {course.name}
                </Text>
                <Text style={[
                  styles.courseCardSubtitle,
                  selectedCourse === course.name && styles.selectedCourseCardSubtitle
                ]}>
                  {course.arabicName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subsectionTitle}>دورات اللغات</Text>
          <View style={styles.coursesGrid}>
            {languageCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseCard,
                  styles.languageCourseCard,
                  selectedCourse === course.name && styles.selectedLanguageCourseCard
                ]}
                onPress={() => setSelectedCourse(course.name)}
              >
                <Text style={[
                  styles.courseCardTitle,
                  selectedCourse === course.name && styles.selectedCourseCardTitle
                ]}>
                  {course.name}
                </Text>
                <Text style={[
                  styles.courseCardSubtitle,
                  selectedCourse === course.name && styles.selectedCourseCardSubtitle
                ]}>
                  {course.arabicName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Optional Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات إضافية (اختياري)</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>الخبرة السابقة</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="اكتب عن خبرتك السابقة..."
              multiline
              numberOfLines={4}
              value={formData.experience || ''}
              onChangeText={(text) => handleInputChange('experience', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>ملاحظات أو استفسارات</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="أي استفسارات أو ملاحظات؟"
              multiline
              numberOfLines={4}
              value={formData.comments || ''}
              onChangeText={(text) => handleInputChange('comments', text)}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, (!selectedCourse || isSubmitting) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!selectedCourse || isSubmitting}
        >
          <LinearGradient
            colors={(!selectedCourse || isSubmitting) ? ['#9ca3af', '#6b7280'] : ['#10b981', '#059669']}
            style={styles.submitButtonGradient}
          >
            {isSubmitting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.submitButtonText}>جاري الإرسال...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>إرسال التسجيل</Text>
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
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6b7280',
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 12,
    marginTop: 16,
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
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    minWidth: '45%',
    alignItems: 'center',
  },
  languageCourseCard: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  selectedCourseCard: {
    backgroundColor: '#22b0fc',
    borderColor: '#22b0fc',
  },
  selectedLanguageCourseCard: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  courseCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  courseCardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  selectedCourseCardTitle: {
    color: '#ffffff',
  },
  selectedCourseCardSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
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

export default RegistrationForm;