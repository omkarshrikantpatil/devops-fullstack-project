import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authApi } from '@/api/authApi';
import { realAuthApi } from '@/api/realAuthApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'ca_platform_token';
const AUTH_USER_KEY = 'ca_platform_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem(AUTH_USER_KEY);
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (pan: string, password: string) => {
    setIsLoading(true);
    try {
      // Try real API first for CA login
      const response = await realAuthApi.login({ pan, password });
      
      // Create user object from API response
      const userData: User = {
        id: `user-${Date.now()}`,
        email: '', // API doesn't return email
        name: pan, // Use PAN as name temporarily
        role: response.role.toLowerCase() as 'ca' | 'master_admin' | 'sub_user' | 'client',
        pan: pan,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      
      setUser(userData);
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      // Fallback to mock API for testing
      try {
        const mockResponse = await authApi.login(pan, password);
        
        if (mockResponse.success && mockResponse.user && mockResponse.token) {
          setUser(mockResponse.user);
          localStorage.setItem(AUTH_TOKEN_KEY, mockResponse.token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockResponse.user));
          return { success: true };
        }
        
        return { success: false, error: mockResponse.error || 'Login failed' };
      } catch (mockError) {
        console.error('Login error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
