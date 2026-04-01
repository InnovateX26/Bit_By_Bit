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
const LOCAL_ACCOUNTS_KEY = 'carebot_local_accounts_v1';

type LocalAccount = {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    location?: string;
    avatar?: string;
  };
};

const isNetworkError = (error: any) =>
  error?.code === 'NETWORK_ERROR' ||
  error?.code === 'ERR_NETWORK' ||
  error?.message?.includes('Network Error') ||
  error?.message?.includes('fetch') ||
  error?.message?.includes('ECONNREFUSED') ||
  (error?.response && error?.response?.status >= 400 && !error?.response?.data?.error);

const getLocalAccounts = (): LocalAccount[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setLocalAccounts = (accounts: LocalAccount[]) => {
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
};

const makeToken = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

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

      // Check if user is logged in natively on app start
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify token is still valid
          authAPI.getProfile().catch(() => {
            // Keep local session if backend is unavailable
            const fallbackUser = localStorage.getItem('user');
            if (!fallbackUser) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          });
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
      
      // Local fallback when backend is unavailable
      if (isNetworkError(error)) {
        const account = getLocalAccounts().find(
          (a) =>
            (a.email === emailOrMobile || a.mobileNumber === emailOrMobile) &&
            a.password === password
        );
        if (!account) {
          throw new Error('Invalid credentials.');
        }
        const localUser = {
          id: account.id,
          fullName: account.fullName,
          email: account.email,
          mobileNumber: account.mobileNumber,
          profile: account.profile || {},
        };
        localStorage.setItem('token', makeToken());
        localStorage.setItem('user', JSON.stringify(localUser));
        setUser(localUser);
        return;
      }
      
      // Handle API errors
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      // Handle other errors
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
      
      // Local fallback when backend is unavailable
      if (isNetworkError(error)) {
        const accounts = getLocalAccounts();
        const exists = accounts.some(
          (a) => a.email === userData.email || a.mobileNumber === userData.mobileNumber
        );
        if (exists) {
          throw new Error('User already exists with this email or mobile number.');
        }

        const names = userData.fullName.trim().split(/\s+/);
        const newAccount: LocalAccount = {
          id: `local_user_${Date.now()}`,
          fullName: userData.fullName.trim(),
          email: userData.email.trim(),
          mobileNumber: userData.mobileNumber.trim(),
          password: userData.password,
          profile: {
            firstName: names[0] || '',
            lastName: names.slice(1).join(' ') || '',
            location: '',
          },
        };
        accounts.push(newAccount);
        setLocalAccounts(accounts);

        const localUser = {
          id: newAccount.id,
          fullName: newAccount.fullName,
          email: newAccount.email,
          mobileNumber: newAccount.mobileNumber,
          profile: newAccount.profile || {},
        };
        localStorage.setItem('token', makeToken());
        localStorage.setItem('user', JSON.stringify(localUser));
        setUser(localUser);
        return;
      }
      
      // Handle API errors
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      // Handle other errors
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
      // Local fallback when backend is unavailable
      if (isNetworkError(error) && user) {
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        const accounts = getLocalAccounts();
        const index = accounts.findIndex((a) => a.id === user.id);
        if (index !== -1) {
          accounts[index] = {
            ...accounts[index],
            fullName: (updatedUser as any).fullName || accounts[index].fullName,
            email: (updatedUser as any).email || accounts[index].email,
            mobileNumber: (updatedUser as any).mobileNumber || accounts[index].mobileNumber,
            profile: (updatedUser as any).profile || accounts[index].profile,
          };
          setLocalAccounts(accounts);
        }
        return;
      }
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
