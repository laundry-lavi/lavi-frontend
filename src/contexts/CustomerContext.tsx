import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CustomerData = {
  id?: string;
  birthDate: string;
  address: string;
  gender: string;
  isPj: boolean;
  password: string;
  profileUrl: string | null;
  name: string;
  email: string;
  cpf: string;
  memberId?: string;
  token?: string;
  role: string;
};

type CustomerContextType = {
  customerData: CustomerData | null;
  setCustomerData: (data: CustomerData | null) => void;
  clearCustomerData: () => void;
};

export const CustomerContext = createContext<CustomerContextType>({
  customerData: null,
  setCustomerData: () => {},
  clearCustomerData: () => {},
});

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customerData, setCustomerDataState] = useState<CustomerData | null>(
    null
  );

  useEffect(() => {
    const loadCustomerData = async () => {
      const data = await AsyncStorage.getItem("customerData");
      if (data) {
        setCustomerDataState(JSON.parse(data));
      }
    };
    loadCustomerData();
  }, []);

  const setCustomerData = async (data: CustomerData | null) => {
    if (data) {
      await AsyncStorage.setItem("customerData", JSON.stringify(data));
    } else {
      await AsyncStorage.removeItem("customerData");
    }
    setCustomerDataState(data);
  };

  const clearCustomerData = async () => {
    await AsyncStorage.removeItem("customerData");
    setCustomerDataState(null);
  };

  return (
    <CustomerContext.Provider
      value={{ customerData, setCustomerData, clearCustomerData }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
