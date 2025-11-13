export type OrderType = {
  id?: string;
  created_at?: string;
  updated_at?: string | null;
  close_at?: string | null;
  total_inCents?: number;
  details: string;
  status: "PENDING" | "ONGOING" | "CONCLUDED";
  delivery_type: string;
  latitude: string;
  longitude: string;
  laundryId: string;
  customerId: string;
};

export type ItemType = {
  qntd: number;
  unitPrice_inCents: number;
  name: string;
  color: string;
  service: string;
};

export type CompletedOrderType = OrderType & { items: ItemType[] };
