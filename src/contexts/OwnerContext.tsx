import { createContext, useState, Dispatch, SetStateAction } from "react";

type OwnerData = {
  name: string;
  email: string;
  cpf: string;
  memberId: string;
  token?: string;
  role: string;
};

type OwnerContextType = {
  ownerData: OwnerData;
  setOwnerData: Dispatch<SetStateAction<OwnerData>>;
};

export const OwnerContext = createContext<OwnerContextType>({
  ownerData: {
    name: "",
    email: "",
    cpf: "",
    memberId: "",
    token: "",
    role: "",
  },
  setOwnerData: () => {},
});

export const OwnerProvider = ({ children }: { children: React.ReactNode }) => {
  const [ownerData, setOwnerData] = useState<OwnerData>({
    name: "",
    email: "",
    cpf: "",
    memberId: "",
    token: "",
    role: "",
  });

  return (
    <OwnerContext.Provider value={{ ownerData, setOwnerData }}>
      {children}
    </OwnerContext.Provider>
  );
};
