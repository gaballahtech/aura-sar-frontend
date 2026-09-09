import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { GitFork, MessageSquare, Users, Globe, Heart, Zap, Shield, Award } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { labelKey: 'productLinks.dashboard', href: '#dashboard' },
      { labelKey: 'productLinks.analytics', href: '#analytics' },
      { labelKey: 'productLinks.report', href: '#report' },
      { labelKey: 'productLinks.sarEducation', href: '#about' },
    ],
    resources: [
      { labelKey: 'resourceLinks.spaceApps', href: 'https://www.spaceappschallenge.org/', external: true },
      { labelKey: 'resourceLinks.asfVertex', href: 'https://vertex.daac.asf.alaska.edu/', external: true },
      { labelKey: 'resourceLinks.nisar', href: 'https://nisar.jpl.nasa.gov/', external: true },
      { labelKey: 'resourceLinks.gee', href: 'https://earthengine.google.com/', external: true },
    ],
    community: [
      { labelKey: 'communityLinks.github', href: 'https://github.com/gaballahtech/aura-sar-frontend', external: true },
      { labelKey: 'communityLinks.issues', href: 'https://github.com/gaballahtech/aura-sar-frontend/issues', external: true },
      { labelKey: 'communityLinks.contribute', href: 'https://github.com/gaballahtech/aura-sar-frontend/pulls', external: true },
      { labelKey: 'communityLinks.documentation', href: '#', external: false },
    ],
    legal: [
      { labelKey: 'legalLinks.privacy', href: '#' },
      { labelKey: 'legalLinks.terms', href: '#' },
      { labelKey: 'legalLinks.dataUsage', href: '#' },
      { labelKey: 'legalLinks.disclaimer', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: GitFork, href: 'https://github.com/gaballahtech/aura-sar-frontend', label: 'GitHub' },
    { icon: MessageSquare, href: 'https://spaceappschallenge.org/', label: 'Space Apps' },
    { icon: Users, href: 'https://linkedin.com/', label: 'LinkedIn' },
    { icon: Globe, href: '#', label: 'Website' },
  ];

  const badges = [
    { icon: Award, text: 'NASA Space Apps 2025', color: 'text-warning' },
    { icon: Zap, text: 'SAR Technology', color: 'text-info' },
    { icon: Shield, text: 'Wildfire Safety', color: 'text-success' },
    { icon: Heart, text: 'Open Source', color: 'text-danger' },
  ];

  return (
    <footer className="bg-card border-subtle" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={theme === 'dark' ? '/images/Logo-Dark.png' : '/images/Logo.png'}
                alt={t('footer.brand')}
                className="h-10 w-auto"
              />
              <span className="font-bold text-xl text-gradient">AURA SAR</span>
            </div>
            <p className="text-secondary mb-6 max-w-xs">{t('footer.tagline')}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {badges.map((badge, i) => (
                <span key={i} className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-glass border border-subtle">
                  <badge.icon className={`w-3 h-3 ${badge.color}`} />
                  <span className={badge.color}>{badge.text}</span>
                </span>
              ))}
            </div>
            <p className="text-muted text-sm max-w-xs">
              {t('footer.nasaChallenge')} — {t('footer.challengeTheme')}
            </p>
          </div>

          <nav aria-label="Product links">
            <h4 className="font-semibold text-primary mb-4">{t('footer.columnHeaders.product')}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('#')) {
                        e.preventDefault();
                        document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-secondary hover:text-accent-green transition-colors text-sm"
                  >
                    {t(`footer.${link.labelKey}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources links">
            <h4 className="font-semibold text-primary mb-4">{t('footer.columnHeaders.resources')}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-secondary hover:text-accent-green transition-colors text-sm flex items-center space-x-1"
                  >
                    <span>{t(`footer.${link.labelKey}`)}</span>
                    {link.external && <Globe className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Community links">
            <h4 className="font-semibold text-primary mb-4">{t('footer.columnHeaders.community')}</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-secondary hover:text-accent-green transition-colors text-sm flex items-center space-x-1"
                  >
                    <span>{t(`footer.${link.labelKey}`)}</span>
                    {link.external && <Globe className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h4 className="font-semibold text-primary mb-4">{t('footer.columnHeaders.legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-secondary hover:text-accent-green transition-colors text-sm"
                  >
                    {t(`footer.${link.labelKey}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="pt-8 border-t border-subtle">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center justify-center lg:justify-start space-x-6">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-glass hover:bg-accent-green/10 text-secondary hover:text-accent-green transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div className="flex flex-col items-center lg:items-end space-y-2 text-sm text-muted">
              <p>{t('footer.copyright')}</p>
              <p className="text-xs">{t('footer.disclaimer')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted text-sm">
            {'\u2764\uFE0F'} {t('footer.builtWith')} — "Through the Radar Looking Glass"
          </p>
          <p className="text-subtle text-xs mt-1">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}