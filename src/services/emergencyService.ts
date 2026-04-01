import api from '../lib/api';

export interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface EmergencyResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface Location {
  latitude: number;
  longitude: number;
}

const emergencyService = {
  triggerEmergency: async (location?: Location): Promise<EmergencyResponse> => {
    try {
      const response = await api.post('/emergency/trigger', { location });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Error triggering emergency' };
    }
  },

  getNearbyHospitals: async (latitude: number, longitude: number): Promise<any[]> => {
    try {
      const response = await api.get(`/emergency/nearby-hospitals?lat=${latitude}&lng=${longitude}`);
      return response.data.hospitals || [];
    } catch (error: any) {
      throw error.response?.data || { message: 'Error fetching nearby hospitals' };
    }
  },

  getContacts: async (): Promise<EmergencyContact[]> => {
    try {
      const response = await api.get('/emergency/contacts');
      return response.data.contacts || [];
    } catch (error: any) {
      throw error.response?.data || { message: 'Error fetching emergency contacts' };
    }
  },

  // Get user's current location
  getCurrentLocation: (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Error getting location: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }
};

export default emergencyService;
