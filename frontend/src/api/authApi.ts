import { User } from '@/types';
import { mockUsers } from './mockData';

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock credentials for testing (PAN as username)
const mockCredentials: Record<string, { password: string; email: string }> = {
  'ADMIN12345A': { password: 'admin123', email: 'admin@caplatform.com' },
  'RAJSH1234F': { password: 'ca123', email: 'ca@sharma.com' },
  'PRIYA5678P': { password: 'staff123', email: 'staff@sharma.com' },
  'ABCDE1234F': { password: 'client123', email: 'client@example.com' },
};

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export const authApi = {
  login: async (pan: string, password: string): Promise<LoginResponse> => {
    await delay(800); // Simulate network delay

    const credential = mockCredentials[pan.toUpperCase()];
    
    if (!credential || credential.password !== password) {
      return {
        success: false,
        error: 'Invalid PAN or password',
      };
    }

    const user = mockUsers.find(u => u.email === credential.email);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      user,
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
    };
  },

  logout: async (): Promise<void> => {
    await delay(300);
    // In a real app, this would invalidate the token on the server
  },

  getCurrentUser: async (token: string): Promise<User | null> => {
    await delay(300);
    
    // Extract user ID from mock token
    const parts = token.split('-');
    if (parts.length < 4) return null;
    
    const userId = `${parts[2]}-${parts[3]}`;
    return mockUsers.find(u => u.id === userId) || null;
  },

  // Helper to get test credentials for display
  getTestCredentials: () => {
    return [
      { role: 'Master Admin', pan: 'ADMIN12345A', password: 'admin123' },
      { role: 'CA (Firm Owner)', pan: 'RAJSH1234F', password: 'ca123' },
      { role: 'Sub-User (Staff)', pan: 'PRIYA5678P', password: 'staff123' },
      { role: 'Client', pan: 'ABCDE1234F', password: 'client123' },
    ];
  },
};
