import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { GitFork, MessageSquare, Users, Globe, Heart, Zap, Shield, Award } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Interactive Dashboard', href: '#dashboard' },
      { label: 'Time-Series Analytics', href: '#analytics' },
      { label: 'Crowdsource Reports', href: '#report' },
      { label: 'SAR Education', href: '#about' },
    ],
    resources: [
      { label: 'NASA Space Apps 2025', href: 'https://www.spaceappschallenge.org/', external: true },
      { label: 'ASF Vertex', href: 'https://vertex.daac.asf.alaska.edu/', external: true },
      { label: 'NISAR Mission', href: 'https://nisar.jpl.nasa.gov/', external: true },
      { label: 'Google Earth Engine', href: 'https://earthengine.google.com/', external: true },
    ],
    community: [
      { label: 'GitHub Repository', href: 'https://github.com/', external: true },
      { label: 'Report Issues', href: 'https://github.com/issues', external: true },
      { label: 'Contribute', href: 'https://github.com/pulls', external: true },
      { label: 'Documentation', href: '#', external: false },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Data Usage', href: '#' },
      { label: 'Disclaimer', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: GitFork, href: 'https://github.com/', label: 'GitHub' },
    { icon: MessageSquare, href: 'https://twitter.com/', label: 'Twitter' },
    { icon: Users, href: 'https://linkedin.com/', label: 'LinkedIn' },
    { icon: Globe, href: '#', label: 'Website' },
  ];

  const badges = [
    { icon: Award, text: 'NASA Space Apps 2025', color: 'text-yellow-400' },
    { icon: Zap, text: 'SAR Technology', color: 'text-blue-400' },
    { icon: Shield, text: 'Wildfire Safety', color: 'text-green-400' },
    { icon: Heart, text: 'Open Source', color: 'text-red-400' },
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
            <h4 className="font-semibold text-primary mb-4">Product</h4>
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
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources links">
            <h4 className="font-semibold text-primary mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-secondary hover:text-accent-green transition-colors text-sm flex items-center space-x-1"
                  >
                    <span>{link.label}</span>
                    {link.external && <Globe className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Community links">
            <h4 className="font-semibold text-primary mb-4">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-secondary hover:text-accent-green transition-colors text-sm flex items-center space-x-1"
                  >
                    <span>{link.label}</span>
                    {link.external && <Globe className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h4 className="font-semibold text-primary mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-secondary hover:text-accent-green transition-colors text-sm"
                  >
                    {link.label}
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
            Built with {'\u2764\uFE0F'} for NASA Space Apps Challenge 2025 — "Through the Radar Looking Glass"
          </p>
          <p className="text-subtle text-xs mt-1">
            Not for operational emergency use. Official alerts via local authorities.
          </p>
        </div>
      </div>
    </footer>
  );
}