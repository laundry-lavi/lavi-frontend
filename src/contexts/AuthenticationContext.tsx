import { createContext, useState } from "react";

export const AuthenticationContext = createContext({
  isLaundry: false,
  setIsLaundryTrue: () => {},
  setIsLaundryFalse: () => {},
});

export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLaundry, setIsLaundry] = useState(false);

  const setIsLaundryTrue = () => {
    setIsLaundry(true);
  };

  const setIsLaundryFalse = () => {
    setIsLaundry(false);
  };

  const values = {
    isLaundry,
    setIsLaundryTrue,
    setIsLaundryFalse,
  };

  return (
    <AuthenticationContext.Provider value={values}>
      {children}
    </AuthenticationContext.Provider>
  );
};
