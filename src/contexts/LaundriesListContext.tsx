// LaundriesListContext.tsx (Versão Otimizada)

import React, { createContext, useState, useContext } from "react";
import { distance, getFeedbacks } from "@/functions"; // Supondo que suas funções estejam aqui
import { LocationContext } from "./LocationContext";
import { API_URL } from "@/constants/backend";

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
  const { location } = useContext(LocationContext);

  async function fetchRating(laundryId: string) {
    try {
      const feedbacks = await getFeedbacks(laundryId, 1, 1000);
      if (!feedbacks || feedbacks.length === 0) {
        return [];
      }
      const feedbacksRating = feedbacks.map(
        (feedback) => feedback.feedbackPost.rate
      );
      return feedbacksRating;
    } catch (error) {
      console.error("Error fetching rating:", error);
      return [];
    }
  }

  const getLaundriesList = async () => {
    if (!location) return; // Garante que a localização do usuário exista

    try {
      const response = await fetch(
        `${API_URL}/laundries/search/{name}`
      );
      const data = await response.json();

      // 1. Processa todas as lavanderias em paralelo
      const processedLaundries = await Promise.all(
        data.laundries.map(async (laundry: any) => {
          const dist = await distance({
            lat1: location.coords.latitude.toString(),
            lng1: location.coords.longitude.toString(),
            lat2: laundry.latitude.toString(),
            lng2: laundry.longitude.toString(),
          });
          const rating = await fetchRating(laundry.id);

          return {
            ...laundry,
            distance: dist?.distance, // ex: 2.5 (km)
            duration: dist?.duration, // ex: "15 min"
            grade: rating,
          };
        })
      );

      // 2. Ordena a lista pela distância (do menor para o maior)
      processedLaundries.sort((a, b) => a.distance - b.distance);

      // 3. Atualiza o estado uma única vez com a lista completa e ordenada
      setLaundriesList(processedLaundries);
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
