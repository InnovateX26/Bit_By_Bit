'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  profile: {
    firstName?: string;
    lastName?: string;
    location?: string;
    avatar?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrMobile: string, password: string) => Promise<void>;
  signup: (userData: {
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // First check NextAuth session (Google Login)
      try {
        const session = await getSession();
        if (session && session.user) {
          const names = session.user.name?.split(' ') || [];
          const nextAuthUser = {
            id: session.user.email || 'google_user',
            fullName: session.user.name || 'Google User',
            email: session.user.email || '',
            mobileNumber: '',
            profile: {
              firstName: names[0] || '',
              lastName: names.slice(1).join(' ') || '',
              avatar: session.user.image || '',
            }
          };
          setUser(nextAuthUser);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error fetching NextAuth session:', e);
      }

      // Check if user is logged in natively on app start via JWT
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          
          // Verify token is still valid with the real backend
          const profileData = await authAPI.getProfile().catch(() => null);
          if (profileData && profileData.user) {
            setUser({ ...JSON.parse(savedUser), ...profileData.user });
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(savedUser), ...profileData.user }));
          } else {
            // Token invalid or network down, clear session to force re-auth
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (emailOrMobile: string, password: string) => {
    try {
      const response = await authAPI.login({ emailOrMobile, password });
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  };

  const signup = async (userData: {
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await authAPI.signup(userData);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      } else {
        throw new Error(response.error || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(error.message || 'Signup failed. Please try again.');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    try {
      await signOut({ redirect: false });
    } catch(e) {}
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = { ...user, ...response.user };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
