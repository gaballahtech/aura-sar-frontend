import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { MapContainer, TileLayer, LayerGroup, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Flame, Wind, AlertTriangle, Shield, Truck, Cloud, RotateCcw } from 'lucide-react';

const CALIFORNIA_BOUNDS = [[32.5, -124.5], [42.0, -114.0]];
const CALIFORNIA_CENTER = [37.5, -119.5];

const mockFireData = [
  { id: 1, lat: 38.5, lng: -121.5, intensity: 0.9, confidence: 94, type: 'active', name: 'Caldor Fire Zone' },
  { id: 2, lat: 37.8, lng: -122.2, intensity: 0.7, confidence: 87, type: 'high-risk', name: 'East Bay Hills' },
  { id: 3, lat: 36.5, lng: -121.8, intensity: 0.8, confidence: 91, type: 'active', name: 'Big Sur Complex' },
  { id: 4, lat: 39.2, lng: -120.8, intensity: 0.6, confidence: 78, type: 'medium-risk', name: 'Tahoe Basin' },
  { id: 5, lat: 34.5, lng: -118.5, intensity: 0.5, confidence: 72, type: 'medium-risk', name: 'Angeles National Forest' },
  { id: 6, lat: 40.5, lng: -122.3, intensity: 0.85, confidence: 89, type: 'active', name: 'Shasta Trinity' },
];

const alertTypeKeys = ['criticalFireRisk', 'thermalAnomaly', 'airQuality', 'windShift', 'perimeterExpansion'];
const alertLocationKeys = ['caldorFire', 'highway101', 'santaClara', 'bigSur', 'shastaTrinity'];

const mockAlerts = [
  { id: 1, typeKey: 'criticalFireRisk', locationKey: 'caldorFire', confidence: 94, timeKey: '2minAgo', severity: 'critical' },
  { id: 2, typeKey: 'thermalAnomaly', locationKey: 'highway101', confidence: 87, timeKey: '15minAgo', severity: 'high' },
  { id: 3, typeKey: 'airQuality', locationKey: 'santaClara', confidence: 82, timeKey: '1hourAgo', severity: 'medium' },
  { id: 4, typeKey: 'windShift', locationKey: 'bigSur', confidence: 91, timeKey: '3hoursAgo', severity: 'high' },
  { id: 5, typeKey: 'perimeterExpansion', locationKey: 'shastaTrinity', confidence: 89, timeKey: '4hoursAgo', severity: 'critical' },
];

const safeZones = [
  { id: 1, name: 'Sacramento Convention Center', lat: 38.58, lng: -121.49, capacity: 5000, current: 1200 },
  { id: 2, name: 'Oakland Coliseum', lat: 37.75, lng: -122.20, capacity: 8000, current: 3400 },
  { id: 3, name: 'Fresno Fairgrounds', lat: 36.73, lng: -119.77, capacity: 3000, current: 800 },
];

const evacuationRoutes = [
  { name: 'I-5 North Corridor', status: 'open', congestion: 'low' },
  { name: 'US-101 Coastal Route', status: 'open', congestion: 'moderate' },
  { name: 'CA-99 Central Valley', status: 'advisory', congestion: 'high' },
];

const aqiData = [
  { location: 'San Francisco', aqi: 45, level: 'good' },
  { location: 'Los Angeles', aqi: 156, level: 'unhealthy' },
  { location: 'Sacramento', aqi: 89, level: 'moderate' },
  { location: 'Fresno', aqi: 203, level: 'hazardous' },
  { location: 'San Diego', aqi: 67, level: 'moderate' },
];

const severityColors = {
  critical: { bg: 'bg-danger', text: 'text-danger' },
  high: { bg: 'bg-orange', text: 'text-orange' },
  medium: { bg: 'bg-yellow', text: 'text-yellow' },
  low: { bg: 'bg-success', text: 'text-success' },
};

const aqiColors = {
  good: { text: 'text-success', bg: 'bg-success' },
  moderate: { text: 'text-warning', bg: 'bg-warning' },
  unhealthy: { text: 'text-orange', bg: 'bg-orange' },
  hazardous: { text: 'text-danger', bg: 'bg-danger' },
};

const routeColors = {
  'open-low': { bg: 'bg-success', text: 'text-success' },
  'open-moderate': { bg: 'bg-warning', text: 'text-warning' },
  'advisory-high': { bg: 'bg-orange', text: 'text-orange' },
};

const SeverityLegend = ({ theme, t }) => {
  const severities = [
    { label: t('dashboard.severity.critical'), className: severityColors.critical, dot: '#ff4d4d' },
    { label: t('dashboard.severity.high'), className: severityColors.high, dot: '#f59e0b' },
    { label: t('dashboard.severity.medium'), className: severityColors.medium, dot: '#eab308' },
    { label: t('dashboard.severity.low'), className: severityColors.low, dot: '#16a34a' },
  ];

  return (
    <div className="bg-card p-3 min-w-[180px]">
      <h4 className="font-semibold text-primary mb-2">{t('dashboard.firefighterView.severity')}</h4>
      <div className="space-y-2">
        {severities.map((s, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.dot }} />
            <span className="text-sm text-secondary">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LayerControl = ({ theme, t, mapLayers, toggleLayer }) => {
  const layers = [
    { key: 'sarBackscatter', label: t('dashboard.firefighterView.sarBackscatter'), icon: Wind },
    { key: 'aiRiskHeatmap', label: t('dashboard.firefighterView.aiRiskHeatmap'), icon: Flame },
    { key: 'thermalPoints', label: t('dashboard.firefighterView.thermalPoints'), icon: AlertTriangle },
  ];

  return (
    <div className="bg-card p-2">
      <h4 className="font-semibold text-primary mb-2 flex items-center space-x-2">
        <Layers className="w-4 h-4" />
        <span>{t('dashboard.firefighterView.mapLayers')}</span>
      </h4>
      <div className="space-y-2">
        {layers.map(layer => (
          <label key={layer.key} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mapLayers[layer.key]}
              onChange={() => toggleLayer(layer.key)}
              className="w-4 h-4 accent-accent-green rounded"
            />
            <layer.icon className="w-4 h-4 text-accent-green" />
            <span className="text-sm text-primary">{layer.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const FirePoint = ({ fire, theme, t }) => (
  <CircleMarker
    center={[fire.lat, fire.lng]}
    radius={12 + fire.intensity * 10}
    pathOptions={{
      fillColor: theme === 'dark' ? (fire.intensity > 0.8 ? '#ff4d4d' : fire.intensity > 0.6 ? '#ff8c00' : fire.intensity > 0.4 ? '#ffd700' : '#07c06b') : (fire.intensity > 0.8 ? '#dc2626' : fire.intensity > 0.6 ? '#ea580c' : fire.intensity > 0.4 ? '#ca8a04' : '#16a34a'),
      color: theme === 'dark' ? (fire.intensity > 0.8 ? '#ff4d4d' : fire.intensity > 0.6 ? '#ff8c00' : fire.intensity > 0.4 ? '#ffd700' : '#07c06b') : (fire.intensity > 0.8 ? '#dc2626' : fire.intensity > 0.6 ? '#ea580c' : fire.intensity > 0.4 ? '#ca8a04' : '#16a34a'),
      fillOpacity: 0.6,
      weight: 2,
      className: 'marker-pulse',
    }}
  >
    <Popup>
      <div className="p-2 min-w-[200px]">
        <h4 className="font-bold text-primary-dark mb-1">{fire.name}</h4>
        <div className="text-sm text-secondary space-y-1">
          <p><strong>{t('dashboard.mapPopup.confidence')}:</strong> {fire.confidence}%</p>
          <p><strong>{t('dashboard.mapPopup.intensity')}:</strong> {(fire.intensity * 100).toFixed(0)}%</p>
          <p><strong>{t('dashboard.mapPopup.type')}:</strong> {t(`dashboard.mapPopup.types.${fire.type}`)}</p>
          <p><strong>{t('dashboard.mapPopup.coords')}:</strong> {fire.lat.toFixed(4)}, {fire.lng.toFixed(4)}</p>
        </div>
      </div>
    </Popup>
  </CircleMarker>
);

const SafeZoneMarker = ({ zone, t }) => (
  <CircleMarker
    center={[zone.lat, zone.lng]}
    radius={15}
    pathOptions={{
      fillColor: '#07c06b',
      color: '#07c06b',
      fillOpacity: 0.3,
      weight: 2,
    }}
  >
    <Popup>
      <div className="p-2 min-w-[200px]">
        <h4 className="font-bold text-primary-dark mb-1 flex items-center space-x-1">
          <Shield className="w-4 h-4 text-accent-green" />
          <span>{zone.name}</span>
        </h4>
        <div className="text-sm text-secondary space-y-1">
          <p><strong>{t('dashboard.mapPopup.capacity')}:</strong> {zone.capacity.toLocaleString()}</p>
          <p><strong>{t('dashboard.mapPopup.current')}:</strong> {zone.current.toLocaleString()}</p>
          <p><strong>{t('dashboard.mapPopup.available')}:</strong> {(zone.capacity - zone.current).toLocaleString()}</p>
          <p><strong>{t('dashboard.mapPopup.occupancy')}:</strong> {((zone.current / zone.capacity) * 100).toFixed(0)}%</p>
        </div>
      </div>
    </Popup>
  </CircleMarker>
);

export default function Dashboard() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [activeRole, setActiveRole] = useState('firefighter');
  const [mapLayers, setMapLayers] = useState({
    sarBackscatter: true,
    aiRiskHeatmap: true,
    thermalPoints: true,
  });
  const [alerts, setAlerts] = useState(mockAlerts);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setAlerts(prev => [
        {
          id: Date.now(),
          typeKey: alertTypeKeys[Math.floor(Math.random() * alertTypeKeys.length)],
          locationKey: alertLocationKeys[Math.floor(Math.random() * alertLocationKeys.length)],
          confidence: Math.floor(Math.random() * 30) + 70,
          timeKey: 'justNow',
          severity: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)],
        },
        ...prev.slice(0, 4)
      ]);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const toggleLayer = (layer) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <section id="dashboard" className="py-20 sm:py-28" aria-labelledby="dashboard-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="dashboard-title" className="section-title">{t('dashboard.title')}</h2>
          <p className="section-subtitle">{t('dashboard.subtitle')}</p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4" role="radiogroup" aria-label={t('dashboard.roleToggle.firefighter')}>
            {[
              { value: 'firefighter', label: t('dashboard.roleToggle.firefighter'), icon: Flame },
              { value: 'public', label: t('dashboard.roleToggle.public'), icon: Shield },
            ].map(role => (
              <button
                key={role.value}
                onClick={() => setActiveRole(role.value)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeRole === role.value
                    ? 'bg-accent-green text-primary-dark shadow-lg shadow-accent-green/20'
                    : 'bg-card hover:bg-card-hover'
                }`}
                role="radio"
                aria-checked={activeRole === role.value}
              >
                <role.icon className="w-5 h-5" />
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 accent-accent-green rounded"
              />
              <RotateCcw className="w-4 h-4" />
              <span>{t('dashboard.firefighterView.autoRefresh')}</span>
            </label>
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[600px] rounded-2xl overflow-hidden">
            <MapContainer
              center={CALIFORNIA_CENTER}
              zoom={7}
              maxBounds={CALIFORNIA_BOUNDS}
              maxZoom={12}
              minZoom={6}
              className="h-full w-full"
              attributionControl={false}
              zoomControl={false}
            >
              <TileLayer
                url={theme === 'dark'
                  ? 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                }
                attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              />

              {activeRole === 'firefighter' && mapLayers.thermalPoints && (
                <LayerGroup>
                  {mockFireData.map(fire => (
                    <FirePoint key={fire.id} fire={fire} theme={theme} t={t} />
                  ))}
                </LayerGroup>
              )}

              {activeRole === 'public' && (
                <LayerGroup>
                  {safeZones.map(zone => (
                    <SafeZoneMarker key={zone.id} zone={zone} t={t} />
                  ))}
                </LayerGroup>
              )}
            </MapContainer>
          </div>

          {activeRole === 'firefighter' && showControls && (
            <div className="absolute top-4 end-4 z-10 flex flex-col gap-2">
              <LayerControl theme={theme} t={t} mapLayers={mapLayers} toggleLayer={toggleLayer} />
              <SeverityLegend theme={theme} t={t} />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-card h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-accent-red" />
                  <span>{t('dashboard.firefighterView.earlyWarnings')}</span>
                </h3>
                <span className="text-xs px-2 py-1 bg-accent-green/20 text-accent-green rounded-full">{t('dashboard.firefighterView.liveBadge')}</span>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border-s-4 transition-all ${severityColors[alert.severity].bg} ${severityColors[alert.severity].text}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-primary">{t(`dashboard.alertsFeed.types.${alert.typeKey}`)}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${severityColors[alert.severity].bg} ${severityColors[alert.severity].text}`}>
                        {t(`dashboard.severity.${alert.severity}`)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-2">{t(`dashboard.alertsFeed.locations.${alert.locationKey}`)}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">{t(`dashboard.alertsFeed.times.${alert.timeKey}`)}</span>
                      <span className="font-medium text-accent-green">{alert.confidence}% {t('dashboard.firefighterView.confidence')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {activeRole === 'public' && (
              <div className="bg-card">
                <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                  <Cloud className="w-5 h-5 text-accent-green" />
                  <span>{t('dashboard.publicView.airQuality')}</span>
                </h3>
                <div className="space-y-3">
                  {aqiData.map(item => {
                    const colors = aqiColors[item.level];
                    return (
                      <div key={item.location} className="flex items-center justify-between p-3 rounded-xl bg-glass">
                        <span className="font-medium text-primary">{item.location}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${colors.text}`}>{item.aqi}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                            {t(`dashboard.publicView.aqi${item.level.charAt(0).toUpperCase() + item.level.slice(1)}`)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeRole === 'public' && (
              <div className="bg-card">
                <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-accent-green" />
                  <span>{t('dashboard.publicView.evacuationRoutes')}</span>
                </h3>
                <div className="space-y-2">
                  {evacuationRoutes.map((route, i) => {
                    const key = `${route.status}-${route.congestion}`;
                    const colors = routeColors[key] || routeColors['advisory-high'];
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-glass">
                        <span className="font-medium text-primary">{route.name}</span>
                        <span className={`text-sm px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                          {t(`dashboard.routeStatus.${route.status}`)} · {t(`dashboard.congestion.${route.congestion}`)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}