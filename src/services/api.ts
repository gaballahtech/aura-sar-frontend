import type {
  FireDataPoint,
  AlertData,
  SafeZone,
  EvacuationRoute,
  AQIData,
  FieldReport,
  TimeSeriesData,
  SARSnapshot,
  NASASource,
  ApiResponse,
  WebSocketMessage,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (this.authToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.authToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          data: null as unknown as T,
          success: false,
          error: data.message || `HTTP ${response.status}`,
        };
      }

      return {
        data,
        success: true,
        message: data.message,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          data: null as unknown as T,
          success: false,
          error: 'Request timeout',
        };
      }
      return {
        data: null as unknown as T,
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Fire Data
  async getFireData(bounds?: [[number, number], [number, number]]): Promise<ApiResponse<FireDataPoint[]>> {
    const params = bounds ? `?bounds=${JSON.stringify(bounds)}` : '';
    return this.request<FireDataPoint[]>(`/fires${params}`);
  }

  async getFireById(id: number): Promise<ApiResponse<FireDataPoint>> {
    return this.request<FireDataPoint>(`/fires/${id}`);
  }

  async getFireHistory(id: number, days: number = 30): Promise<ApiResponse<TimeSeriesData[]>> {
    return this.request<TimeSeriesData[]>(`/fires/${id}/history?days=${days}`);
  }

  // Alerts
  async getAlerts(limit: number = 50, severity?: string): Promise<ApiResponse<AlertData[]>> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (severity) params.append('severity', severity);
    return this.request<AlertData[]>(`/alerts?${params.toString()}`);
  }

  async subscribeToAlerts(callback: (alert: AlertData) => void): Promise<() => void> {
    // WebSocket implementation would go here
    console.warn('WebSocket not implemented yet');
    return () => {};
  }

  // Safe Zones
  async getSafeZones(): Promise<ApiResponse<SafeZone[]>> {
    return this.request<SafeZone[]>('/safe-zones');
  }

  async getSafeZoneById(id: number): Promise<ApiResponse<SafeZone>> {
    return this.request<SafeZone>(`/safe-zones/${id}`);
  }

  // Evacuation Routes
  async getEvacuationRoutes(): Promise<ApiResponse<EvacuationRoute[]>> {
    return this.request<EvacuationRoute[]>('/evacuation-routes');
  }

  // AQI
  async getAQIData(): Promise<ApiResponse<AQIData[]>> {
    return this.request<AQIData[]>('/aqi');
  }

  async getAQIByLocation(lat: number, lng: number): Promise<ApiResponse<AQIData>> {
    return this.request<AQIData>(`/aqi/location?lat=${lat}&lng=${lng}`);
  }

  // Field Reports
  async getReports(verified?: boolean, limit: number = 100): Promise<ApiResponse<FieldReport[]>> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (verified !== undefined) params.append('verified', verified.toString());
    return this.request<FieldReport[]>(`/reports?${params.toString()}`);
  }

  async submitReport(report: Omit<FieldReport, 'id' | 'verified' | 'timestamp' | 'votes'>): Promise<ApiResponse<FieldReport>> {
    return this.request<FieldReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  async verifyReport(id: string): Promise<ApiResponse<FieldReport>> {
    return this.request<FieldReport>(`/reports/${id}/verify`, {
      method: 'POST',
    });
  }

  async voteReport(id: string, vote: 'up' | 'down'): Promise<ApiResponse<FieldReport>> {
    return this.request<FieldReport>(`/reports/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote }),
    });
  }

  // Time Series Analytics
  async getTimeSeries(
    lat: number,
    lng: number,
    startDate: string,
    endDate: string,
    metrics: string[] = ['backscatter', 'soilMoisture', 'fuelLoad', 'recovery']
  ): Promise<ApiResponse<TimeSeriesData[]>> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      start: startDate,
      end: endDate,
      metrics: metrics.join(','),
    });
    return this.request<TimeSeriesData[]>(`/analytics/timeseries?${params.toString()}`);
  }

  async getComparisonSnapshots(
    lat: number,
    lng: number,
    dates: string[]
  ): Promise<ApiResponse<SARSnapshot[]>> {
    return this.request<SARSnapshot[]>('/analytics/snapshots', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, dates }),
    });
  }

  // SAR Data
  async getSARCatalog(params: {
    startDate?: string;
    endDate?: string;
    polarization?: string;
    frequency?: string;
    bounds?: [[number, number], [number, number]];
  } = {}): Promise<ApiResponse<SARSnapshot[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
      }
    });
    return this.request<SARSnapshot[]>(`/sar/catalog?${searchParams.toString()}`);
  }

  async downloadSARData(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/sar/download/${id}`, {
      headers: this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {},
    });
    return response.blob();
  }

  // NASA Resources
  async getNASASources(): Promise<ApiResponse<NASASource[]>> {
    return this.request<NASASource[]>('/nasa/sources');
  }

  async searchNASAData(query: string): Promise<ApiResponse<SARSnapshot[]>> {
    return this.request<SARSnapshot[]>(`/nasa/search?q=${encodeURIComponent(query)}`);
  }

  // Statistics
  async getDashboardStats(): Promise<ApiResponse<{
    activeZones: number;
    hazardIndex: number;
    recoveryRate: number;
    totalReports: number;
    verifiedReports: number;
  }>> {
    return this.request('/stats/dashboard');
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; version: string }>> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();

// React Query keys for caching
export const queryKeys = {
  fires: ['fires'] as const,
  fire: (id: number) => ['fires', id] as const,
  fireHistory: (id: number, days: number) => ['fires', id, 'history', days] as const,
  alerts: (limit: number, severity?: string) => ['alerts', limit, severity] as const,
  safeZones: ['safeZones'] as const,
  safeZone: (id: number) => ['safeZones', id] as const,
  evacuationRoutes: ['evacuationRoutes'] as const,
  aqi: ['aqi'] as const,
  aqiLocation: (lat: number, lng: number) => ['aqi', lat, lng] as const,
  reports: (verified?: boolean, limit?: number) => ['reports', verified, limit] as const,
  timeSeries: (lat: number, lng: number, start: string, end: string, metrics: string[]) =>
    ['timeseries', lat, lng, start, end, metrics] as const,
  snapshots: (lat: number, lng: number, dates: string[]) =>
    ['snapshots', lat, lng, dates] as const,
  sarCatalog: (params: Record<string, unknown>) => ['sar', 'catalog', params] as const,
  nasaSources: ['nasa', 'sources'] as const,
  nasaSearch: (query: string) => ['nasa', 'search', query] as const,
  dashboardStats: ['stats', 'dashboard'] as const,
};