import { useTranslation } from 'react-i18next';
import { ArrowRight, MapPin, Shield, TrendingUp } from 'lucide-react';

const statsData = [
  { key: 'activeZones', icon: MapPin, value: '47', suffix: '+' },
  { key: 'hazardIndex', icon: Shield, value: '8.7', suffix: '/10' },
  { key: 'recoveryRate', icon: TrendingUp, value: '73', suffix: '%' },
];

export default function Hero() {
  const { t } = useTranslation();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-32 pb-16"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 opacity-60 bg-grid-pattern" />
      <div className="absolute inset-0 bg-radar-rings" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-navy to-primary-dark" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent-green/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent-green/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-16 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full liquid-surface border border-subtle mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" aria-hidden="true" />
              <span className="text-xs font-medium text-secondary tracking-widest uppercase">
                {t('footer.nasaChallenge')} 2025 — {t('footer.challengeTheme')}
              </span>
            </div>

            <h1
              id="hero-title"
              className="glitch-text neon-green-text text-primary font-display leading-[1.6] text-2xl sm:text-3xl lg:text-4xl mb-6"
            >
              {t('hero.headline')}
            </h1>

            <p className="text-lg sm:text-xl text-secondary max-w-xl mb-10">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
              <button
                onClick={() => scrollToSection('dashboard')}
                className="btn-primary group flex items-center space-x-2 text-base px-7 py-3.5"
              >
                <span>{t('hero.cta.exploreMap')}</span>
                <ArrowRight className="w-5 h-5 rtl:-scale-x-100 transition-transform ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
              </button>
              <button
                onClick={() => scrollToSection('report')}
                className="btn-secondary text-base px-7 py-3.5"
              >
                {t('hero.cta.submitReport')}
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" aria-hidden="true" />
              <span className="uppercase tracking-widest">// uplink live · sar-1b</span>
            </div>
          </div>

          {/* SAR radar scope — abstract CSS visual */}
          <div className="flex items-center justify-center lg:justify-end animate-slide-up" style={{ animationDelay: '150ms' }} aria-hidden="true">
            <div className="neon-panel relative w-full max-w-md aspect-square rounded-3xl overflow-hidden scanlines">
              <div className="absolute inset-0 bg-radar-rings opacity-90" />
              <div className="absolute inset-2 rounded-full border border-accent-green/30" />
              <div className="absolute inset-8 rounded-full border border-accent-green/20" />
              <div className="absolute inset-16 rounded-full border border-accent-green/10" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-px h-full bg-accent-green/20" />
                <div className="h-px w-full bg-accent-green/20 absolute" />
              </div>
              <div
                className="radar-sweep absolute top-1/2 left-1/2 pointer-events-none"
                style={{
                  width: '60%',
                  height: '60%',
                  transformOrigin: '0% 0%',
                  background: 'conic-gradient(from 0deg, rgba(57,255,20,0.5), rgba(57,255,20,0) 42deg)',
                  borderRadius: '9999px',
                }}
              />
              <span className="absolute left-[38%] top-[30%]">
                <span className="block w-2 h-2 rounded-full bg-accent-green animate-ping" />
              </span>
              <span className="absolute left-[62%] top-[56%]">
                <span className="block w-1.5 h-1.5 rounded-full bg-accent-green-bright animate-pulse" />
              </span>
              <span className="absolute left-[46%] top-[70%]">
                <span className="block w-1 h-1 rounded-full bg-accent-green-dim animate-pulse" />
              </span>

              <span className="absolute top-3 left-4 text-[10px] font-mono text-accent-green/80 tracking-widest">AZ 042°</span>
              <span className="absolute top-3 right-4 text-[10px] font-mono text-accent-green/60 tracking-widest">RNG 128KM</span>

              <div className="absolute bottom-0 inset-x-0 h-10 border-t border-accent-green/30 bg-black/60 flex items-center justify-between px-4 text-[10px] font-mono text-accent-green tracking-widest">
                <span className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green terminal-blink" />
                  <span>UPLINK OK</span>
                </span>
                <span>SNR 21.4DB</span>
                <span>TC-04</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 lg:mt-20 animate-slide-up"
          style={{ animationDelay: '250ms' }}
          role="region"
          aria-label={t('hero.liveStats.regionLabel')}
          aria-live="polite"
        >
          {statsData.map((stat, index) => (
            <div
              key={stat.key}
              className="stat-card glow-border h-full"
              style={{ animationDelay: `${300 + index * 100}ms` }}
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
                <span className="animate-pulse" aria-hidden="true">●</span>
                <span>{t('hero.liveStats.live')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}