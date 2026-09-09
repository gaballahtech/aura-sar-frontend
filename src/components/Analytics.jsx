import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
  Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, ComposedChart
} from 'recharts';
import { Camera, RotateCcw, TrendingUp, Download, Maximize2, Minimize2, Satellite, MapPin, Ruler } from 'lucide-react';

const generateBackscatterData = () => {
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
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      backscatter: -12 + seasonal + noise + trend + fireEvent + recovery,
      soilMoisture: 0.4 + Math.sin(i / 365 * Math.PI * 2) * 0.15 + (Math.random() - 0.5) * 0.1 + (i > 220 ? 0.15 * (1 - Math.exp(-(i - 220) / 100)) : 0),
      fuelLoad: 0.7 + Math.sin(i / 365 * Math.PI * 2) * 0.1 + (Math.random() - 0.5) * 0.15 - (i > 180 && i < 220 ? 0.3 : 0) + (i > 220 ? 0.1 * (1 - Math.exp(-(i - 220) / 150)) : 0),
      recovery: i > 220 ? Math.min(100, (i - 220) / 3) : 0,
    });
  }
  return data;
};

const backscatterData = generateBackscatterData();
const fireEventIndex = backscatterData.findIndex(d => d.backscatter < -18);

const comparisonImages = [
  { key: 'preFire', date: 'June 2024' },
  { key: 'during', date: 'August 2024' },
  { key: 'postFire', date: 'March 2025' },
];

const trendColors = {
  up: { bg: 'bg-success', text: 'text-success' },
  down: { bg: 'bg-danger', text: 'text-danger' },
};

export default function Analytics() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('1year');
  const [activeComparison, setActiveComparison] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(null);
  const chartRefs = useRef({});

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

  const ChartCard = ({ title, icon: Icon, children, id, className = '' }) => (
    <div className={`bg-card ${className} relative`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center space-x-2">
          <Icon className="w-5 h-5 text-accent-green" />
          <span>{title}</span>
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowFullscreen(id)}
            className="p-2 rounded-lg bg-glass hover:bg-glass-subtle text-secondary transition-colors"
            aria-label="Fullscreen"
          >
            {showFullscreen === id ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button className="p-2 rounded-lg bg-glass hover:bg-glass-subtle text-secondary transition-colors" aria-label="Download">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="h-[350px]" ref={el => chartRefs.current[id] = el}>
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
                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
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
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2" role="radiogroup" aria-label="Time range">
            {[
              { value: '6months', label: t('analytics.timeRange.6months') },
              { value: '1year', label: t('analytics.timeRange.1year') },
              { value: '3years', label: t('analytics.timeRange.3years') },
              { value: '5years', label: t('analytics.timeRange.5years') },
            ].map(range => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  timeRange === range.value
                    ? 'bg-accent-green text-primary-dark'
                    : 'bg-card hover:bg-card-hover'
                }`}
                role="radio"
                aria-checked={timeRange === range.value}
              >
                {range.label}
              </button>
            ))}
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
                  label={{ value: 'Backscatter (dB)', angle: -90, position: 'insideLeft', fill: chartColors.text, dy: -40 }}
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
                  name="VV Polarization"
                />
                <Line
                  type="monotone"
                  dataKey="backscatter"
                  stroke={chartColors.backscatter}
                  strokeWidth={2}
                  dot={false}
                  name="VV Polarization"
                />
                {fireEventIndex >= 0 && filteredData[fireEventIndex] && (
                  <>
                    <XAxis dataKey="date" hide={true} />
                    <YAxis hide={true} />
                  </>
                )}
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
                  label={{ value: 'Normalized Index', angle: -90, position: 'insideLeft', fill: chartColors.text, dy: -40 }}
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
                  name={t('analytics.charts.soilMoisture').split(' vs ')[0]}
                />
                <Line
                  type="monotone"
                  dataKey="fuelLoad"
                  stroke={chartColors.fuelLoad}
                  strokeWidth={2}
                  dot={false}
                  name={t('analytics.charts.soilMoisture').split(' vs ')[1]}
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
                  label={{ value: 'Recovery %', angle: -90, position: 'insideLeft', fill: chartColors.text, dy: -40 }}
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
            <div key={i} className="bg-card glow-border">
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