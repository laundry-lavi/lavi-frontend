import React, { createContext, useState } from "react";
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";

export const LocationContext = createContext({});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationObject>({
    coords: {
      accuracy: 100,
      longitude: 0,
      altitude: 745.5999755859375,
      heading: 0,
      latitude: 0,
      altitudeAccuracy: 100,
      speed: 0,
    },
    mocked: false,
    timestamp: 1754479939608,
  });

  async function getCurrentLocation() {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let actualLocation = await getCurrentPositionAsync({});
    setLocation(actualLocation);
  }

  const contextValue = { location, getCurrentLocation };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}
