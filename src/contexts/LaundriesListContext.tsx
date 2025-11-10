import React, { createContext, useState } from "react";

import { distance, getFeedbacks } from "@/functions";
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

  async function fetchRating(laundryId: string) {
    const feedbacks = await getFeedbacks(laundryId, 1, 1000);
    const feedbacksRating = feedbacks.map((feedback) => {
      return feedback.feedbackPost.rate;
    });
    return feedbacksRating;
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
        const grade = await fetchRating(laundry.id);

        setLaundriesList((prev) => [
          ...prev,
          {
            ...laundry,
            distance: dist?.distance,
            duration: dist?.duration,
            grade: grade,
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
