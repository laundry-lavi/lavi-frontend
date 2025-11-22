import { API_URL } from "@/constants/backend";

export default async function getLaundry(id: string) {
  const response = await fetch(
    `${API_URL}/members/${id}/laundries`
  );
  const data = await response.json();
  const fetchLaundryDetails = await fetch(
    `${API_URL}/public/laundries/${data.laundries[0].id}`
  );
  const laundryDetails = await fetchLaundryDetails.json();
  return laundryDetails.laundry;
}
