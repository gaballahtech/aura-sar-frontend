import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, MapPin, Shield, TrendingUp, Sparkles } from 'lucide-react';

const statsData = [
  { key: 'activeZones', icon: MapPin, value: '47', suffix: '+' },
  { key: 'hazardIndex', icon: Shield, value: '8.7', suffix: '/10' },
  { key: 'recoveryRate', icon: TrendingUp, value: '73', suffix: '%' },
];

export default function Hero() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setStatsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-navy to-primary-dark" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-accent-green" />
            <span className="text-sm font-medium text-secondary">
              {t('footer.nasaChallenge')} 2025 — {t('footer.challengeTheme')}
            </span>
          </div>

          <h1
            id="hero-title"
            className="section-title text-gradient leading-tight mb-6 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            {t('hero.headline')}
          </h1>

          <p className="section-subtitle text-xl sm:text-2xl text-secondary max-w-3xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <button
              onClick={() => scrollToSection('dashboard')}
              className="btn-primary group flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>{t('hero.cta.exploreMap')}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection('report')}
              className="btn-secondary text-lg px-8 py-4"
            >
              {t('hero.cta.submitReport')}
            </button>
          </div>

          {statsVisible && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: '400ms' }} role="region" aria-label="Live Statistics">
              {statsData.map((stat, index) => (
                <div
                  key={stat.key}
                  className={`stat-card glow-border group`}
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-3 rounded-xl bg-accent-green/20 text-accent-green">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-medium text-secondary">{t(`hero.liveStats.${stat.key}`)}</h3>
                  </div>
                  <div className="flex items-end space-x-1">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient animate-count-up">{stat.value}</span>
                    <span className="text-lg font-semibold text-muted mb-1">{stat.suffix}</span>
                  </div>
                  <div className="mt-3 flex items-center space-x-1 text-xs text-accent-green">
                    <span className="animate-pulse">●</span>
                    <span>Live</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="w-6 h-10 border-2 border-subtle rounded-full flex justify-center pt-1">
            <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}