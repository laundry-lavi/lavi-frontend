import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

import { Text, Header, BottomSheet } from "@/components";

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject>({
    coords: {
      accuracy: 100,
      longitude: -46.7634294,
      altitude: 745.5999755859375,
      heading: 0,
      latitude: -23.6051106,
      altitudeAccuracy: 100,
      speed: 0,
    },
    mocked: false,
    timestamp: 1754479939608,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  return (
    <View className="flex-1">
      <Header />
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          key={1}
          coordinate={{
            latitude: -23.6061106,
            longitude: -46.7634294,
          }}
          icon={require("assets/laund176.png")}
        />
        <Marker
          key={2}
          coordinate={{
            latitude: -23.6561106,
            longitude: -46.7634294,
          }}
          icon={require("assets/laund176.png")}
        />
        <Marker
          key={3}
          coordinate={{
            latitude: -23.6161106,
            longitude: -46.7869294,
          }}
          icon={require("assets/laund176.png")}
        />
      </MapView>
      <BottomSheet />
    </View>
  );
}
