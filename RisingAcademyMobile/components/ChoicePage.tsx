import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ChoicePageProps {
  onChoiceSelect: (type: 'internapplication' | 'courses' | 'workshops' | 'clubs' | 'jobs' | 'admin' | 'basic' | 'full') => void;
  onBack?: () => void;
  showCourseTypes?: boolean;
}

const ChoicePage = ({ onChoiceSelect, onBack, showCourseTypes }: ChoicePageProps) => {
  if (showCourseTypes) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          {/* Back Button */}
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={20} color="#ffffff" />
              <Text style={styles.backButtonText}>العودة للخلف</Text>
            </TouchableOpacity>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#22b0fc', '#1e40af']}
                style={styles.logoGradient}
              >
                <Ionicons name="school" size={32} color="#ffffff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>اختر نوع التسجيل</Text>
            <Text style={styles.subtitle}>اختر طريقة التسجيل التي تناسبك في الدورات المدفوعة</Text>
          </View>

          {/* Course Type Cards */}
          <View style={styles.courseTypesContainer}>
            <TouchableOpacity
              style={styles.courseTypeCard}
              onPress={() => onChoiceSelect('basic')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#22b0fc', '#06b6d4', '#0891b2']}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="school-outline" size={32} color="#ffffff" />
                </View>
                <Text style={styles.cardTitle}>تسجيل أولي</Text>
                <Text style={styles.cardDescription}>
                  تسجيل كمرحلة اولى يحتاج منك التوجه الى المركز بعد التواصل
                </Text>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>حجز مكانك في الدورة</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>معلومات تفصيلية عن المنهج</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>إمكانية التواصل المباشر</Text>
                  </View>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>مجاني ومرن</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.courseTypeCard}
              onPress={() => onChoiceSelect('full')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10b981', '#059669', '#047857']}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="card-outline" size={32} color="#ffffff" />
                </View>
                <Text style={styles.cardTitle}>تسجيل كلي</Text>
                <Text style={styles.cardDescription}>
                  تسجيل كامل مع دفع اما مرة واحدة او جزئيا وضمان مكانك في الدورة
                </Text>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>ضمان مكانك بنسبة 100%</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>امكانية التسجيل عن بعد كليا</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>متابعة مستمرة بعد الدورة</Text>
                  </View>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>الأكثر شمولية</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Logo and Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#ffffff', '#e0f2fe', '#bae6fd']}
              style={styles.logoGradient}
            >
              <Ionicons name="school" size={48} color="#22b0fc" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>أكاديمية رايزين</Text>
          <Text style={styles.subtitle}>اختر الخدمة التي تناسبك من خدماتنا المتنوعة</Text>
        </View>

        {/* Main Choice Cards */}
        <View style={styles.cardsContainer}>
          {/* Paid Courses */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => onChoiceSelect('courses')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#22b0fc', '#06b6d4', '#0891b2']}
              style={styles.cardGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="school-outline" size={32} color="#ffffff" />
              </View>
              <Text style={styles.cardTitle}>دورات مدفوعة</Text>
              <Text style={styles.cardDescription}>
                دورات تدريبية متخصصة في مختلف المجالات التقنية واللغوية
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Free Workshops */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => onChoiceSelect('workshops')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#f59e0b', '#d97706', '#b45309']}
              style={styles.cardGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={32} color="#ffffff" />
              </View>
              <Text style={styles.cardTitle}>ورشات مجانية</Text>
              <Text style={styles.cardDescription}>
                ورش تدريبية مجانية أسبوعية لتطوير المهارات
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Club Membership */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => onChoiceSelect('clubs')}
          >
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.cardGradient}
            >
              <Ionicons name="people-outline" size={32} color="#ffffff" />
              <Text style={styles.cardTitle}>الانخراط في النوادي</Text>
              <Text style={styles.cardDescription}>
                انضم إلى نوادينا المتخصصة وطور مهاراتك مع المجتمع
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Job Applications */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => onChoiceSelect('jobs')}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.cardGradient}
            >
              <Ionicons name="briefcase-outline" size={32} color="#ffffff" />
              <Text style={styles.cardTitle}>التقديم على وظيفة</Text>
              <Text style={styles.cardDescription}>
                انضم إلى فريق العمل كمدرس أو موظف إداري
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Internship Application */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => onChoiceSelect('internapplication')}
          >
            <LinearGradient
              colors={['#6366f1', '#4f46e5']}
              style={styles.cardGradient}
            >
              <Ionicons name="person-add-outline" size={32} color="#ffffff" />
              <Text style={styles.cardTitle}>طلب تربص</Text>
              <Text style={styles.cardDescription}>
                قدم للتدريب واكتسب خبرة عملية معنا
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Admin Button */}
          <TouchableOpacity
            style={[styles.card, styles.adminCard]}
            onPress={() => onChoiceSelect('admin')}
          >
            <LinearGradient
              colors={['#22b0fc', '#1e40af']}
              style={styles.cardGradient}
            >
              <Ionicons name="shield-outline" size={32} color="#ffffff" />
              <Text style={styles.cardTitle}>الدخول للإدارة</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
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
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22b0fc',
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
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    gap: 16,
  },
  courseTypesContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 8,
  },
  courseTypeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 8,
  },
  adminCard: {
    marginTop: 16,
  },
  cardGradient: {
    padding: 24,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 12,
  },
  featureText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default ChoicePage;