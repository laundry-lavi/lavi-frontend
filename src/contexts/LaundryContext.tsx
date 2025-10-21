import { createContext, useState, Dispatch, SetStateAction } from "react";

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
  laundryData: LaundryData;
  setLaundryData: Dispatch<SetStateAction<LaundryData>>;
};

export const LaundryContext = createContext<LaundryContextType>({
  laundryData: {
    ownerId: "",
    laundry: {
      name: "",
      email: "",
      profile_url: "",
      cnpj: "",
      address: "",
      latitude: "",
      longitude: "",
      bank_code: "",
      bank_agency: "",
      account_number: "",
      account_type: "",
      type: "",
      opening: "",
    },
  },
  setLaundryData: () => {},
});

export const LaundryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [laundryData, setLaundryData] = useState<LaundryData>({
    ownerId: "",
    laundry: {
      name: "",
      email: "",
      profile_url: "",
      cnpj: "",
      address: "",
      latitude: "",
      longitude: "",
      bank_code: "",
      bank_agency: "",
      account_number: "",
      account_type: "",
      type: "",
      opening: "",
    },
  });

  return (
    <LaundryContext.Provider value={{ laundryData, setLaundryData }}>
      {children}
    </LaundryContext.Provider>
  );
};
