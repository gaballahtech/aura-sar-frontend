import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, LayerGroup, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Flame, Wind, AlertTriangle, Shield, Truck, Cloud, RotateCcw } from 'lucide-react';
import { fetchWildfires, fetchAirQuality, relativeTime } from '../services/liveData';
import { apiClient, isApiConfigured } from '../services/api';

const ROLE_OPTIONS = ['firefighter', 'public'];

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

const CONFIDENCE_BAR_WIDTH = 16;

const confidenceBar = (confidence) => {
  const filled = Math.round((confidence / 100) * CONFIDENCE_BAR_WIDTH);
  return `[${'|'.repeat(filled)}${'.'.repeat(CONFIDENCE_BAR_WIDTH - filled)}]`;
};

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

const severityStripe = {
  critical: '#ff3333',
  high: '#ff6600',
  medium: '#ffb000',
  low: '#33ff00',
};

const aqiColors = {
  good: { hex: '#33ff00' },
  moderate: { hex: '#ffd700' },
  unhealthy: { hex: '#ff8800' },
  hazardous: { hex: '#ff3333' },
};

const routeColors = {
  'open-low': { hex: '#33ff00' },
  'open-moderate': { hex: '#ffb000' },
  'advisory-high': { hex: '#ff8800' },
};

const SeverityLegend = ({ t }) => {
  const severities = [
    { label: t('dashboard.severity.critical'), className: severityColors.critical, dot: '#ff3333' },
    { label: t('dashboard.severity.high'), className: severityColors.high, dot: '#ff8800' },
    { label: t('dashboard.severity.medium'), className: severityColors.medium, dot: '#ffb000' },
    { label: t('dashboard.severity.low'), className: severityColors.low, dot: '#33ff00' },
  ];

  return (
    <div className="bg-card p-3 min-w-[180px]">
      <h4 className="font-semibold text-primary mb-2">{t('dashboard.firefighterView.severity')}</h4>
      <div className="space-y-2">
          {severities.map((s, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.dot }} aria-hidden="true" />
              <span className="text-sm text-secondary">{s.label}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

const LayerControl = ({ t, mapLayers, toggleLayer }) => {
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
              className="w-4 h-4 accent-accent rounded"
            />
            <layer.icon className="w-4 h-4 text-accent" />
            <span className="text-sm text-primary">{layer.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Square markers keep the terminal geometry (radius 0) consistent on the map.
const squareMarkerIcon = (side, html) =>
  L.divIcon({
    className: 'map-square-icon',
    html,
    iconSize: [side, side],
    iconAnchor: [side / 2, side / 2],
  });

const fireColor = (intensity) =>
  intensity > 0.8 ? '#ff3333' : intensity > 0.6 ? '#ff8800' : intensity > 0.4 ? '#ffb000' : '#33ff00';

const firePointIcon = (fire) =>
  squareMarkerIcon(
    Math.round(24 + fire.intensity * 18),
    `<span class="sq-marker sq-pulse" style="background:${fireColor(fire.intensity)};box-shadow:0 0 12px 3px ${fireColor(fire.intensity)}55;"></span>`
  );

const fireHeatIcon = (fire) =>
  squareMarkerIcon(
    Math.round(74 + fire.intensity * 56),
    `<span class="sq-marker" style="background:rgba(255,51,0,0.10);border:1px solid rgba(255,51,0,0.22);"></span>`
  );

const HeatRadar = ({ fire }) => (
  <Marker position={[fire.lat, fire.lng]} icon={fireHeatIcon(fire)} interactive={false} keyboard={false} />
);

const FirePoint = ({ fire, t }) => (
  <Marker
    position={[fire.lat, fire.lng]}
    icon={firePointIcon(fire)}
  >
    <Popup>
      <div className="p-2 min-w-[200px]">
        <h4 className="font-bold text-primary mb-1">{fire.name}</h4>
        <div className="text-sm text-secondary space-y-1">
          <p><strong>{t('dashboard.mapPopup.confidence')}:</strong> {fire.confidence}%</p>
          <p><strong>{t('dashboard.mapPopup.intensity')}:</strong> {(fire.intensity * 100).toFixed(0)}%</p>
          <p><strong>{t('dashboard.mapPopup.type')}:</strong> {t(`dashboard.mapPopup.types.${fire.type}`)}</p>
          <p><strong>{t('dashboard.mapPopup.coords')}:</strong> {fire.lat.toFixed(4)}, {fire.lng.toFixed(4)}</p>
        </div>
      </div>
    </Popup>
  </Marker>
);

const SafeZoneMarker = ({ zone, t }) => (
  <Marker
    position={[zone.lat, zone.lng]}
    icon={squareMarkerIcon(
      28,
      `<span class="sq-marker" style="background:rgba(51,255,0,0.18);border:2px solid #33ff00;"></span>`
    )}
  >
    <Popup>
      <div className="p-2 min-w-[200px]">
        <h4 className="font-bold text-primary mb-1 flex items-center space-x-1">
          <Shield className="w-4 h-4 text-accent" />
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
  </Marker>
);

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeRole, setActiveRole] = useState('firefighter');
  const [mapLayers, setMapLayers] = useState({
    sarBackscatter: true,
    aiRiskHeatmap: true,
    thermalPoints: true,
  });
  const [alerts, setAlerts] = useState([]);
  const [fires, setFires] = useState([]);
  const [aqiList, setAqiList] = useState([]);
  const [zones, setZones] = useState(safeZones);
  const [routes, setRoutes] = useState(evacuationRoutes);
  const [fireSource, setFireSource] = useState('demo');
  const [aqiSource, setAqiSource] = useState('demo');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 640
  );
  const roleRefs = useRef([]);
  const dataLive = fireSource !== 'demo' || aqiSource !== 'demo';

  // Real-data load: NASA EONET wildfires + Open-Meteo AQI. Falls back to bundled demo data.
  const loadLiveData = useCallback(async () => {
    const apiTasks = isApiConfigured()
      ? Promise.all([
          apiClient.getFireData(),
          apiClient.getAQIData(),
          apiClient.getSafeZones(),
          apiClient.getEvacuationRoutes(),
        ]).catch(() => [null, null, null, null])
      : Promise.resolve([null, null, null, null]);

    // public real-data services run in parallel with the backend attempt
    const [apiResults, [firesRes, aqiRes]] = await Promise.all([
      apiTasks,
      Promise.all([fetchWildfires(), fetchAirQuality()]),
    ]);
    const [firesApiRes, aqiApiRes, zonesApiRes, routesApiRes] = apiResults;

    let fireData = firesApiRes?.success && Array.isArray(firesApiRes.data) && firesApiRes.data.length
      ? firesApiRes.data : null;
    let fireSourceNext = 'demo';
    if (fireData) fireSourceNext = 'backend';

    let aqiNext = aqiApiRes?.success && Array.isArray(aqiApiRes.data) && aqiApiRes.data.length
      ? aqiApiRes.data : null;
    let aqiSourceNext = 'demo';
    if (aqiNext) aqiSourceNext = 'backend';

    // fall back to public NASA/Open-Meteo real data when the server has none
    if (!fireData && firesRes.source === 'live' && firesRes.data.length > 0) {
      fireData = firesRes.data;
      fireSourceNext = 'live';
    }
    if (!aqiNext && aqiRes.source === 'live' && aqiRes.data.length > 0) {
      aqiNext = aqiRes.data;
      aqiSourceNext = 'live';
    }

    if (zonesApiRes?.success && Array.isArray(zonesApiRes.data) && zonesApiRes.data.length) {
      setZones(zonesApiRes.data);
    }
    if (routesApiRes?.success && Array.isArray(routesApiRes.data) && routesApiRes.data.length) {
      setRoutes(routesApiRes.data);
    }

    if (fireData) {
      setFires(fireData);
      setFireSource(fireSourceNext);
      setAlerts(fireData.slice(0, 5).map(fire => ({
        id: fire.id,
        severity: fire.intensity >= 0.8 ? 'critical' : fire.intensity >= 0.6 ? 'high' : fire.intensity >= 0.4 ? 'medium' : 'low',
        confidence: fire.confidence,
        typeText: t('dashboard.alertsFeed.types.thermalAnomaly'),
        locationText: fire.name,
        timeText: relativeTime(fire.timestamp),
      })));
    } else {
      // clearly-labeled demo fallback — no synthetic alerts are ever generated
      setFires(mockFireData);
      setFireSource('demo');
      setAlerts(mockAlerts);
    }

    if (aqiNext) {
      setAqiList(aqiNext);
      setAqiSource(aqiSourceNext);
    } else {
      setAqiList(aqiData);
      setAqiSource('demo');
    }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    loadLiveData();
  }, [loadLiveData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadLiveData();
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadLiveData]);

  const toggleLayer = (layer) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleRoleKeyDown = (e, index) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = e.key === 'ArrowRight'
      ? (index + 1) % ROLE_OPTIONS.length
      : (index - 1 + ROLE_OPTIONS.length) % ROLE_OPTIONS.length;
    setActiveRole(ROLE_OPTIONS[next]);
    roleRefs.current[next]?.focus();
  };

  return (
    <section id="dashboard" className="py-20 sm:py-28" aria-labelledby="dashboard-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="dashboard-title" className="section-title">{t('dashboard.title')}</h2>
          <p className="section-subtitle">{t('dashboard.subtitle')}</p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 sm:gap-4" role="radiogroup" aria-label={t('dashboard.roleToggle.label')}>
            {ROLE_OPTIONS.map((roleValue, index) => {
              const role = { value: roleValue, label: t(`dashboard.roleToggle.${roleValue}`), icon: roleValue === 'firefighter' ? Flame : Shield };
              return (
                <button
                  key={role.value}
                  ref={el => (roleRefs.current[index] = el)}
                  onClick={() => setActiveRole(role.value)}
                  onKeyDown={(e) => handleRoleKeyDown(e, index)}
                  className={`flex items-center space-x-2 px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium transition-all duration-200 ${
                    activeRole === role.value
                      ? 'bg-accent text-black'
                      : 'bg-card hover:bg-card-hover'
                  }`}
                  role="radio"
                  aria-checked={activeRole === role.value}
                  tabIndex={activeRole === role.value ? 0 : -1}
                >
                  <role.icon className="w-5 h-5" />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 accent-accent rounded"
              />
              <RotateCcw className="w-4 h-4" />
              <span>{t('dashboard.firefighterView.autoRefresh')}</span>
            </label>
          </div>
        </div>

        <div className="relative" role="region" aria-label={t('dashboard.title')}>
          <div className="relative h-[380px] sm:h-[420px] md:h-[520px] rounded-2xl overflow-hidden">
            <MapContainer
              center={CALIFORNIA_CENTER}
              zoom={7}
              maxBounds={CALIFORNIA_BOUNDS}
              maxZoom={12}
              minZoom={6}
              className="h-full w-full"
              zoomControl={false}
              attributionControl={false}
            >
              <ZoomControl position="bottomleft" />
              {mapLayers.sarBackscatter && (
                <TileLayer
                  url="https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                />
              )}

              {activeRole === 'firefighter' && mapLayers.aiRiskHeatmap && (
                <LayerGroup>
                  {fires.map(fire => (
                    <HeatRadar key={`heat-${fire.id}`} fire={fire} />
                  ))}
                </LayerGroup>
              )}

              {activeRole === 'firefighter' && mapLayers.thermalPoints && (
                <LayerGroup>
                  {fires.map(fire => (
                    <FirePoint key={fire.id} fire={fire} t={t} />
                  ))}
                </LayerGroup>
              )}

              {activeRole === 'public' && (
                <LayerGroup>
                  {zones.map(zone => (
                    <SafeZoneMarker key={zone.id} zone={zone} t={t} />
                  ))}
                </LayerGroup>
              )}
            </MapContainer>
          </div>

          {activeRole === 'firefighter' && (
            <div dir="ltr" className="absolute bottom-4 end-4 right-4 z-[1200]">
              <button
                onClick={() => setShowControls(prev => !prev)}
                className="p-2 bg-card hover:bg-card-hover text-secondary transition-colors"
                aria-expanded={showControls}
                aria-label={t('dashboard.firefighterView.mapLayers')}
              >
                <Layers className="w-5 h-5" />
              </button>
            </div>
          )}
          {activeRole === 'firefighter' && showControls && (
            <div dir="ltr" className="absolute top-4 end-4 right-4 z-[1200] flex flex-col gap-2 max-w-[calc(100vw-2rem)]">
              <LayerControl t={t} mapLayers={mapLayers} toggleLayer={toggleLayer} />
              <SeverityLegend t={t} />
            </div>
          )}
        </div>

        <div className="mt-12 space-y-6">
            <div className="bg-card flex flex-col">
              <div className="px-4 py-2.5 border-b border-subtle flex items-center justify-between gap-3 text-xs text-secondary tracking-widest">
                <span className="flex items-center min-w-0">
                  <AlertTriangle className="w-3 h-3 text-danger shrink-0 me-2" aria-hidden="true" />
                  <span className="overflow-hidden whitespace-nowrap text-ellipsis" dir="auto">
                    +-- {t('dashboard.firefighterView.earlyWarnings').toUpperCase()} --+
                  </span>
                </span>
                <span className={`flex items-center space-x-1.5 shrink-0 uppercase ${dataLive ? 'text-accent' : 'text-warning'}`}>
                  <span className={dataLive ? 'animate-blink' : ''} aria-hidden="true">●</span>
                  <span>[ {dataLive ? t('dashboard.dataSource.live') : t('dashboard.dataSource.demo')} ]</span>
                </span>
                {loading && (
                  <span className="text-muted shrink-0">
                    [ {t('dashboard.dataSource.sync')} ]
                  </span>
                )}
              </div>
              <div
                className="scroll-pane max-h-[340px] overflow-y-auto"
                role="log"
                aria-live="polite"
                aria-label={t('dashboard.firefighterView.earlyWarnings')}
              >
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className="px-4 py-3 hover:bg-glass transition-colors font-mono"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 shrink-0"
                        style={{ backgroundColor: severityStripe[alert.severity], color: '#0a0a0a' }}
                      >
                        [ {t(`dashboard.severity.${alert.severity}`)} ]
                      </span>
                      <span className="text-xs text-muted">{alert.timeText ?? t(`dashboard.alertsFeed.times.${alert.timeKey}`)}</span>
                    </div>
                    <p className="text-sm text-primary font-semibold">{alert.typeText ?? t(`dashboard.alertsFeed.types.${alert.typeKey}`)}</p>
                    <p className="text-xs text-secondary">{alert.locationText ?? t(`dashboard.alertsFeed.locations.${alert.locationKey}`)}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs">
                      <span className="text-muted shrink-0" dir="ltr">{alert.confidence}% {t('dashboard.firefighterView.confidence')}</span>
                      <pre className="font-mono text-[10px] text-accent leading-none overflow-hidden" dir="ltr" aria-hidden="true">{confidenceBar(alert.confidence)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {activeRole === 'public' && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                  <Cloud className="w-5 h-5 text-accent" />
                  <span>{t('dashboard.publicView.airQuality')}</span>
                </h3>
                <div className="space-y-3">
                  {aqiList.map(item => {
                    const colors = aqiColors[item.level];
                    return (
                      <div key={item.location} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-glass border border-subtle">
                        <span className="font-medium text-primary">{item.location}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold" style={{ color: colors.hex }}>{item.aqi}</span>
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                            style={{ backgroundColor: colors.hex, color: '#0a0a0a' }}
                          >
                            [ {t(`dashboard.publicView.aqi${item.level.charAt(0).toUpperCase() + item.level.slice(1)}`)} ]
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            <div className="bg-card p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-accent" />
                  <span>{t('dashboard.publicView.evacuationRoutes')}</span>
                </h3>
                <div className="space-y-3">
                  {routes.map((route, i) => {
                    const key = `${route.status}-${route.congestion}`;
                    const colors = routeColors[key] || routeColors['advisory-high'];
                    return (
                      <div key={i} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-glass border border-subtle">
                        <span className="font-medium text-primary">{route.name}</span>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                          style={{ backgroundColor: colors.hex, color: '#0a0a0a' }}
                        >
                          [ {t(`dashboard.routeStatus.${route.status}`)} · {t(`dashboard.congestion.${route.congestion}`)} ]
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            )}
        </div>
      </div>
    </section>
  );
}