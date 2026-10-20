import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Shield, TrendingUp } from 'lucide-react';
import { apiClient, isApiConfigured } from '../services/api';
import { fetchWildfires } from '../services/liveData';

const statsData = [
  { key: 'activeZones', icon: MapPin, suffix: '+', bar: null, ok: false },
  { key: 'hazardIndex', icon: Shield, suffix: '/10', bar: 0, ok: false },
  { key: 'recoveryRate', icon: TrendingUp, suffix: '%', bar: 0, ok: false },
];

const acquisitionData = [
  { key: 'nextPass', value: 'S1A · 04:12 UTC' },
  { key: 'revisit', value: '6 / 12 days' },
  { key: 'beamMode', value: 'IW · GRD · VH+VV' },
  { key: 'latency', value: '< 2.4 h' },
];

const COVERAGE_PCT = 0.972;
const BAR_WIDTH = 40;

const asciiBar = (pct) => {
  const filled = Math.round(pct * BAR_WIDTH);
  return `[${'|'.repeat(filled)}${'.'.repeat(BAR_WIDTH - filled)}]`;
};

export default function Hero() {
  const { t } = useTranslation();
  const headline = t('hero.headline');
  const [typed, setTyped] = useState('');
  const [live, setLive] = useState({ activeZones: null, hazardIndex: null, recoveryRate: null });

  // Real stats: backend endpoints first, then open NASA wildfire events.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isApiConfigured()) {
        const res = await apiClient.getDashboardStats();
        if (cancelled) return;
        if (res.success && res.data) {
          setLive({
            activeZones: res.data.activeZones ?? null,
            hazardIndex: res.data.hazardIndex ?? null,
            recoveryRate: res.data.recoveryRate ?? null,
          });
          return;
        }
      }
      const fires = await fetchWildfires();
      if (cancelled) return;
      if (fires.source === 'live') {
        setLive(prev => ({ ...prev, activeZones: fires.data.length }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const statRows = statsData.map(stat => {
    const value = live[stat.key];
    return {
      ...stat,
      value: value != null ? String(value) : '—',
      bar:
        stat.key === 'hazardIndex'
          ? value != null ? Math.round(value * 10) : 0
          : stat.key === 'recoveryRate'
            ? value != null ? Math.round(value) : 0
            : null,
      ok: value != null,
    };
  });

  // Typewriter effect — headline appears character-by-character
  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setTyped(headline);
      return undefined;
    }
    setTyped('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(headline.slice(0, i));
      if (i >= headline.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [headline]);

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
      <div className="absolute inset-0 opacity-30 bg-grid-pattern" aria-hidden="true" />

      <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-16 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 liquid-surface border border-subtle mb-8">
              <span className="text-xs font-medium text-secondary tracking-widest uppercase" dir="auto">
                [ {t('hero.badge')} ]
              </span>
            </div>

            <h1
              id="hero-title"
              className="text-primary font-display font-bold text-xl sm:text-2xl lg:text-3xl mb-6 text-phosphor-glow"
              aria-label={headline}
            >
              {typed}
              <span className="animate-blink" aria-hidden="true">█</span>
            </h1>

            <p className="text-secondary max-w-xl mb-10 text-sm sm:text-base leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => scrollToSection('dashboard')}
                className="btn-primary group flex items-center justify-center space-x-2 w-full sm:w-auto py-3.5"
              >
                <span>{t('hero.cta.exploreMap')}</span>
              </button>
              <button
                onClick={() => scrollToSection('report')}
                className="btn-secondary flex items-center justify-center w-full sm:w-auto py-3.5"
              >
                {t('hero.cta.submitReport')}
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-muted">
              <span>{'>'}</span>
              <span className="tracking-widest" dir="ltr">SAR-1B DATA LINK · OPERATIONAL</span>
              <span className="animate-blink" aria-hidden="true">_</span>
            </div>
          </div>

          {/* SAR acquisition pane — terminal window with ASCII title bar */}
          <div className="flex items-center justify-center lg:justify-end animate-slide-up" style={{ animationDelay: '150ms' }} aria-hidden="true">
            <div className="relative w-full max-w-md bg-card overflow-hidden">
              <div className="px-4 py-2 border-b border-subtle text-xs text-secondary tracking-widest overflow-hidden whitespace-nowrap" dir="ltr">
                +-- {t('hero.panel.subtitle').toUpperCase()} --+
              </div>

              <div className="px-5 py-5 space-y-4">
                {acquisitionData.map((row) => (
                  <div key={row.key} className="flex items-center justify-between gap-4">
                    <span className="text-xs text-muted uppercase tracking-wider">{t(`hero.panel.${row.key}`)}</span>
                    <span className="font-mono text-xs text-primary" dir="ltr">{row.value}</span>
                  </div>
                ))}

                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-secondary uppercase tracking-wider">{t('hero.panel.coverage')}</span>
                    <span className="font-mono text-accent" dir="ltr">97.2%</span>
                  </div>
                  <pre className="font-mono text-[10px] text-accent leading-none overflow-hidden" dir="ltr">{asciiBar(COVERAGE_PCT)}</pre>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-subtle flex items-center justify-between text-[10px] font-mono text-muted tracking-widest">
                <span>ORBIT 50421 · ASC</span>
                <span className="flex items-center space-x-2">
                  <span>GRD · VV+VH</span>
                  <span className="text-accent animate-blink">_</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STAT PANES — raw data visualization with ASCII bars */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 lg:mt-20 animate-slide-up"
          style={{ animationDelay: '250ms' }}
          role="region"
          aria-label={t('hero.liveStats.regionLabel')}
          aria-live="polite"
        >
          {statRows.map((stat, index) => (
            <div
              key={stat.key}
              className="stat-card glow-border h-full"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xs font-medium text-secondary uppercase tracking-wider leading-relaxed">
                  {t(`hero.liveStats.${stat.key}`)}
                </h3>
                <span className="text-[10px] font-mono text-muted" dir="auto">[ {stat.ok ? 'OK' : '--'} ]</span>
              </div>
              <div className="flex items-end space-x-1">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary text-phosphor-glow animate-count-up">{stat.value}</span>
                <span className="text-lg font-semibold text-muted mb-1">{stat.suffix}</span>
              </div>
              {stat.bar !== null && (
                <pre className="font-mono text-[10px] text-accent-dim mt-3 leading-none overflow-hidden" dir="ltr" aria-hidden="true">{asciiBar(stat.bar / 100)}</pre>
              )}
              <div className="mt-3 flex items-center space-x-2 text-xs text-success">
                <span className={stat.ok ? 'animate-blink' : ''} aria-hidden="true">●</span>
                <span className="uppercase tracking-wider">{stat.ok ? t('hero.liveStats.live') : t('hero.liveStats.awaiting')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
