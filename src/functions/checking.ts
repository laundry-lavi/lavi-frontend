import React, { SetStateAction, Dispatch } from "react";
import { LaundryFormData, UserFormData } from "@/types/";

type GenericFormData = LaundryFormData | UserFormData;

export default async function checkingCep(
  setFormData: Dispatch<SetStateAction<GenericFormData>>,
  cep: string
) {
  const cleanedCep = cep.replace(/\D/g, "");
  if (cleanedCep.length !== 8) return;

  try {
    const brasilApiResponse = await fetch(
      `https://brasilapi.com.br/api/cep/v2/${cleanedCep}`
    );
    const brasilApiBody = await brasilApiResponse.json();
    if (brasilApiBody.city) {
      setFormData((prev) => ({
        ...prev,
        city: brasilApiBody.city,
        neighborhood: brasilApiBody.neighborhood,
        address: brasilApiBody.street,
      }));
    }

    const awesomeApiResponse = await fetch(
      `https://cep.awesomeapi.com.br/json/${cleanedCep}`
    );
    const awesomeApiBody = await awesomeApiResponse.json();
    if (awesomeApiBody.lat) {
      setFormData((prev) => ({
        ...prev,
        coordinates: { lat: awesomeApiBody.lat, lng: awesomeApiBody.lng },
      }));
    }
  } catch (err) {
    console.error("Failed to fetch CEP data:", err);
  }
}
