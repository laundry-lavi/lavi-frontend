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
}

export const laundrys: Laundry[] = [
  {
    name: "Lavanderia Lava-Rápido",
    type: "doméstica",
    grade: [4.5, 5.0, 4.2, 4.8, 3.9, 5.0, 4.6, 4.4, 4.7, 4.0],
    lat: "-23.6061106",
    lng: "-46.7634294",
    cnpj: "12.345.678/0001-10",
    address: "Rua das Flores, 123, Taboão da Serra - SP",
    bankCode: "341",
    bankAgency: "0123",
    accountNumber: "45678-9",
    accountType: "corrente",
    ownerId: "owner-abc-123",
    profileUrl: "https://example.com/profiles/lava-rapido",
  },
  {
    name: "Industrial Clean",
    type: "industrial",
    grade: [4.8, 5.0, 4.9, 4.7, 4.6, 5.0, 4.8, 4.9, 4.5, 4.7],
    lat: "-23.6061106",
    lng: "-44.7634294",
    cnpj: "23.456.789/0001-20",
    address: "Avenida Industrial, 500, Diadema - SP",
    bankCode: "237",
    bankAgency: "4567",
    accountNumber: "89012-3",
    accountType: "corrente",
    ownerId: "owner-def-456",
    profileUrl: null,
  },
  {
    name: "Lava & Leva Perto de Casa",
    type: "doméstica",
    grade: [4.2, 4.0, 3.8, 4.5, 4.1, 4.3, 5.0, 3.9, 4.0, 4.4],
    lat: "-21.6061106",
    lng: "-46.7634294",
    cnpj: "34.567.890/0001-30",
    address: "Rua da Vizinhança, 45, Embu das Artes - SP",
    bankCode: "104",
    bankAgency: "8901",
    accountNumber: "23456-7",
    accountType: "poupança",
    ownerId: "owner-ghi-789",
    profileUrl: "https://example.com/profiles/lava-leva",
  },
  {
    name: "Mega Lavagem Industrial",
    type: "industrial",
    grade: [4.9, 5.0, 5.0, 4.8, 4.9, 4.7, 5.0, 4.9, 4.8, 5.0],
    lat: "-23.2061106",
    lng: "-46.3634294",
    cnpj: "45.678.901/0001-40",
    address: "Estrada dos Galpões, 1000, Guarulhos - SP",
    bankCode: "001",
    bankAgency: "2345",
    accountNumber: "67890-1",
    accountType: "corrente",
    ownerId: "owner-jkl-012",
    profileUrl: null,
  },
  {
    name: "Sua Roupa Limpa",
    type: "doméstica",
    grade: [4.0, 3.5, 4.2, 4.0, 3.8, 4.5, 3.9, 4.1, 4.3, 4.0],
    lat: "-23.6161106",
    lng: "-46.7234294",
    cnpj: "56.789.012/0001-50",
    address: "Travessa do Amaciante, 78, São Paulo - SP",
    bankCode: "341",
    bankAgency: "6789",
    accountNumber: "01234-5",
    accountType: "corrente",
    ownerId: "owner-mno-345",
    profileUrl: "https://example.com/profiles/sua-roupa-limpa",
  },
];
