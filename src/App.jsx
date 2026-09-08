import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Report from './components/Report';
import SarEdu from './components/SarEdu';
import Footer from './components/Footer';
import './index.css';

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
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;