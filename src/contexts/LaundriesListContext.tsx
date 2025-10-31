import React, { createContext, useState } from "react";

import { distance } from "@/functions";
import { LocationContext } from "./LocationContext";

export const LaundriesListContext = createContext({
  laundriesList: [] as any[],
  getLaundriesList: async () => {},
});

export function LaundriesListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [laundriesList, setLaundriesList] = useState<any[]>([]);
  const { location } = React.useContext(LocationContext);

  function gerarNumeroAleatorio() {
    let numero = Math.random() * 5;
    return Number(numero.toFixed(1));
  }

  const getLaundriesList = async () => {
    try {
      setLaundriesList([]);
      const response = await fetch(
        "https://illuminational-earlene-incoherently.ngrok-free.dev/laundries/search/{name}"
      );

      const data = await response.json();

      for (const laundry of data.laundries) {
        const dist = await distance({
          lat1: location.coords.latitude.toString(),
          lng1: location.coords.longitude.toString(),
          lat2: laundry.latitude.toString(),
          lng2: laundry.longitude.toString(),
        });

        setLaundriesList((prev) => [
          ...prev,
          {
            ...laundry,
            distance: dist?.distance,
            duration: dist?.duration,
            grade: [gerarNumeroAleatorio()],
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching laundries:", error);
    }
  };

  const contextValue = { laundriesList, getLaundriesList };

  return (
    <LaundriesListContext.Provider value={contextValue}>
      {children}
    </LaundriesListContext.Provider>
  );
}
