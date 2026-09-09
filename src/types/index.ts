export interface FireDataPoint {
  id: number;
  lat: number;
  lng: number;
  intensity: number;
  confidence: number;
  type: 'active' | 'high-risk' | 'medium-risk';
  name: string;
  timestamp?: string;
  backscatter?: number;
  polarization?: string;
}

export interface AlertData {
  id: number;
  type: string;
  location: string;
  confidence: number;
  time: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  coordinates?: [number, number];
}

export interface SafeZone {
  id: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  current: number;
  status: 'open' | 'full' | 'closed';
  amenities?: string[];
}

export interface EvacuationRoute {
  name: string;
  status: 'open' | 'advisory' | 'closed';
  congestion: 'low' | 'moderate' | 'high';
  estimatedTime?: number;
  distance?: number;
}

export interface AQIData {
  location: string;
  aqi: number;
  level: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  pm25?: number;
  pm10?: number;
  timestamp: string;
}

export interface FieldReport {
  id: string;
  photo: string;
  location: string;
  coordinates: [number, number];
  hazardType: 'smoke' | 'activeFire' | 'fallenTrees' | 'landslide';
  description: string;
  verified: boolean;
  reporter: string;
  timestamp: string;
  votes: number;
  verificationCount?: number;
}

export interface TimeSeriesData {
  date: string;
  timestamp: number;
  backscatter: number;
  soilMoisture: number;
  fuelLoad: number;
  recovery: number;
}

export interface SARSnapshot {
  id: string;
  label: string;
  date: string;
  description: string;
  imageUrl: string;
  polarization: string;
  bounds: [[number, number], [number, number]];
  metadata: {
    satellite: string;
    frequency: string;
    resolution: string;
    orbit: string;
  };
}

export interface NASASource {
  key: string;
  title: string;
  description: string;
  url: string;
  category: string;
  apiEndpoint?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WebSocketMessage {
  type: 'alert' | 'fire_update' | 'report' | 'aqi_update' | 'sync';
  payload: unknown;
  timestamp: string;
}

/*
 * SAR scene contract — matches the ASF asf_search backend (see read/readit.txt).
 * Backend returns Sentinel-1 GRD scenes; geometry is the coverage polygon
 * expressed in WKT form using a 5-point pentagon for the query area.
 */
export interface SARSenseScene {
  fileID: string;
  sceneName: string;
  platform: string;
  sensor: string;
  processingLevel: string;
  beamModeType: string;
  polarization: string;
  startTime: string;
  stopTime: string;
  flightDirection: 'ASCENDING' | 'DESCENDING';
  orbit: number;
  pathNumber: number;
  frameNumber: number;
  bytes: number;
  url: string;
  pgeVersion: string;
  granuleType: string;
  geometry: number[][][];
  geometryWKT: string;
}

export interface SARSenseQuery {
  wkt?: string;
  bounds?: [[number, number], [number, number]];
  startDate?: string;
  endDate?: string;
  polarization?: string;
  beamModeType?: string;
  maxResults?: number;
}