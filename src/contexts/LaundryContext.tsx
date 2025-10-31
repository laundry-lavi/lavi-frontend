import { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LaundryData = {
  ownerId: string | undefined;
  laundry: {
    name: string;
    email: string;
    profile_url: string | null;
    cnpj: string;
    address: string;
    latitude: string;
    longitude: string;
    bank_code: string;
    bank_agency: string;
    account_number: string;
    account_type: string;
    type: string;
    opening: string;
  };
};

type LaundryContextType = {
  laundryData: LaundryData | null;
  setLaundryData: (data: LaundryData | null) => void;
  clearLaundryData: () => void;
};

export const LaundryContext = createContext<LaundryContextType>({
  laundryData: null,
  setLaundryData: () => {},
  clearLaundryData: () => {},
});

export const LaundryProvider = ({ children }: { children: ReactNode }) => {
  const [laundryData, setLaundryDataState] = useState<LaundryData | null>(null);

  useEffect(() => {
    const loadLaundryData = async () => {
      const data = await AsyncStorage.getItem("laundryData");
      if (data) {
        setLaundryDataState(JSON.parse(data));
      }
    };
    loadLaundryData();
  }, []);

  const setLaundryData = async (data: LaundryData | null) => {
    if (data) {
      await AsyncStorage.setItem("laundryData", JSON.stringify(data));
    } else {
      await AsyncStorage.removeItem("laundryData");
    }
    setLaundryDataState(data);
  };

  const clearLaundryData = async () => {
    await AsyncStorage.removeItem("laundryData");
    setLaundryDataState(null);
  };

  return (
    <LaundryContext.Provider
      value={{ laundryData, setLaundryData, clearLaundryData }}
    >
      {children}
    </LaundryContext.Provider>
  );
};
