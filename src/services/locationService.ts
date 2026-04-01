"use client";
import api from "../lib/api"; // [FIX] Using the central API client now

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  distance?: number;
  latitude: number;
  longitude: number;
  specialties?: string[];
  emergency?: boolean;
  website?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  distance?: number;
  latitude: number;
  longitude: number;
  open24Hours?: boolean;
  website?: string;
}

export class LocationService {
  static async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation is not supported by this browser."));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        (error) => reject(new Error(`Geolocation error: ${error.message}`)),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    });
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static async getNearbyHospitals(
    location: Location,
    radius: number = 10000 // radius in meters
  ): Promise<Hospital[]> {
    try {
      // [FIX] Using the central 'api' client to make an authenticated request to the correct backend endpoint.
      const response = await api.get('/hospitals/nearby', {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius,
        }
      });

      if (response.data.success) {
        return response.data.data.map((hospital: any) => ({
          ...hospital,
          id: hospital._id,
          address: hospital.address?.street || 'Address not available',
          latitude: hospital.location.coordinates[1],
          longitude: hospital.location.coordinates[0],
          distance: this.calculateDistance(
            location.latitude,
            location.longitude,
            hospital.location.coordinates[1],
            hospital.location.coordinates[0]
          )
        })).sort((a: Hospital, b: Hospital) => (a.distance || 0) - (b.distance || 0));
      }
      throw new Error(response.data.message || 'Failed to fetch hospitals');
    } catch (error) {
      console.error('Failed to fetch hospitals from backend, falling back to mock data:', error);
      return []; // Return empty array on failure
    }
  }

  static async getNearbyPharmacies(
    location: Location,
    radius: number = 5000
  ): Promise<Pharmacy[]> {
     // NOTE: The backend does not currently have a dedicated pharmacy endpoint.
     // This service will use mock data as a fallback.
     console.warn('Backend pharmacy endpoint is not implemented. Using mock data.');
     
     const mockPharmacies: Pharmacy[] = [
         { id: "1", name: "Mock HealthPlus Pharmacy", address: "321 Medicine Lane, City Center", rating: 4.3, latitude: location.latitude + 0.008, longitude: location.longitude + 0.005, open24Hours: true },
         { id: "2", name: "Mock QuickCare Pharmacy", address: "654 Drug Street, Downtown", rating: 4.1, latitude: location.latitude - 0.003, longitude: location.longitude + 0.012, open24Hours: false },
     ];
     return mockPharmacies.map(p => ({ ...p, distance: this.calculateDistance(location.latitude, location.longitude, p.latitude, p.longitude) }))
        .filter(p => p.distance! <= radius / 1000)
        .sort((a, b) => a.distance! - b.distance!);
  }

  static getGoogleMapsUrl(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  static getGoogleMapsDirectionsUrl(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): string {
    return `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`;
  }
}