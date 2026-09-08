import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Zap, Waves, Radio, TreePine, Satellite, Database, Cloud, Cpu, ExternalLink, ChevronRight, BookOpen, Flame, Ruler, Building2, Mountain, ArrowLeftRight, ArrowUpDown } from 'lucide-react';

const frequencyBands = [
  {
    key: 'xBand',
    icon: Zap,
    color: '#ef4444',
    wavelength: '~3 cm',
    penetration: 'Low vegetation penetration',
    useCase: 'High-res urban & infrastructure mapping',
    missions: ['TerraSAR-X', 'COSMO-SkyMed', 'Capella Space'],
  },
  {
    key: 'cBand',
    icon: Waves,
    color: '#3b82f6',
    wavelength: '~5.6 cm',
    penetration: 'Moderate vegetation penetration',
    useCase: 'General purpose, Sentinel-1, NISAR',
    missions: ['Sentinel-1', 'RADARSAT-2', 'NISAR (partial)'],
  },
  {
    key: 'lBand',
    icon: TreePine,
    color: '#07c06b',
    wavelength: '~24 cm',
    penetration: 'Deep vegetation & canopy penetration',
    useCase: 'Biomass, forest structure, UAVSAR, NISAR',
    missions: ['ALOS-2/PALSAR-2', 'UAVSAR', 'NISAR', 'SAOCOM'],
  },
];

const polarizations = [
  { key: 'hh', label: 'HH', desc: 'Horizontal transmit, Horizontal receive', icon: ArrowLeftRight, detail: 'Strong for surface scattering, urban areas' },
  { key: 'vv', label: 'VV', desc: 'Vertical transmit, Vertical receive', icon: ArrowUpDown, detail: 'Strong for surface scattering, water detection' },
  { key: 'hv', label: 'HV', desc: 'Horizontal transmit, Vertical receive', icon: ArrowUpDown, detail: 'Cross-pol, volume scattering, vegetation' },
  { key: 'vh', label: 'VH', desc: 'Vertical transmit, Horizontal receive', icon: ArrowLeftRight, detail: 'Cross-pol, volume scattering, vegetation' },
];

const scatteringMechanisms = [
  { key: 'surface', icon: Ruler, title: 'Surface Scattering', desc: 'Smooth surfaces (water, roads, bare soil)', sarSignature: 'Low backscatter, specular reflection', color: '#3b82f6' },
  { key: 'doubleBounce', icon: Building2, title: 'Double Bounce', desc: 'Vertical structures (buildings, tree trunks)', sarSignature: 'High backscatter, dihedral corner reflector', color: '#f59e0b' },
  { key: 'volume', icon: TreePine, title: 'Volume Scattering', desc: 'Vegetation canopy, forest biomass', sarSignature: 'Moderate backscatter, random scattering', color: '#07c06b' },
];

const nasaResources = [
  { key: 'asf', icon: Satellite, title: 'ASF Vertex', desc: 'SAR data discovery, access, and download portal for NASA\'s DAAC', url: 'https://vertex.daac.asf.alaska.edu/', category: 'Data Access' },
  { key: 'nisar', icon: Satellite, title: 'NISAR Mission', desc: 'Joint NASA-ISRO L & S band SAR mission for global ecosystem monitoring', url: 'https://nisar.jpl.nasa.gov/', category: 'Mission' },
  { key: 'uavsar', icon: Cloud, title: 'UAVSAR', desc: 'Airborne L-band fully polarimetric SAR for detailed regional studies', url: 'https://uavsar.jpl.nasa.gov/', category: 'Airborne' },
  { key: 'gee', icon: Cpu, title: 'Google Earth Engine', desc: 'Planetary-scale geospatial analysis platform with SAR data catalog', url: 'https://earthengine.google.com/', category: 'Platform' },
  { key: 'capella', icon: Database, title: 'Capella Space', desc: 'Commercial X-band SAR constellation with sub-meter resolution', url: 'https://capellaspace.com/', category: 'Commercial' },
];

const sarApplications = [
  { icon: Flame, title: 'Wildfire Monitoring', desc: 'Active fire detection, burn severity mapping, post-fire recovery tracking' },
  { icon: TreePine, title: 'Forest Biomass', desc: 'Above-ground biomass estimation, carbon stock monitoring, deforestation alerts' },
  { icon: Waves, title: 'Flood Mapping', desc: 'Flood extent mapping, water level changes, damage assessment' },
  { icon: Radio, title: 'Surface Deformation', desc: 'InSAR for subsidence, landslides, earthquake deformation, infrastructure monitoring' },
  { icon: Satellite, title: 'Agriculture', desc: 'Crop classification, soil moisture, growth monitoring, yield prediction' },
  { icon: Database, title: 'Sea Ice & Maritime', desc: 'Ice extent, thickness, type classification, ship detection, oil spills' },
];

export default function SarEdu() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('frequencies');

  const tabs = [
    { id: 'frequencies', label: t('sarEdu.frequencies.title'), icon: Waves },
    { id: 'polarizations', label: t('sarEdu.polarizations.title'), icon: Radio },
    { id: 'scattering', label: t('sarEdu.scattering.title'), icon: Zap },
    { id: 'resources', label: t('sarEdu.nasaResources.title'), icon: Satellite },
    { id: 'applications', label: 'SAR Applications', icon: BookOpen },
  ];

  const Card = ({ children, className = '' }) => (
    <div className={`${theme === 'dark' ? 'glass-card' : 'stat-card-light'} ${className}`}>
      {children}
    </div>
  );

  const TabContent = () => {
    switch (activeTab) {
      case 'frequencies':
        return (
          <div className="space-y-6">
            <p className="text-white/70 leading-relaxed max-w-3xl">
              Synthetic Aperture Radar operates across different frequency bands, each with unique penetration capabilities and applications. 
              The choice of frequency determines what the radar "sees" — from surface details to deep canopy structure.
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
                      <p className="text-sm text-white/50">{band.wavelength} wavelength</p>
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
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/50 mb-2">Key Missions:</p>
                    <div className="flex flex-wrap gap-2">
                      {band.missions.map((mission, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/70">{mission}</span>
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
            <p className="text-white/70 leading-relaxed max-w-3xl">
              Polarization describes the orientation of the electromagnetic wave's electric field. 
              Different polarization combinations reveal different scattering mechanisms and surface properties.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {polarizations.map(pol => (
                <Card key={pol.key} className="hover:border-accent-green/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <pol.icon className="w-8 h-8 text-accent-green" />
                      <div>
                        <h4 className="font-bold text-xl text-accent-green">{pol.label} Polarization</h4>
                        <p className="text-sm text-white/60">{pol.desc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-sm text-white/80"><strong>SAR Signature:</strong> {pol.detail}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="mt-4">
              <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Radio className="w-5 h-5 text-accent-green" />
                <span>Polarization Combinations for Wildfire Analysis</span>
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { combo: 'VV + VH', use: 'Burn severity mapping, Sentinel-1 standard' },
                  { combo: 'HH + HV', use: 'Forest structure, ALOS-PALSAR standard' },
                  { combo: 'Full Quad (HH+HV+VH+VV)', use: 'Complete scattering matrix, UAVSAR, NISAR' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5">
                    <code className="text-accent-green font-mono text-lg">{item.combo}</code>
                    <p className="text-sm text-white/70 mt-1">{item.use}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'scattering':
        return (
          <div className="space-y-6">
            <p className="text-white/70 leading-relaxed max-w-3xl">
              Understanding scattering mechanisms is key to interpreting SAR imagery. 
              Each mechanism produces distinct backscatter signatures that reveal surface and volume properties.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {scatteringMechanisms.map(mech => (
                <Card key={mech.key} className="relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${mech.color}80, ${mech.color})` }} />
                  <div className="text-center mb-4">
                    <mech.icon className="w-12 h-12 mx-auto" style={{ color: mech.color }} />
                    <h4 className="font-bold text-xl mt-2" style={{ color: mech.color }}>{mech.title}</h4>
                  </div>
                  <p className="text-white/70 text-sm mb-4">{mech.desc}</p>
                  <div className="p-3 rounded-lg bg-white/5 border-l-4" style={{ borderColor: mech.color }}>
                    <p className="text-sm text-white/80"><strong>SAR Signature:</strong></p>
                    <p className="text-sm text-white/60 mt-1">{mech.sarSignature}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card>
              <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-accent-green" />
                <span>Freeman-Durden / Yamaguchi Decomposition</span>
              </h4>
              <p className="text-white/70 mb-4">
                Polarimetric decomposition separates mixed scattering into component mechanisms, 
                enabling quantitative analysis of vegetation structure and fire damage.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Surface %', value: '15-30%', desc: 'Ground contribution' },
                  { label: 'Double Bounce %', value: '10-25%', desc: 'Trunk-ground interaction' },
                  { label: 'Volume %', value: '50-70%', desc: 'Canopy scattering' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5">
                    <div className="text-2xl font-bold text-accent-green">{item.value}</div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-white/50 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <p className="text-white/70 leading-relaxed max-w-3xl">
              AURA SAR leverages multiple NASA and commercial data sources for comprehensive wildfire monitoring. 
              These platforms provide the SAR data foundation for our AI-driven analytics.
            </p>
            <div className="space-y-4">
              {nasaResources.map(resource => (
                <Card key={resource.key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 group hover:border-accent-green/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: `${resource.icon.color || '#07c06b'}20` }}>
                      <resource.icon className="w-6 h-6 text-accent-green" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-lg group-hover:text-accent-green transition-colors">{resource.title}</h4>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-accent-green/20 text-accent-green">{resource.category}</span>
                      </div>
                      <p className="text-white/60">{resource.desc}</p>
                    </div>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-accent-green/10 text-accent-green hover:bg-accent-green/20 transition-colors whitespace-nowrap"
                  >
                    <span className="text-sm font-medium">Explore</span>
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
            <p className="text-white/70 leading-relaxed max-w-3xl">
              SAR technology enables diverse applications beyond wildfire monitoring. 
              AURA SAR's framework can be extended to these critical environmental and safety use cases.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sarApplications.map((app, i) => (
                <Card key={i} className="group hover:border-accent-green/30 transition-colors">
                  <div className="p-3 rounded-xl bg-accent-green/10 mb-4">
                    <app.icon className="w-6 h-6 text-accent-green" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{app.title}</h4>
                  <p className="text-white/60 text-sm">{app.desc}</p>
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
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent-green text-primary-dark shadow-lg shadow-accent-green/20'
                    : `${theme === 'dark' ? 'bg-white/5 text-white/80 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
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
            {
              icon: BookOpen,
              title: 'Learn More',
              desc: 'Explore SAR theory, processing techniques, and applications',
              items: ['SAR Handbook (ESA)', 'Radar Polarimetry (Lee & Pottier)', 'InSAR Principles (Rosen et al.)'],
            },
            {
              icon: Cpu,
              title: 'Open Source Tools',
              desc: 'Software for SAR processing and analysis',
              items: ['SNAP (ESA)', 'PySAR / ARIA-Tools', 'GMTSAR / ISCE', 'OpenSARLab (JupyterHub)'],
            },
            {
              icon: Zap,
              title: 'AURA SAR Pipeline',
              desc: 'Our processing workflow for wildfire intelligence',
              items: ['GEE / ASF Data Ingestion', 'Pre-processing & Calibration', 'AI/ML Feature Extraction', 'Real-time Dashboard'],
            },
          ].map((col, i) => (
            <Card key={i}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-accent-green/10">
                  <col.icon className="w-6 h-6 text-accent-green" />
                </div>
                <h4 className="font-bold text-lg">{col.title}</h4>
              </div>
              <p className="text-white/60 text-sm mb-4">{col.desc}</p>
              <ul className="space-y-2">
                {col.items.map((item, j) => (
                  <li key={j} className="flex items-center space-x-2 text-sm text-white/70">
                    <ChevronRight className="w-4 h-4 text-accent-green/50" />
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