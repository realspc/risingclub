import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';

import LoadingScreen from './components/LoadingScreen';
import ChoicePage from './components/ChoicePage';
import RegistrationForm from './components/RegistrationForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import WorkshopSection from './components/WorkshopSection';
import ClubSection from './components/ClubSection';
import JobApplicationForm from './components/JobApplicationForm';
import InternApplicationModal from './components/InternApplicationModal';

type AppState = 
  | 'loading' 
  | 'choice' 
  | 'courses' 
  | 'basic-form' 
  | 'full-form' 
  | 'workshops' 
  | 'clubs' 
  | 'jobs' 
  | 'internapplication'
  | 'admin-login' 
  | 'admin-dashboard';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('loading');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setCurrentPage('choice');
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && currentPage === 'admin-login') {
        setCurrentPage('admin-dashboard');
      }
      if (!firebaseUser && currentPage === 'admin-dashboard') {
        setCurrentPage('choice');
      }
    });

    return () => {
      clearTimeout(loadingTimer);
      unsubscribe();
    };
  }, [currentPage]);

  const handleChoiceSelect = (type: AppState | 'admin' | 'basic' | 'full') => {
    if (type === 'admin') {
      if (user) {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('admin-login');
      }
    } else if (type === 'basic' || type === 'full') {
      setCurrentPage(type === 'basic' ? 'basic-form' : 'full-form');
    } else {
      setCurrentPage(type as AppState);
    }
  };

  const handleCourseTypeSelect = (type: 'basic' | 'full') => {
    setCurrentPage(type === 'basic' ? 'basic-form' : 'full-form');
  };

  const handleBack = () => {
    setCurrentPage('choice');
  };

  const handleAdminLoginSuccess = () => {
    setCurrentPage('admin-dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'loading':
        return <LoadingScreen />;
      case 'choice':
        return <ChoicePage onChoiceSelect={handleChoiceSelect} />;
      case 'courses':
        return (
          <ChoicePage 
            onChoiceSelect={handleCourseTypeSelect} 
            onBack={handleBack}
            showCourseTypes={true}
          />
        );
      case 'basic-form':
      case 'full-form':
        return (
          <RegistrationForm 
            type={currentPage === 'basic-form' ? 'basic' : 'full'} 
            onBack={handleBack}
          />
        );
      case 'workshops':
        return <WorkshopSection onBack={handleBack} />;
      case 'clubs':
        return <ClubSection onBack={handleBack} />;
      case 'jobs':
        return <JobApplicationForm onBack={handleBack} />;
      case 'internapplication':
        return <InternApplicationModal onBack={handleBack} />;
      case 'admin-login':
        return (
          <AdminLogin 
            onBack={handleBack}
            onLoginSuccess={handleAdminLoginSuccess}
          />
        );
      case 'admin-dashboard':
        return user ? <AdminDashboard /> : <ChoicePage onChoiceSelect={handleChoiceSelect} />;
      default:
        return <ChoicePage onChoiceSelect={handleChoiceSelect} />;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f8fafc', '#ffffff']}
        style={styles.background}
      >
        {renderCurrentPage()}
      </LinearGradient>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
});