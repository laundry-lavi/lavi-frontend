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

  const authenticateMember = (email: string, password: string): boolean => {
    fetch(
      "https://illuminational-earlene-incoherently.ngrok-free.dev/members/auth",
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
        console.log(data);
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
    authenticateMember,
  };

  return (
    <AuthenticationContext.Provider value={values}>
      {children}
    </AuthenticationContext.Provider>
  );
};
