import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, AuthState } from '../types';

const AuthContext = createContext<{
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('aura-sar-token');
      const userStr = localStorage.getItem('aura-sar-user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem('aura-sar-token');
          localStorage.removeItem('aura-sar-user');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.login(email, password);
      // For now, simulate successful login
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        role: 'public',
        verified: true,
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      localStorage.setItem('aura-sar-token', mockToken);
      localStorage.setItem('aura-sar-user', JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: Partial<User> & { password: string }) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: String(Date.now()),
        name: userData.name || userData.email?.split('@')[0] || 'User',
        email: userData.email || '',
        role: userData.role || 'public',
        organization: userData.organization,
        verified: false,
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      localStorage.setItem('aura-sar-token', mockToken);
      localStorage.setItem('aura-sar-user', JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aura-sar-token');
    localStorage.removeItem('aura-sar-user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...updates };
      localStorage.setItem('aura-sar-user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}