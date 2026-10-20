import { useEffect, Suspense, lazy } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Report from './components/Report';
import SarEdu from './components/SarEdu';
import Team from './components/Team';
import Footer from './components/Footer';
import './index.css';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Analytics = lazy(() => import('./components/Analytics'));

function LoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-card">
      <div className="flex flex-col items-center space-y-4 text-accent">
        <span className="text-4xl font-mono animate-blink" aria-hidden="true">█</span>
        <p className="text-muted text-sm uppercase tracking-widest">{t('common.loading')}</p>
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
        <Team />
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