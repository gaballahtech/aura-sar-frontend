import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Waves, Radio, TreePine, Satellite, Database, Cloud, Cpu, ExternalLink, ChevronRight, BookOpen, Flame, Ruler, Building2, ArrowLeftRight, ArrowUpDown } from 'lucide-react';

const frequencyBands = [
  { key: 'xBand', icon: Zap, color: '#ef4444', missions: ['TerraSAR-X', 'COSMO-SkyMed', 'Capella Space'] },
  { key: 'cBand', icon: Waves, color: '#3b82f6', missions: ['Sentinel-1', 'RADARSAT-2', 'NISAR (partial)'] },
  { key: 'lBand', icon: TreePine, color: '#07c06b', missions: ['ALOS-2/PALSAR-2', 'UAVSAR', 'NISAR', 'SAOCOM'] },
];

const polarizations = [
  { key: 'hh', icon: ArrowLeftRight },
  { key: 'vv', icon: ArrowUpDown },
  { key: 'hv', icon: ArrowUpDown },
  { key: 'vh', icon: ArrowLeftRight },
];

const scatteringMechanisms = [
  { key: 'surface', icon: Ruler, color: '#3b82f6' },
  { key: 'doubleBounce', icon: Building2, color: '#f59e0b' },
  { key: 'volume', icon: TreePine, color: '#07c06b' },
];

const nasaResourceKeys = [
  { key: 'asf', icon: Satellite, url: 'https://vertex.daac.asf.alaska.edu/' },
  { key: 'nisar', icon: Satellite, url: 'https://nisar.jpl.nasa.gov/' },
  { key: 'uavsar', icon: Cloud, url: 'https://uavsar.jpl.nasa.gov/' },
  { key: 'gee', icon: Cpu, url: 'https://earthengine.google.com/' },
  { key: 'capella', icon: Database, url: 'https://capellaspace.com/' },
];

const decompositionItems = ['surface', 'doubleBounce', 'volume'];

const sarApplications = [
  { icon: Flame, titleKey: 'sarEdu.applications.wildfire', descKey: 'sarEdu.applications.wildfireDesc' },
  { icon: TreePine, titleKey: 'sarEdu.applications.biomass', descKey: 'sarEdu.applications.biomassDesc' },
  { icon: Waves, titleKey: 'sarEdu.applications.flood', descKey: 'sarEdu.applications.floodDesc' },
  { icon: Radio, titleKey: 'sarEdu.applications.deformation', descKey: 'sarEdu.applications.deformationDesc' },
  { icon: Satellite, titleKey: 'sarEdu.applications.agriculture', descKey: 'sarEdu.applications.agricultureDesc' },
  { icon: Database, titleKey: 'sarEdu.applications.maritime', descKey: 'sarEdu.applications.maritimeDesc' },
];

const Card = ({ children, className = '' }) => (
  <div className={`bg-card ${className}`}>
    {children}
  </div>
);

export default function SarEdu() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('frequencies');
  const tabIds = ['frequencies', 'polarizations', 'scattering', 'resources', 'applications'];

  const handleTabKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const currentIndex = tabIds.indexOf(activeTab);
    const nextIndex = e.key === 'ArrowRight' ? (currentIndex + 1) % tabIds.length : (currentIndex - 1 + tabIds.length) % tabIds.length;
    setActiveTab(tabIds[nextIndex]);
  };

  const tabs = [
    { id: 'frequencies', label: t('sarEdu.frequencies.title'), icon: Waves },
    { id: 'polarizations', label: t('sarEdu.polarizations.title'), icon: Radio },
    { id: 'scattering', label: t('sarEdu.scattering.title'), icon: Zap },
    { id: 'resources', label: t('sarEdu.nasaResources.title'), icon: Satellite },
    { id: 'applications', label: t('sarEdu.applications.title'), icon: BookOpen },
  ];

  const tabButtonClass = (isActive) => `
    flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all ${isActive
      ? 'bg-accent-green text-primary-dark shadow-lg shadow-accent-green/20'
      : 'bg-card hover:bg-card-hover'
    }`;

  const TabContent = () => {
    switch (activeTab) {
      case 'frequencies':
        return (
          <div className="space-y-6">
            <p className="text-secondary leading-relaxed max-w-3xl">
              {t('sarEdu.frequencies.intro')}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {frequencyBands.map(band => (
                <Card key={band.key} className="relative overflow-hidden glow-border group">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${band.color}80, ${band.color})` }} />
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${band.color}20` }}>
                      <band.icon className="w-6 h-6" style={{ color: band.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg" style={{ color: band.color }}>{t(`sarEdu.frequencies.${band.key}.name`)}</h4>
                      <p className="text-sm text-muted">{t(`sarEdu.frequencies.${band.key}.wavelength`)} {t('sarEdu.frequencies.wavelength')}</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Radio className="w-4 h-4" style={{ color: band.color }} />
                      <span><strong>{t('sarEdu.frequencies.penetration')}:</strong> {t(`sarEdu.frequencies.${band.key}.penetration`)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Satellite className="w-4 h-4" style={{ color: band.color }} />
                      <span><strong>{t('sarEdu.frequencies.useCase')}:</strong> {t(`sarEdu.frequencies.${band.key}.useCase`)}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-subtle">
                    <p className="text-xs text-muted mb-2">{t('sarEdu.frequencies.keyMissions')}</p>
                    <div className="flex flex-wrap gap-2">
                      {band.missions.map((mission, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-glass text-secondary">{mission}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'polarizations':
        return (
          <div className="space-y-6">
            <p className="text-secondary leading-relaxed max-w-3xl">
              {t('sarEdu.polarizations.intro')}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {polarizations.map(pol => (
                <Card key={pol.key} className="hover:border-accent-green/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <pol.icon className="w-8 h-8 text-accent-green" />
                      <div>
                        <h4 className="font-bold text-xl text-accent-green">{pol.key.toUpperCase()} {t('sarEdu.polarizations.polarizationSuffix')}</h4>
                        <p className="text-sm text-secondary">{t(`sarEdu.polarizations.${pol.key}.desc`)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-glass">
                    <p className="text-sm text-secondary"><strong>{t('sarEdu.polarizations.signature')}</strong> {t(`sarEdu.polarizations.${pol.key}.detail`)}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="mt-4">
              <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Radio className="w-5 h-5 text-accent-green" />
                <span>{t('sarEdu.polarizations.combinationsTitle')}</span>
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {(['vvVh', 'hhHv', 'quad']).map((key, i) => (
                  <div key={i} className="p-4 rounded-xl bg-glass">
                    <code className="text-accent-green font-mono text-lg">{t(`sarEdu.polarizations.combinations.${key}.combo`)}</code>
                    <p className="text-sm text-secondary mt-1">{t(`sarEdu.polarizations.combinations.${key}.use`)}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'scattering':
        return (
          <div className="space-y-6">
            <p className="text-secondary leading-relaxed max-w-3xl">
              {t('sarEdu.scattering.intro')}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {scatteringMechanisms.map(mech => (
                <Card key={mech.key} className="relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${mech.color}80, ${mech.color})` }} />
                  <div className="text-center mb-4">
                    <mech.icon className="w-12 h-12 mx-auto" style={{ color: mech.color }} />
                    <h4 className="font-bold text-xl mt-2" style={{ color: mech.color }}>{t(`sarEdu.scattering.${mech.key}.title`)}</h4>
                  </div>
                  <p className="text-secondary text-sm mb-4">{t(`sarEdu.scattering.${mech.key}.desc`)}</p>
                  <div className="p-3 rounded-lg bg-glass border-s-4" style={{ borderColor: mech.color }}>
                    <p className="text-sm text-secondary"><strong>{t('sarEdu.scattering.signature')}</strong></p>
                    <p className="text-sm text-muted mt-1">{t(`sarEdu.scattering.${mech.key}.sarSignature`)}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card>
              <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-accent-green" />
                <span>{t('sarEdu.scattering.decompositionTitle')}</span>
              </h4>
              <p className="text-secondary mb-4">
                {t('sarEdu.scattering.decompositionDesc')}
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                {decompositionItems.map((key, i) => (
                  <div key={i} className="p-4 rounded-xl bg-glass">
                    <div className="text-2xl font-bold text-accent-green">{t(`sarEdu.scattering.decomposition.${key}.value`)}</div>
                    <div className="text-sm font-medium text-primary">{t(`sarEdu.scattering.decomposition.${key}.label`)}</div>
                    <div className="text-xs text-muted mt-1">{t(`sarEdu.scattering.decomposition.${key}.desc`)}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <p className="text-secondary leading-relaxed max-w-3xl">
              {t('sarEdu.nasaResources.intro')}
            </p>
            <div className="space-y-4">
              {nasaResourceKeys.map(resource => (
                <Card key={resource.key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 group hover:border-accent-green/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 rounded-xl bg-accent-green/10">
                      <resource.icon className="w-6 h-6 text-accent-green" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-lg group-hover:text-accent-green transition-colors">{t(`sarEdu.nasaResources.${resource.key}.title`)}</h4>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-accent-green/20 text-accent-green">{t(`sarEdu.nasaResources.categories.${t(`sarEdu.nasaResources.${resource.key}.category`)}`)}</span>
                      </div>
                      <p className="text-secondary">{t(`sarEdu.nasaResources.${resource.key}.desc`)}</p>
                    </div>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-accent-green/10 text-accent-green hover:bg-accent-green/20 transition-colors whitespace-nowrap"
                  >
                    <span className="text-sm font-medium">{t('sarEdu.nasaResources.explore')}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'applications':
        return (
          <div className="space-y-6">
            <p className="text-secondary leading-relaxed max-w-3xl">
              {t('sarEdu.applications.intro')}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sarApplications.map((app, i) => (
                <Card key={i} className="group hover:border-accent-green/30 transition-colors">
                  <div className="p-3 rounded-xl bg-accent-green/10 mb-4">
                    <app.icon className="w-6 h-6 text-accent-green" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{t(app.titleKey)}</h4>
                  <p className="text-secondary text-sm">{t(app.descKey)}</p>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="about" className="py-20 sm:py-28" aria-labelledby="sar-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="sar-title" className="section-title">{t('sarEdu.title')}</h2>
          <p className="section-subtitle">{t('sarEdu.subtitle')}</p>
        </div>

        <div className="mb-10" role="tablist" aria-label="SAR Education sections">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={handleTabKeyDown}
                className={tabButtonClass(activeTab === tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                tabIndex={activeTab === tab.id ? 0 : -1}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div id={`${activeTab}-panel`} role="tabpanel" className="animate-slide-up">
          <TabContent />
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { block: 'learnMore', icon: BookOpen },
            { block: 'openTools', icon: Cpu },
            { block: 'auraPipeline', icon: Zap },
          ].map((col, i) => (
            <Card key={i}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-accent-green/10">
                  <col.icon className="w-6 h-6 text-accent-green" />
                </div>
                <h4 className="font-bold text-lg">{t(`sarEdu.${col.block}.title`)}</h4>
              </div>
              <p className="text-secondary text-sm mb-4">{t(`sarEdu.${col.block}.desc`)}</p>
              <ul className="space-y-2">
                {t(`sarEdu.${col.block}.items`, { returnObjects: true }).map((item, j) => (
                  <li key={j} className="flex items-center space-x-2 text-sm text-secondary">
                    <ChevronRight className="w-4 h-4 text-accent-green/50 rtl:-scale-x-100" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}