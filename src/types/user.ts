import { ImageSourcePropType } from "react-native";

export interface UserSignin {
  birthDate: string;
  doc: string;
  email: string;
  address: string;
  gender: string;
  isPj: boolean;
  name: string;
  password: string;
  profileUrl: string | null;
}

export interface UserLogin {
  email: string;
  password: string;
}

export type UserProfile = {
  name: string;
  joinDate: string;
  avatarUrl: ImageSourcePropType;
  email: string;
  phone: string;
  address: string;
};

export type Order = {
  id: string;
  laundryName: string;
  deliveryDate: string;
  status: string;
  totalValue: number;
};
