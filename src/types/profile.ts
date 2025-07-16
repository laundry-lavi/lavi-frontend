import { ImageSourcePropType } from "react-native";

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
