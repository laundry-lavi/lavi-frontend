import { API_URL } from "@/constants/backend";
import { Laundry } from "@/types";

export default async function getLaundryById(
  laundryId: string
): Promise<Laundry> {
  const response = await fetch(
    `${API_URL}/public/laundries/${laundryId}`
  );

  const data = await response.json();

  return data.laundry;
}
