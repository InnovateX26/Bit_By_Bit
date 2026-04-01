"use client";
import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Sign up
  signup: async (userData: {
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Login
  login: async (credentials: {
    emailOrMobile: string;
    password: string;
  }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: {
    fullName?: string;
    email?: string;
    mobileNumber?: string;
    location?: string;
  }) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },
};

// Chat API functions
export const chatAPI = {
  sendMessage: async (message: string, sessionId?: string) => {
    const response = await api.post('/chat/message', { message, sessionId });
    return response.data;
  },

  getHistory: async (sessionId: string) => {
    const response = await api.get(`/chat/history/${sessionId}`);
    return response.data;
  },
};

// Emergency API functions
export const emergencyAPI = {
  triggerEmergency: async (location?: { latitude: number; longitude: number }) => {
    const response = await api.post('/emergency/trigger', { location });
    return response.data;
  },

  getNearbyHospitals: async (latitude: number, longitude: number) => {
    const response = await api.get(`/emergency/nearby-hospitals?lat=${latitude}&lng=${longitude}`);
    return response.data;
  },

  getContacts: async () => {
    const response = await api.get('/emergency/contacts');
    return response.data;
  },
};

// Hospital API functions
export const hospitalAPI = {
  getAllHospitals: async () => {
    const response = await api.get('/hospitals');
    return response.data;
  },

  getHospitalById: async (id: string) => {
    const response = await api.get(`/hospitals/${id}`);
    return response.data;
  },

  getNearby: async (latitude: number, longitude: number) => {
    const response = await api.get(`/hospitals/nearby?lat=${latitude}&lng=${longitude}`);
    return response.data;
  },

  createHospital: async (hospitalData: any) => {
    const response = await api.post('/hospitals', hospitalData);
    return response.data;
  },

  updateHospital: async (id: string, hospitalData: any) => {
    const response = await api.put(`/hospitals/${id}`, hospitalData);
    return response.data;
  },

  deleteHospital: async (id: string) => {
    const response = await api.delete(`/hospitals/${id}`);
    return response.data;
  },
};

export const pharmacyAPI = {
  getNearby: async (latitude: number, longitude: number) => {
    const response = await api.get(`/pharmacies/nearby?latitude=${latitude}&longitude=${longitude}`);
    return response.data;
  },
};

export default api;
