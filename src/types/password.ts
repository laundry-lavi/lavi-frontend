// Tipos para componentes de senha
export interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  style?: string;
}

export type PasswordVisibilityState = {
  isVisible: boolean;
  iconName: "eye" | "eye-off";
};
