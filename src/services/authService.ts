import api from '../lib/api';

export interface SignupData {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  emailOrMobile: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

export interface ProfileData {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  location?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    age?: number;
    gender?: string;
    bloodGroup?: string;
    allergies?: string[];
    chronicConditions?: string[];
    location?: string;
    avatar?: string;
  };
  emergencyContacts?: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  preferences?: {
    language?: string;
    notifications?: boolean;
    dataPrivacy?: string;
  };
}

const authService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/signup', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred during signup' };
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Error fetching profile' };
    }
  },

  updateProfile: async (data: ProfileData) => {
    try {
      const response = await api.put('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Error updating profile' };
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
