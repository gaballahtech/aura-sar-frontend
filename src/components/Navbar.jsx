import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Sun, Moon, Bell } from 'lucide-react';
const logoLight = '/images/Logo.png';
const logoDark = '/images/Logo-Dark.png';

const navLinks = [
  { id: 'home', label: 'navbar.home' },
  { id: 'dashboard', label: 'navbar.dashboard' },
  { id: 'analytics', label: 'navbar.analytics' },
  { id: 'report', label: 'navbar.report' },
  { id: 'about', label: 'navbar.about' },
];

const navbarAlertItems = [
  { id: 1, key: 'criticalFire', severity: 'critical' },
  { id: 2, key: 'thermalAnomaly', severity: 'high' },
  { id: 3, key: 'airQuality', severity: 'medium' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      setHideNav((prev) => {
        const wasHidden = prev;
        if (y > 120 && y > lastScrollY.current) {
          if (!wasHidden) setShowAlerts(false);
          return true;
        }
        if (y < lastScrollY.current) return false;
        return prev;
      });
      lastScrollY.current = y;

      const sections = navLinks
        .map((link) => document.getElementById(link.id))
        .filter(Boolean);
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom > 120;
      });
      if (current) setActiveSection(current.id);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

          useEffect(() => {
    if (!showAlerts) return;
    const handleOutside = (e) => {
      if (!e.target.closest('[data-alerts-menu]')) {
        setShowAlerts(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowAlerts(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showAlerts]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      setHideNav(false);
      lastScrollY.current = window.scrollY;
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
    setShowAlerts(false);
  };

  const currentLogo = theme === 'dark' ? logoDark : logoLight;

  const renderAlertItems = () => {
    const severityClass = {
      critical: 'bg-danger text-danger',
      high: 'bg-orange text-orange',
      medium: 'bg-yellow text-yellow',
      low: 'bg-success text-success',
    };
    return navbarAlertItems.map(alert => {
      const item = t(`navbar.alertItems.${alert.key}`, { returnObjects: true });
      return (
        <li key={alert.id} className="px-4 py-3 hover:bg-glass border-b border-subtle last:border-0 cursor-default">
          <div className="flex items-start justify-between">
            <p className="text-sm text-primary">{item.msg}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${severityClass[alert.severity]}`}>
              {t(`dashboard.severity.${alert.severity}`)}
            </span>
          </div>
          <p className="text-xs text-muted mt-1">{item.time}</p>
        </li>
      );
    });
  };

  const renderAlertsPanel = () => (
    <div className="absolute end-0 top-full mt-2 w-80 liquid-surface rounded-2xl py-2 z-50 animate-slide-in" role="region" aria-label={t('navbar.alerts')}>
      <div className="px-4 py-2 border-b border-subtle">
        <h3 className="font-semibold text-primary">{t('navbar.alerts')}</h3>
      </div>
      <ul className="max-h-60 overflow-y-auto" data-alerts-list aria-live="polite" aria-relevant="additions">
        {renderAlertItems()}
      </ul>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 liquid-glass liquid-edge border-b border-subtle transition-transform duration-300 ${
        hideNav ? '-translate-y-full' : 'translate-y-0'
      } ${isScrolled ? 'shadow-2xl' : ''}`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            className="flex items-center space-x-3 group"
            aria-label={t('navbar.brand')}
          >
            <img
              src={currentLogo}
              alt={t('navbar.brand')}
              className="h-10 w-auto transition-opacity duration-300 group-hover:opacity-80"
            />
            <span className="hidden sm:block font-bold text-xl text-gradient">
              AURA SAR
            </span>
          </a>

            <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}
                aria-current={activeSection === link.id ? 'location' : undefined}
                className={`relative text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 ${
                  activeSection === link.id
                    ? 'text-accent-green after:w-full after:bg-accent-green'
                    : 'text-secondary hover:text-accent-green after:w-0 after:bg-accent-green hover:after:w-full'
                }`}
              >
                {t(link.label)}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center gap-1 p-1 rounded-full liquid-surface" role="group" aria-label={t('navbar.language')}>
              <button
                onClick={() => setLanguage('en')}
                className={`lang-toggle ${language === 'en' ? 'lang-toggle-active' : 'lang-toggle-inactive'}`}
                aria-pressed={language === 'en'}
                aria-label="English"
              >
                <span lang="en">EN</span>
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`lang-toggle ${language === 'ar' ? 'lang-toggle-active' : 'lang-toggle-inactive'}`}
                aria-pressed={language === 'ar'}
                aria-label="العربية"
              >
                <span lang="ar">AR</span>
              </button>

              <span className="w-px h-6 bg-subtle mx-1" aria-hidden="true" />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-secondary hover:bg-glass transition-colors"
                aria-label={theme === 'dark' ? t('navbar.lightMode') : t('navbar.darkMode')}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative" data-alerts-menu>
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="btn-primary is-round relative flex items-center space-x-2 glow-border"
                aria-expanded={showAlerts}
                aria-haspopup="true"
              >
                <Bell className="w-4 h-4" />
                <span className="me-1">{t('navbar.alerts')}</span>
                {navbarAlertItems.length > 0 && (
                  <span
                    className="absolute -top-1 -end-1 w-5 h-5 bg-danger rounded-full text-xs flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {navbarAlertItems.length}
                  </span>
                )}
              </button>
              {showAlerts && renderAlertsPanel()}
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-glass hover:bg-glass-subtle text-primary"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={t('navbar.menuToggle')}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen
              ? 'max-h-[40rem] opacity-100 visible'
              : 'max-h-0 opacity-0 invisible pointer-events-none'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="py-4 space-y-2 border-t border-subtle">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}
                aria-current={activeSection === link.id ? 'location' : undefined}
                className={`block px-4 py-3 rounded-xl transition-colors ${
                  activeSection === link.id
                    ? 'text-accent-green bg-glass'
                    : 'text-secondary hover:text-accent-green hover:bg-glass'
                }`}
              >
                {t(link.label)}
              </a>
            ))}
            <div className="pt-4 border-t border-subtle flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center space-x-2" role="group" aria-label={t('navbar.language')}>
                <button
                  onClick={() => setLanguage('en')}
                  className={`lang-toggle ${language === 'en' ? 'lang-toggle-active' : 'lang-toggle-inactive'}`}
                  aria-pressed={language === 'en'}
                  aria-label="English"
                >
                  <span lang="en">EN</span>
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`lang-toggle ${language === 'ar' ? 'lang-toggle-active' : 'lang-toggle-inactive'}`}
                  aria-pressed={language === 'ar'}
                  aria-label="العربية"
                >
                  <span lang="ar">AR</span>
                </button>
              </div>
              <button
                onClick={toggleTheme}
                className="btn-secondary w-full sm:w-auto"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 me-2" />
                    {t('navbar.lightMode')}
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 me-2" />
                    {t('navbar.darkMode')}
                  </>
                )}
              </button>
              <div className="relative w-full sm:w-auto" data-alerts-menu>
                <button
                  onClick={() => setShowAlerts(!showAlerts)}
                  className="btn-primary is-round w-full sm:w-auto flex items-center justify-center relative"
                  aria-expanded={showAlerts}
                  aria-haspopup="true"
                  aria-label={t('navbar.alerts')}
                >
                  <Bell className="w-4 h-4 me-2" />
                  {t('navbar.alerts')}
                  {navbarAlertItems.length > 0 && (
                    <span className="ms-2 bg-danger text-white text-xs px-2 py-0.5 rounded-full">
                      {navbarAlertItems.length}
                    </span>
                  )}
                </button>
                {showAlerts && renderAlertsPanel()}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}