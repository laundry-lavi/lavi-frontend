import { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OwnerData = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  memberId?: string;
  token?: string;
  role: string;
};

type OwnerContextType = {
  ownerData: OwnerData | null;
  setOwnerData: (data: OwnerData | null) => void;
  clearOwnerData: () => void;
};

export const OwnerContext = createContext<OwnerContextType>({
  ownerData: null,
  setOwnerData: () => {},
  clearOwnerData: () => {},
});

export const OwnerProvider = ({ children }: { children: ReactNode }) => {
  const [ownerData, setOwnerDataState] = useState<OwnerData | null>(null);

  useEffect(() => {
    const loadOwnerData = async () => {
      const data = await AsyncStorage.getItem("ownerData");
      if (data) {
        setOwnerDataState(JSON.parse(data));
      }
    };
    loadOwnerData();
  }, []);

  const setOwnerData = async (data: OwnerData | null) => {
    if (data) {
      await AsyncStorage.setItem("ownerData", JSON.stringify(data));
    } else {
      await AsyncStorage.removeItem("ownerData");
    }
    setOwnerDataState(data);
  };

  const clearOwnerData = async () => {
    await AsyncStorage.removeItem("ownerData");
    setOwnerDataState(null);
  };

  return (
    <OwnerContext.Provider value={{ ownerData, setOwnerData, clearOwnerData }}>
      {children}
    </OwnerContext.Provider>
  );
};
