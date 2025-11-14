import { Laundry } from "@/types";

export default async function getLaundryById(
  laundryId: string
): Promise<Laundry> {
  const response = await fetch(
    `https://illuminational-earlene-incoherently.ngrok-free.dev/public/laundries/${laundryId}`
  );

  const data = await response.json();

  return data.laundry;
}
