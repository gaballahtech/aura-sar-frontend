import type { FireDataPoint } from '../types';

/**
 * Real-data services that work without a backend:
 *  - Active wildfires: NASA EONET v3 (open wildfire events, no API key, CORS-enabled)
 *  - Air quality:      Open-Meteo Air Quality API (US AQI, no API key, CORS-enabled)
 * Every fetcher degrades gracefully: on any failure it reports source 'demo'
 * so the UI keeps its bundled fallback data instead of breaking.
 */

export type DataSource = 'live' | 'demo';

export interface LiveData<T> {
  data: T;
  source: DataSource;
}

async function fetchJson(url: string, timeoutMs = 15000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Active wildfires (NASA EONET) ---------- */

const EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires';

interface EonetGeometry {
  type: string;
  coordinates: unknown;
  date?: string;
}

interface EonetEvent {
  id: string | number;
  title?: string;
  geometry?: EonetGeometry[];
}

/** "2h" / "3d" style short relative time for the alert feed. */
export function relativeTime(dateString?: string): string | null {
  const ts = dateString ? new Date(dateString).getTime() : NaN;
  if (Number.isNaN(ts)) return null;
  const minutes = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export async function fetchWildfires(): Promise<LiveData<FireDataPoint[]>> {
  try {
    const json = (await fetchJson(EONET_URL)) as { events?: EonetEvent[] };
    const events = Array.isArray(json?.events) ? json.events : [];

    const fires: FireDataPoint[] = [];
    events.forEach((event, index) => {
      // latest geometry entry is the most recent footprint of the event
      const geometry = event.geometry?.[event.geometry.length - 1];
      if (!geometry) return;

      let lat: number | null = null;
      let lng: number | null = null;
      if (geometry.type === 'Point' && Array.isArray(geometry.coordinates)) {
        [lng, lat] = geometry.coordinates as [number, number];
      } else if (geometry.type === 'Polygon' && Array.isArray(geometry.coordinates)) {
        // centroid of the outer ring: events burn where their footprint is
        const ring = (geometry.coordinates as number[][][])[0];
        if (Array.isArray(ring)) {
          let sumLng = 0;
          let sumLat = 0;
          let count = 0;
          ring.forEach(pt => {
            if (Array.isArray(pt) && pt.length >= 2 && Number.isFinite(pt[0]) && Number.isFinite(pt[1])) {
              sumLng += pt[0];
              sumLat += pt[1];
              count += 1;
            }
          });
          if (count > 0) {
            lng = sumLng / count;
            lat = sumLat / count;
          }
        }
      }
      if (lat === null || lng === null || !Number.isFinite(lat) || !Number.isFinite(lng)) return;

      // fresher detections burn hotter: 0-96h -> 1.0-0.35 normalized intensity
      const when = geometry.date ? new Date(geometry.date).getTime() : NaN;
      const ageHours = Number.isNaN(when) ? 24 : Math.max(0, (Date.now() - when) / 3600000);
      const intensity = Math.max(0.35, Math.min(1, 1 - ageHours / 96));

      fires.push({
        id: 10000 + index,
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        intensity: Number(intensity.toFixed(2)),
        confidence: 90,
        type: 'active',
        name: String(event.title ?? '').slice(0, 60) || 'Wildfire Event',
        timestamp: geometry.date,
      });
    });

    if (fires.length === 0) throw new Error('EONET returned no open wildfires');
    return { data: fires, source: 'live' };
  } catch {
    return { data: [], source: 'demo' };
  }
}

/* ---------- Air quality (Open-Meteo) ---------- */

export interface AQICity {
  name: string;
  lat: number;
  lng: number;
}

export const AQI_CITIES: AQICity[] = [
  { name: 'San Francisco', lat: 37.77, lng: -122.42 },
  { name: 'Los Angeles', lat: 34.05, lng: -118.24 },
  { name: 'Sacramento', lat: 38.58, lng: -121.49 },
  { name: 'Fresno', lat: 36.74, lng: -119.78 },
  { name: 'San Diego', lat: 32.72, lng: -117.16 },
];

interface OpenMeteoBlock {
  hourly?: { time?: string[]; us_aqi?: (number | null)[] };
}

function aqiLevel(aqi: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'unhealthy';
  return 'hazardous';
}

export async function fetchAirQuality(): Promise<LiveData<{
  location: string;
  aqi: number;
  level: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
}[]>> {
  try {
    const lats = AQI_CITIES.map(c => c.lat).join(',');
    const lngs = AQI_CITIES.map(c => c.lng).join(',');
    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${lats}&longitude=${lngs}&hourly=us_aqi&past_days=1&forecast_days=1&timezone=UTC`;
    const json = (await fetchJson(url)) as OpenMeteoBlock | OpenMeteoBlock[];
    const blocks = (Array.isArray(json) ? json : [json]) as OpenMeteoBlock[];

    const now = Date.now();
    const data = AQI_CITIES.map((city, i) => {
      const hourly = blocks[i]?.hourly;
      const values = hourly?.us_aqi ?? [];
      const times = hourly?.time ?? [];
      let pick = -1;
      for (let k = values.length - 1; k >= 0; k -= 1) {
        const ts = times[k] ? new Date(times[k]).getTime() : NaN;
        if (!Number.isNaN(ts) && ts <= now && typeof values[k] === 'number') {
          pick = k;
          break;
        }
      }
      if (pick < 0) {
        for (let k = 0; k < values.length; k += 1) {
          if (typeof values[k] === 'number') {
            pick = k;
            break;
          }
        }
      }
      const value = pick >= 0 ? values[pick] : null;
      if (typeof value !== 'number' || Number.isNaN(value)) throw new Error(`No AQI value for ${city.name}`);
      return {
        location: city.name,
        aqi: Math.round(value),
        level: aqiLevel(value) as 'good' | 'moderate' | 'unhealthy' | 'hazardous',
      };
    });

    return { data, source: 'live' };
  } catch {
    return { data: [], source: 'demo' };
  }
}
