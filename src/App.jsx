import { useEffect, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Report from './components/Report';
import SarEdu from './components/SarEdu';
import Footer from './components/Footer';
import './index.css';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark">
      <div className="flex flex-col items-center space-y-4 text-white">
        <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin" />
        <p className="text-white/70">Loading AURA SAR...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { authState } = useAuth();

  useEffect(() => {
    document.title = `${t('footer.brand')} | ${t('footer.nasaChallenge')}`;
  }, [language, t]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : 'light'}`}>
      <Navbar user={authState.user} />
      <main id="main-content">
        <Hero />
        <Dashboard />
        <Analytics />
        <Report />
        <SarEdu />
      </main>
      <Footer />
    </div>
  );
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <AppWithAuth />
            </Suspense>
          </ErrorBoundary>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;