import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from './0-firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

import LoadingScreen from './components/LoadingScreen';
import FloatingElements from './components/FloatingElements';
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

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<AppState[]>(['loading']);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setCurrentPage('choice');
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      setCurrentPage((prevPage) => {
        if (firebaseUser && prevPage === 'admin-login') {
          return 'admin-dashboard';
        }
        if (!firebaseUser && prevPage === 'admin-dashboard') {
          return 'choice';
        }
        return prevPage;
      });
    });

    return () => {
      clearTimeout(loadingTimer);
      unsubscribe();
    };
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      handleBack();
    };

    window.addEventListener('popstate', handlePopState);
    
    // Push initial state
    window.history.pushState({ page: currentPage }, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update history when page changes
  useEffect(() => {
    if (currentPage !== 'loading') {
      window.history.pushState({ page: currentPage }, '', window.location.href);
    }
  }, [currentPage]);

  const navigateToPage = useCallback((page: AppState) => {
    setNavigationHistory(prev => [...prev, currentPage]);
    setCurrentPage(page);
  }, [currentPage]);

  const handleBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const previousPage = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentPage(previousPage);
    } else {
      setCurrentPage('choice');
    }
  }, [navigationHistory]);

  const handleChoiceSelect = (type: AppState | 'admin' | 'basic' | 'full') => {
    if (type === 'admin') {
      if (user) {
        navigateToPage('admin-dashboard');
      } else {
        navigateToPage('admin-login');
      }
    } else if (type === 'basic' || type === 'full') {
      navigateToPage(type === 'basic' ? 'basic-form' : 'full-form');
    } else {
      navigateToPage(type as AppState);
    }
  };

  const handleCourseTypeSelect = (type: 'basic' | 'full') => {
    navigateToPage(type === 'basic' ? 'basic-form' : 'full-form');
  };

  const handleAdminLoginSuccess = () => {
    navigateToPage('admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-[#22b0fc] to-indigo-900 relative overflow-hidden" dir="rtl">
      <FloatingElements />
      <div className="relative z-10 container mx-auto px-4">
        <AnimatePresence mode="wait">
          {currentPage === 'loading' && <LoadingScreen key="loading" />}

          {currentPage === 'choice' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ChoicePage onChoiceSelect={handleChoiceSelect} />
            </motion.div>
          )}

          {currentPage === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ChoicePage 
                onChoiceSelect={handleCourseTypeSelect} 
                onBack={handleBack}
                showCourseTypes={true}
              />
            </motion.div>
          )}

          {(currentPage === 'basic-form' || currentPage === 'full-form') && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RegistrationForm 
                type={currentPage === 'basic-form' ? 'basic' : 'full'} 
                onBack={handleBack}
              />
            </motion.div>
          )}

          {currentPage === 'workshops' && (
            <motion.div
              key="workshops"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WorkshopSection onBack={handleBack} />
            </motion.div>
          )}

          {currentPage === 'clubs' && (
            <motion.div
              key="clubs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ClubSection onBack={handleBack} />
            </motion.div>
          )}

          {currentPage === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <JobApplicationForm onBack={handleBack} />
            </motion.div>
          )}

          {currentPage === 'internapplication' && (
            <motion.div
              key="internapplication"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InternApplicationModal onBack={handleBack} />
            </motion.div>
          )}

          {currentPage === 'admin-login' && (
            <motion.div
              key="admin-login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AdminLogin 
                onBack={handleBack}
                onLoginSuccess={handleAdminLoginSuccess}
              />
            </motion.div>
          )}

          {currentPage === 'admin-dashboard' && user && (
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
