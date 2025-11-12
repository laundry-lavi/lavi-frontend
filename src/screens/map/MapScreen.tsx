// MapScreen.tsx (Versão Corrigida)

import React, { useEffect, useState, useContext, useRef } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";

// --- IMPORTAÇÕES CORRIGIDAS ---
import { Header } from "@/components";
// Importa o componente default e a tipagem nomeada diretamente do arquivo
import BottomSheet, { BottomSheetRef } from "@/components/BottomSheet";
import { LocationContext, LaundriesListContext } from "@/contexts";

export default function Map() {
  const { location } = useContext(LocationContext);
  const { laundriesList, getLaundriesList } = useContext(LaundriesListContext);
  const [selectedLaundryId, setSelectedLaundryId] = useState<string | null>(
    null
  );

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  useEffect(() => {
    if (location) {
      getLaundriesList();
    }
  }, []);

  const handleMarkerPress = (laundryId: string) => {
    setSelectedLaundryId(laundryId);
    bottomSheetRef.current?.open();
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
      >
        {laundriesList.map((laundry) => (
          <Marker
            key={laundry.id}
            coordinate={{
              latitude: Number(laundry.latitude),
              longitude: Number(laundry.longitude),
            }}
            onPress={() => handleMarkerPress(laundry.id)}
            pinColor={selectedLaundryId === laundry.id ? "blue" : "red"}
          />
        ))}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        laundriesList={laundriesList}
        selectedLaundryId={selectedLaundryId}
      />
    </View>
  );
}
