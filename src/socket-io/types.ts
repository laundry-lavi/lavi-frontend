export type IoNotification = {
  title: string;
  content: string;
  type: "order-created" | "order-updated" | "notification";
  status: string;
  metadata: object;
};
