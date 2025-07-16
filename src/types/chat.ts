import { ImageSourcePropType } from "react-native";

export type ConversationStatus = "sent" | "delivered" | "read" | "pending";

export type Conversation = {
  id: string;
  name: string;
  avatarUrl: ImageSourcePropType;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: ConversationStatus;
  isActive: boolean;
};
