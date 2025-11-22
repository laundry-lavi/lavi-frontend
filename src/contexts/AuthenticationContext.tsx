import { API_URL } from "@/constants/backend";
import { createContext, useState } from "react";

export const AuthenticationContext = createContext({
  isLaundry: false,
  setIsLaundryTrue: () => {},
  setIsLaundryFalse: () => {},
  isGuest: false,
  setIsGuestTrue: () => {},
  setIsGuestFalse: () => {},
});

export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLaundry, setIsLaundry] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const setIsLaundryTrue = () => {
    setIsLaundry(true);
  };

  const setIsLaundryFalse = () => {
    setIsLaundry(false);
  };

  const setIsGuestTrue = () => {
    setIsGuest(true);
  };

  const setIsGuestFalse = () => {
    setIsGuest(false);
  };

  const authenticateMember = (email: string, password: string): boolean => {
    fetch(
      `${API_URL}/members/auth`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return true;
      })
      .catch((error) => {
        console.error("Erro ao autenticar:", error);
        return false;
      });
    return false;
  };

  const values = {
    isLaundry,
    setIsLaundryTrue,
    setIsLaundryFalse,
    isGuest,
    setIsGuestTrue,
    setIsGuestFalse,
    authenticateMember,
  };

  return (
    <AuthenticationContext.Provider value={values}>
      {children}
    </AuthenticationContext.Provider>
  );
};
