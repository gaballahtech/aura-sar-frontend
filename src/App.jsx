import { useEffect, Suspense, lazy } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Report from './components/Report';
import SarEdu from './components/SarEdu';
import Footer from './components/Footer';
import './index.css';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Analytics = lazy(() => import('./components/Analytics'));

function LoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-card">
      <div className="flex flex-col items-center space-y-4 text-primary">
        <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin" />
        <p className="text-muted">{t('common.loading')}</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('footer.brand')} | ${t('footer.nasaChallenge')}`;
  }, [language, t]);

  return (
    <div className="min-h-screen transition-colors duration-300 dark">
      <Navbar />
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

function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <AppContent />
        </Suspense>
      </ErrorBoundary>
    </LanguageProvider>
  );
}

export default App;