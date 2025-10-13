import { createContext, useState, Dispatch, SetStateAction } from "react";

type FormData = {
  name: string;
  email: string;
  cpf: string;
  password: string;
};

type OwnerContextType = {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
};

export const OwnerContext = createContext<OwnerContextType>({
  formData: {
    name: "",
    email: "",
    cpf: "",
    password: "",
  },
  setFormData: () => {},
});

export const OwnerProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cpf: "",
    password: "",
  });

  return (
    <OwnerContext.Provider value={{ formData, setFormData }}>
      {children}
    </OwnerContext.Provider>
  );
};
