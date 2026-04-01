"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Phone, Star, Clock, ExternalLink, Navigation, MessageCircle, RefreshCw, User } from "lucide-react";
import { LocationService, Hospital, Pharmacy, Location } from "../services/locationService";
import Link from "next/link";

interface DashboardProps {
  userLocation?: Location;
}

const Dashboard: React.FC<DashboardProps> = ({ userLocation }) => {
  const [location, setLocation] = useState<Location | null>(userLocation || null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    if (location) {
      loadNearbyServices();
      getLocationName();
    } else {
      getCurrentLocation();
    }
  }, []);

  const getLocationName = async () => {
    if (!location) return;
    
    try {
      // Use reverse geocoding to get location name
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        setLocationName(`${data.city}, ${data.principalSubdivision}, ${data.countryName}`);
      }
    } catch (error) {
      console.log("Could not get location name, using coordinates");
      setLocationName(`Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentLocation = await LocationService.getCurrentLocation();
      setLocation(currentLocation);
      await loadNearbyServices(currentLocation);
      await getLocationName();
    } catch (err: any) {
      setError(err.message);
      console.error("Location error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyServices = async (loc?: Location) => {
    const currentLocation = loc || location;
    if (!currentLocation) return;

    setLoading(true);
    try {
      const [hospitalsData, pharmaciesData] = await Promise.all([
        LocationService.getNearbyHospitals(currentLocation),
        LocationService.getNearbyPharmacies(currentLocation),
      ]);
      setHospitals(hospitalsData);
      setPharmacies(pharmaciesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(LocationService.getGoogleMapsUrl(lat, lng), "_blank");
  };

  const getDirections = (lat: number, lng: number) => {
    if (location) {
      window.open(
        LocationService.getGoogleMapsDirectionsUrl(
          location.latitude,
          location.longitude,
          lat,
          lng
        ),
        "_blank"
      );
    }
  };

  if (loading && !location) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0c0966] mx-auto mb-4"></div>
          <p className="text-[#0c0966] font-medium">Getting your location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <MapPin className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Location Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={getCurrentLocation} variant="outline" className="border-[#0c0966] text-[#0c0966] hover:bg-[#6cf0f2]">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#6cf0f2] shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0c0966]">
            <MessageCircle className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/chat">
              <Button className="flex items-center gap-2 bg-[#6cf0f2] hover:bg-[#5ae0e2] text-black border-0 shadow-[0_0_15px_#6cf0f2]">
                <MessageCircle className="h-4 w-4" />
                Chat with Medical AI
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2 border-[#0c0966] text-[#0c0966] hover:bg-[#6cf0f2]">
              <MapPin className="h-4 w-4" />
              Find Emergency Services
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Location Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#6cf0f2] shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0c0966]">
            <MapPin className="h-5 w-5" />
            Your Current Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {location ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  📍 {locationName || `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Showing nearby hospitals and pharmacies within 10km radius
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    User-specific location
                  </span>
                  <span className="flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    Real-time detection
                  </span>
                </div>
              </div>
              <Button 
                onClick={getCurrentLocation} 
                variant="outline" 
                size="sm"
                className="border-[#0c0966] text-[#0c0966] hover:bg-[#6cf0f2]"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          ) : (
            <Button 
              onClick={getCurrentLocation} 
              className="w-full bg-[#6cf0f2] hover:bg-[#5ae0e2] text-black border-0 shadow-[0_0_15px_#6cf0f2]"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Get My Location
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Hospitals Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#6cf0f2] shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0c0966]">
            <MapPin className="h-5 w-5 text-red-500" />
            Nearby Hospitals ({hospitals.length} found)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0c0966] mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading hospitals...</p>
            </div>
          ) : hospitals.length > 0 ? (
            <div className="space-y-4">
              {hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white/60 backdrop-blur-sm border-[#6cf0f2]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-[#0c0966]">{hospital.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{hospital.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{hospital.address}</span>
                    </div>
                    
                    {hospital.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{hospital.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      <span className="font-medium text-[#0c0966]">{hospital.distance?.toFixed(1)} km away</span>
                    </div>
                    
                    {hospital.specialties && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hospital.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#6cf0f2] text-[#0c0966] text-xs rounded-full font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => openGoogleMaps(hospital.latitude, hospital.longitude)}
                      className="flex items-center gap-1 bg-[#6cf0f2] hover:bg-[#5ae0e2] text-black border-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Map
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => getDirections(hospital.latitude, hospital.longitude)}
                      className="flex items-center gap-1 border-[#0c0966] text-[#0c0966] hover:bg-[#6cf0f2]"
                    >
                      <Navigation className="h-4 w-4" />
                      Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No hospitals found nearby</p>
          )}
        </CardContent>
      </Card>

      {/* Pharmacies Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#6cf0f2] shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0c0966]">
            <MapPin className="h-5 w-5 text-green-500" />
            Nearby Pharmacies ({pharmacies.length} found)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0c0966] mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading pharmacies...</p>
            </div>
          ) : pharmacies.length > 0 ? (
            <div className="space-y-4">
              {pharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white/60 backdrop-blur-sm border-[#6cf0f2]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-[#0c0966]">{pharmacy.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{pharmacy.rating}</span>
                      {pharmacy.open24Hours && (
                        <div className="flex items-center gap-1 ml-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">24/7</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{pharmacy.address}</span>
                    </div>
                    
                    {pharmacy.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{pharmacy.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      <span className="font-medium text-[#0c0966]">{pharmacy.distance?.toFixed(1)} km away</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => openGoogleMaps(pharmacy.latitude, pharmacy.longitude)}
                      className="flex items-center gap-1 bg-[#6cf0f2] hover:bg-[#5ae0e2] text-black border-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Map
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => getDirections(pharmacy.latitude, pharmacy.longitude)}
                      className="flex items-center gap-1 border-[#0c0966] text-[#0c0966] hover:bg-[#6cf0f2]"
                    >
                      <Navigation className="h-4 w-4" />
                      Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No pharmacies found nearby</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
