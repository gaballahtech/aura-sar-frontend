import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../services/api';
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
} from '../../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseMutationState<T, TVariables> {
  mutate: (variables: TVariables) => Promise<ApiResponse<T>>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useFires(bounds?: [[number, number], [number, number]]): UseApiState<FireDataPoint[]> {
  const [state, setState] = useState<UseApiState<FireDataPoint[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getFireData(bounds);
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, [bounds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
}

export function useAlerts(limit: number = 50, severity?: string): UseApiState<AlertData[]> {
  const [state, setState] = useState<UseApiState<AlertData[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getAlerts(limit, severity);
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, [limit, severity]);

  useEffect(() => {
    fetchData();
    // Set up polling for real-time alerts
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return state;
}

export function useSafeZones(): UseApiState<SafeZone[]> {
  const [state, setState] = useState<UseApiState<SafeZone[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getSafeZones();
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
}

export function useEvacuationRoutes(): UseApiState<EvacuationRoute[]> {
  const [state, setState] = useState<UseApiState<EvacuationRoute[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getEvacuationRoutes();
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
}

export function useAQIData(): UseApiState<AQIData[]> {
  const [state, setState] = useState<UseApiState<AQIData[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getAQIData();
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update AQI every minute
    return () => clearInterval(interval);
  }, [fetchData]);

  return state;
}

export function useReports(verified?: boolean, limit: number = 100): UseApiState<FieldReport[]> {
  const [state, setState] = useState<UseApiState<FieldReport[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getReports(verified, limit);
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, [verified, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
}

export function useSubmitReport(): UseMutationState<FieldReport, Omit<FieldReport, 'id' | 'verified' | 'timestamp' | 'votes'>> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (variables) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.submitReport(variables);
    if (!response.success) {
      setError(response.error || 'Failed to submit report');
    }
    setLoading(false);
    return response;
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, reset };
}

export function useTimeSeries(
  lat: number,
  lng: number,
  startDate: string,
  endDate: string,
  metrics: string[] = ['backscatter', 'soilMoisture', 'fuelLoad', 'recovery']
): UseApiState<TimeSeriesData[]> {
  const [state, setState] = useState<UseApiState<TimeSeriesData[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getTimeSeries(lat, lng, startDate, endDate, metrics);
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, [lat, lng, startDate, endDate, metrics.join(',')]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
}

export function useComparisonSnapshots(
  lat: number,
  lng: number,
  dates: string[]
): UseApiState<SARSnapshot[]> {
  const [state, setState] = useState<UseApiState<SARSnapshot[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getComparisonSnapshots(lat, lng, dates);
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, [lat, lng, dates.join(',')]);

  useEffect(() => {
    if (dates.length > 0) fetchData();
  }, [fetchData]);

  return state;
}

export function useSARCatalog(params: Record<string, unknown> = {}): UseApiState<SARSnapshot[]> {
  const [state, setState] = useState<UseApiState<SARSnapshot[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });
  const paramsKey = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getSARCatalog(params);
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, [paramsKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
}

export function useNASASources(): UseApiState<NASASource[]> {
  const [state, setState] = useState<UseApiState<NASASource[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getNASASources();
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
}

export function useDashboardStats(): UseApiState<{
  activeZones: number;
  hazardIndex: number;
  recoveryRate: number;
  totalReports: number;
  verifiedReports: number;
}> {
  const [state, setState] = useState<UseApiState<{
    activeZones: number;
    hazardIndex: number;
    recoveryRate: number;
    totalReports: number;
    verifiedReports: number;
  }>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const response = await apiClient.getDashboardStats();
    setState({
      data: response.success ? response.data : null,
      loading: false,
      error: response.error || null,
      refetch: fetchData,
    });
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return state;
}

export function useVerifyReport(): UseMutationState<FieldReport, string> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.verifyReport(id);
    if (!response.success) {
      setError(response.error || 'Failed to verify report');
    }
    setLoading(false);
    return response;
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, reset };
}

export function useVoteReport(): UseMutationState<FieldReport, { id: string; vote: 'up' | 'down' }> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async ({ id, vote }) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.voteReport(id, vote);
    if (!response.success) {
      setError(response.error || 'Failed to vote');
    }
    setLoading(false);
    return response;
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, reset };
}