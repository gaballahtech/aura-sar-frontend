import { useEffect, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
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
    <div className="min-h-screen flex items-center justify-center bg-card">
      <div className="flex flex-col items-center space-y-4 text-primary">
        <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin" />
        <p className="text-muted">Loading AURA SAR...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('footer.brand')} | ${t('footer.nasaChallenge')}`;
  }, [language, t]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : 'light'}`}>
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
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <AppContent />
            </Suspense>
          </ErrorBoundary>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;