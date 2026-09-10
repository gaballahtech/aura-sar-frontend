import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
  Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, ComposedChart
} from 'recharts';
import { Camera, RotateCcw, TrendingUp, Download, Maximize2, Minimize2, Satellite, MapPin, Ruler, RefreshCw, Database, ExternalLink } from 'lucide-react';
import { apiClient } from '../services/api';

const generateBackscatterData = (locale) => {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);
  for (let i = 0; i < 365; i += 7) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const seasonal = Math.sin(i / 365 * Math.PI * 2) * 3;
    const noise = (Math.random() - 0.5) * 2;
    const trend = -0.01 * i;
    const fireEvent = i > 180 && i < 220 ? -8 * Math.exp(-((i - 200) ** 2) / 200) : 0;
    const recovery = i > 220 ? 2 * (1 - Math.exp(-(i - 220) / 100)) : 0;
    data.push({
      date: date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      backscatter: -12 + seasonal + noise + trend + fireEvent + recovery,
      soilMoisture: 0.4 + Math.sin(i / 365 * Math.PI * 2) * 0.15 + (Math.random() - 0.5) * 0.1 + (i > 220 ? 0.15 * (1 - Math.exp(-(i - 220) / 100)) : 0),
      fuelLoad: 0.7 + Math.sin(i / 365 * Math.PI * 2) * 0.1 + (Math.random() - 0.5) * 0.15 - (i > 180 && i < 220 ? 0.3 : 0) + (i > 220 ? 0.1 * (1 - Math.exp(-(i - 220) / 150)) : 0),
      recovery: i > 220 ? Math.min(100, (i - 220) / 3) : 0,
    });
  }
  return data;
};

const comparisonImages = [
  { key: 'preFire', date: 'June 2024' },
  { key: 'during', date: 'August 2024' },
  { key: 'postFire', date: 'March 2025' },
];

const trendColors = {
  up: { bg: 'bg-success', text: 'text-success' },
  down: { bg: 'bg-danger', text: 'text-danger' },
};

const SAR_TIME_RANGES = {
  '6months': 6 * 30 * 24 * 60 * 60 * 1000,
  '1year': 12 * 30 * 24 * 60 * 60 * 1000,
  '3years': 36 * 30 * 24 * 60 * 60 * 1000,
  '5years': 60 * 30 * 24 * 60 * 60 * 1000,
};

const formatBytes = (bytes) => {
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
};

export default function Analytics() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('1year');
  const [activeComparison, setActiveComparison] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [sceneSource, setSceneSource] = useState('idle');
  const [sceneLoading, setSceneLoading] = useState(false);
  const [sceneWKT, setSceneWKT] = useState('');
  const chartRefs = useRef({});
  const rangeRefs = useRef({});
  const wktRef = useRef('');

  useEffect(() => {
    wktRef.current = sceneWKT;
  }, [sceneWKT]);

  const backscatterData = useMemo(
    () => generateBackscatterData(i18n.language === 'ar' ? 'ar-EG' : 'en-US'),
    [i18n.language]
  );

  const filteredData = backscatterData.filter(d => {
    const now = Date.now();
    const ranges = {
      '6months': 6 * 30 * 24 * 60 * 60 * 1000,
      '1year': 12 * 30 * 24 * 60 * 60 * 1000,
      '3years': 36 * 30 * 24 * 60 * 60 * 1000,
      '5years': 60 * 30 * 24 * 60 * 60 * 1000,
    };
    return now - d.timestamp <= ranges[timeRange];
  });

  const chartColors = {
    grid: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: theme === 'dark' ? '#ffffff' : '#1f2937',
    axis: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    backscatter: '#07c06b',
    soilMoisture: '#3b82f6',
    fuelLoad: '#f59e0b',
    recovery: '#8b5cf6',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 min-w-[200px]">
          <p className="font-semibold text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center space-x-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setShowFullscreen(null);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = (id) => {
    const el = chartRefs.current[id];
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.();
    }
  };

  const downloadChartData = (id) => {
    const rows = id === 'recovery' ? filteredData.slice(-52) : filteredData;
    const headers = ['date', 'backscatter', 'soilMoisture', 'fuelLoad', 'recovery'];
    const csv = [
      headers.join(','),
      ...rows.map(d => headers.map(h => d[h]).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-sar-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchSceneCatalog = useCallback(async () => {
    const now = Date.now();
    const startDate = new Date(now - SAR_TIME_RANGES[timeRange]).toISOString();
    const endDate = new Date(now).toISOString();
    const wkt = wktRef.current.trim();
    setSceneLoading(true);
    const res = await apiClient.searchSARScenes({
      wkt: wkt || undefined,
      startDate,
      endDate,
      maxResults: 12,
    });
    setScenes(res.data);
    setSceneSource(res.message === 'mock-fallback' ? 'mock' : res.success ? 'live' : 'error');
    setSceneLoading(false);
  }, [timeRange]);

  useEffect(() => {
    fetchSceneCatalog();
  }, [fetchSceneCatalog]);

  const formatSceneTime = (iso) =>
    new Date(iso).toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const ChartCard = ({ title, icon: Icon, children, id, className = '' }) => (
    <div ref={el => (chartRefs.current[id] = el)} className={`bg-card p-6 ${className} relative fullscreen-card`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center space-x-2">
          <Icon className="w-5 h-5 text-accent-green" />
          <span>{title}</span>
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => toggleFullscreen(id)}
            className="p-2 rounded-lg bg-glass hover:bg-glass-subtle text-secondary transition-colors"
            aria-label={t('analytics.controls.fullscreen')}
          >
            {showFullscreen === id ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => downloadChartData(id)}
            className="p-2 rounded-lg bg-glass hover:bg-glass-subtle text-secondary transition-colors"
            aria-label={t('analytics.controls.download')}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="h-[350px] chart-body">
        {children}
      </div>
    </div>
  );

  return (
    <section id="analytics" className="py-20 sm:py-28" aria-labelledby="analytics-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="analytics-title" className="section-title">{t('analytics.title')}</h2>
          <p className="section-subtitle">{t('analytics.subtitle')}</p>
        </div>

        <div className="mb-10">
          <div className="bg-card p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-6 flex items-center space-x-2">
              <Camera className="w-5 h-5 text-accent-green" />
              <span>{t('analytics.comparisonSlider.title')}</span>
            </h3>
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                {comparisonImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveComparison(index)}
                    className={`flex flex-col items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                      activeComparison === index
                        ? 'bg-accent-green/20 text-accent-green ring-2 ring-accent-green/50'
                        : 'bg-glass hover:bg-glass-subtle'
                    }`}
                    aria-pressed={activeComparison === index}
                  >
                    <span className="font-semibold">{t(`analytics.comparison.${img.key}.label`)}</span>
                    <span className="text-xs text-muted">{t(`analytics.comparison.${img.key}.date`)}</span>
                  </button>
                ))}
              </div>
              <div className={`aspect-video relative rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-primary-navy to-primary-dark' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-muted" />
                    <p className="text-secondary text-lg">{t(`analytics.comparison.${comparisonImages[activeComparison].key}.label`)} {t('analytics.sarSnapshot')}</p>
                    <p className="text-muted text-sm mt-2">{t(`analytics.comparison.${comparisonImages[activeComparison].key}.description`)}</p>
                    <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-subtle">
                      <span className="flex items-center space-x-1">
                        <Satellite className="w-3 h-3" />
                        <span>{t('analytics.snapshotDetails.satellite')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{t('analytics.snapshotDetails.coords')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Ruler className="w-3 h-3" />
                        <span>{t('analytics.snapshotDetails.resolution')}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-card px-4 py-2 rounded-lg text-sm">
                  <strong>{t('analytics.comparisonInfo.preFireLabel')}:</strong> {t('analytics.comparisonInfo.preFireDesc')}
                </div>
                <div className="bg-card px-4 py-2 rounded-lg text-sm">
                  <strong>{t('analytics.comparisonInfo.duringLabel')}:</strong> {t('analytics.comparisonInfo.duringDesc')}
                </div>
                <div className="bg-card px-4 py-2 rounded-lg text-sm">
                  <strong>{t('analytics.comparisonInfo.recoveryLabel')}:</strong> {t('analytics.comparisonInfo.recoveryDesc')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2" role="radiogroup" aria-label={t('analytics.timeRange.label')}>
            {[
              { value: '6months', label: t('analytics.timeRange.6months') },
              { value: '1year', label: t('analytics.timeRange.1year') },
              { value: '3years', label: t('analytics.timeRange.3years') },
              { value: '5years', label: t('analytics.timeRange.5years') },
            ].map((range, index) => (
              <button
                key={range.value}
                ref={el => (rangeRefs.current[range.value] = el)}
                onClick={() => setTimeRange(range.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
                  e.preventDefault();
                  const options = ['6months', '1year', '3years', '5years'];
                  const next = e.key === 'ArrowRight'
                    ? (index + 1) % options.length
                    : (index - 1 + options.length) % options.length;
                  setTimeRange(options[next]);
                  rangeRefs.current[options[next]]?.focus();
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  timeRange === range.value
                    ? 'bg-accent-green text-primary-dark'
                    : 'bg-card hover:bg-card-hover'
                }`}
                role="radio"
                aria-checked={timeRange === range.value}
                tabIndex={timeRange === range.value ? 0 : -1}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="liquid-surface rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <Database className="w-5 h-5 text-accent-green" />
                <span>{t('analytics.sarCatalog.title')}</span>
                {sceneSource === 'live' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success text-success flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span>{t('analytics.sarCatalog.live')}</span>
                  </span>
                )}
                {sceneSource === 'mock' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-warning text-warning">
                    {t('analytics.sarCatalog.offline')}
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={sceneWKT}
                  onChange={(e) => setSceneWKT(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') fetchSceneCatalog(); }}
                  placeholder={t('analytics.sarCatalog.wktPlaceholder')}
                  aria-label={t('analytics.sarCatalog.wktLabel')}
                  className="input-field wkt-input text-sm"
                />
                <button
                  onClick={fetchSceneCatalog}
                  className="btn-secondary flex items-center space-x-2 text-sm"
                  disabled={sceneLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${sceneLoading ? 'animate-spin' : ''}`} />
                  <span>{t('analytics.sarCatalog.refresh')}</span>
                </button>
              </div>
            </div>
            <p className="text-sm text-muted mb-4">{t('analytics.sarCatalog.subtitle')}</p>

            {scenes.length === 0 && !sceneLoading && (
              <p className="text-center text-muted py-6">{t('analytics.sarCatalog.empty')}</p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">{t('analytics.sarCatalog.title')}</caption>
                <thead>
                  <tr className="text-start text-muted text-sm">
                    <th scope="col" className="text-start font-semibold px-3 py-2.5">{t('analytics.sarCatalog.columns.scene')}</th>
                    <th scope="col" className="text-start font-semibold px-3 py-2.5">{t('analytics.sarCatalog.columns.acquisition')}</th>
                    <th scope="col" className="text-start font-semibold px-3 py-2.5">{t('analytics.sarCatalog.columns.polarization')}</th>
                    <th scope="col" className="text-start font-semibold px-3 py-2.5">{t('analytics.sarCatalog.columns.orbit')}</th>
                    <th scope="col" className="text-start font-semibold px-3 py-2.5">{t('analytics.sarCatalog.columns.size')}</th>
                    <th scope="col" className="text-start font-semibold px-3 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {scenes.map((scene) => (
                    <tr key={scene.fileID} className="border-t border-subtle hover:bg-glass">
                      <td className="px-3 py-2.5 text-primary" dir="ltr">
                        <span className="font-mono text-xs">{scene.sceneName}</span>
                        <span className="block text-xs text-muted">{scene.platform} · {scene.beamModeType} / {scene.processingLevel}</span>
                      </td>
                      <td className="px-3 py-2.5 text-secondary whitespace-nowrap">{formatSceneTime(scene.startTime)}</td>
                      <td className="px-3 py-2.5 text-secondary whitespace-nowrap">{scene.polarization}</td>
                      <td className="px-3 py-2.5 text-secondary whitespace-nowrap">
                        {scene.flightDirection === 'ASCENDING' ? 'A' : 'D'} · P{scene.pathNumber}-{scene.frameNumber}
                      </td>
                      <td className="px-3 py-2.5 text-secondary whitespace-nowrap">{formatBytes(scene.bytes)}</td>
                      <td className="px-3 py-2.5 text-end">
                        <a
                          href={scene.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-accent-green hover:text-accent-green/80 transition-colors"
                          aria-label={`${t('analytics.sarCatalog.download')} ${scene.sceneName}`}
                        >
                          <span>{t('analytics.sarCatalog.download')}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title={t('analytics.charts.backscatter')}
            icon={TrendingUp}
            id="backscatter"
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  axisLine={{ stroke: chartColors.axis }}
                  tickLine={{ stroke: chartColors.axis }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  axisLine={{ stroke: chartColors.axis }}
                  tickLine={{ stroke: chartColors.axis }}
                  label={{ value: t('analytics.axisLabels.backscatter'), angle: -90, position: 'insideLeft', fill: chartColors.text, dy: -40 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: chartColors.text }} />
                <Area
                  type="monotone"
                  dataKey="backscatter"
                  stroke={chartColors.backscatter}
                  fill={chartColors.backscatter}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name={t('analytics.series.backscatter')}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard title={t('analytics.charts.soilMoisture')} icon={RotateCcw} id="soilMoisture">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  axisLine={{ stroke: chartColors.axis }}
                  tickLine={{ stroke: chartColors.axis }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  axisLine={{ stroke: chartColors.axis }}
                  tickLine={{ stroke: chartColors.axis }}
                  domain={[0, 1]}
                  label={{ value: t('analytics.axisLabels.normalized'), angle: -90, position: 'insideLeft', fill: chartColors.text, dy: -40 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: chartColors.text }} />
                <Area
                  type="monotone"
                  dataKey="soilMoisture"
                  stroke={chartColors.soilMoisture}
                  fill={chartColors.soilMoisture}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name={t('analytics.series.soilMoisture')}
                />
                <Line
                  type="monotone"
                  dataKey="fuelLoad"
                  stroke={chartColors.fuelLoad}
                  strokeWidth={2}
                  dot={false}
                  name={t('analytics.series.fuelLoad')}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t('analytics.charts.recoveryProgress')} icon={TrendingUp} id="recovery">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.slice(-52)}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: chartColors.text, fontSize: 10 }}
                  axisLine={{ stroke: chartColors.axis }}
                  tickLine={{ stroke: chartColors.axis }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  axisLine={{ stroke: chartColors.axis }}
                  tickLine={{ stroke: chartColors.axis }}
                  domain={[0, 100]}
                  label={{ value: t('analytics.axisLabels.recovery'), angle: -90, position: 'insideLeft', fill: chartColors.text, dy: -40 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="recovery" radius={[4, 4, 0, 0]}>
                  {filteredData.slice(-52).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.recovery > 0 ? chartColors.recovery : 'transparent'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {[
            { label: t('analytics.statLabels.backscatterMean'), value: '-11.2 dB', change: '+2.1 dB', trend: 'up', description: t('analytics.statDescriptions.backscatterMean') },
            { label: t('analytics.statLabels.soilMoisture'), value: '0.58', change: '+0.12', trend: 'up', description: t('analytics.statDescriptions.soilMoisture') },
            { label: t('analytics.statLabels.fuelLoad'), value: '0.42', change: '-0.18', trend: 'down', description: t('analytics.statDescriptions.fuelLoad') },
          ].map((stat, i) => (
            <div key={i} className="bg-card glow-border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">{stat.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${trendColors[stat.trend].bg} ${trendColors[stat.trend].text}`}>
                  {stat.trend === 'up' ? '+' : ''}{stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <p className="text-sm text-muted">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}