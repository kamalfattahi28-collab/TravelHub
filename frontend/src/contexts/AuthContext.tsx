import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials, userType: 'tourist' | 'guide' | 'admin') => Promise<boolean>;
  register: (data: RegisterData, userType: 'tourist' | 'guide' | 'admin') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials, userType: 'tourist' | 'guide' | 'admin'): Promise<boolean> => {
    try {
      setIsLoading(true);
      let response;

      switch (userType) {
        case 'tourist':
          response = await authAPI.loginTourist(credentials);
          break;
        case 'guide':
          response = await authAPI.loginGuide(credentials);
          break;
        case 'admin':
          response = await authAPI.loginAdmin(credentials);
          break;
        default:
          throw new Error('Invalid user type');
      }

      const { token: newToken } = response.data;
      
      // Decode token to get user info
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      const userData: User = {
        id: payload.tourist_id || payload.guides_id || payload.admin_id,
        name: '', // Will be fetched separately if needed
        email: payload.email,
        role: payload.role,
      };

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Login failed';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData, userType: 'tourist' | 'guide' | 'admin'): Promise<boolean> => {
    try {
      setIsLoading(true);
      let response;

      switch (userType) {
        case 'tourist':
          response = await authAPI.registerTourist(data);
          break;
        case 'guide':
          response = await authAPI.registerGuide(data);
          break;
        case 'admin':
          response = await authAPI.createAdmin(data);
          break;
        default:
          throw new Error('Invalid user type');
      }

      toast.success('Registration successful! Please login.');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Registration failed';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
