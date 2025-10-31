export interface Laundry {
  accountNumber: string;
  accountType: string;
  address: string;
  bankAgency: string;
  bankCode: string;
  cnpj: string;
  lat: string;
  lng: string;
  name: string;
  ownerId: string;
  type: "doméstica" | "industrial";
  profileUrl: string | null;
  grade: number[];
  distance: number;
  duration: number;
}
