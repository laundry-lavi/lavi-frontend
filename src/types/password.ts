// Tipos para componentes de senha
export interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
}

export type PasswordVisibilityState = {
  isVisible: boolean;
  iconName: "eye" | "eye-off";
};
