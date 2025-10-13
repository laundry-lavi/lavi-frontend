export interface LaundryFormData {
  name: string;
  email: string;
  doc: string;
  cep: string;
  city: string;
  neighborhood: string;
  address: string;
  accountNumber: string;
  accountType: string;
  bankAgency: string;
  bankCode: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  coordinates: { lat: string; lng: string };
}

export interface UserFormData {
  name: string;
  lastName: string;
  email: string;
  cep: string;
  city: string;
  neighborhood: string;
  address: string;
  birthDate: string;
  gender: string;
  doc: string;
  isPj: boolean;
}

export interface OwnerFormData {
  name: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}
