export default async function getLaundry(id: string) {
  const response = await fetch(
    `https://illuminational-earlene-incoherently.ngrok-free.dev/members/${id}/laundries`
  );
  const data = await response.json();
  const fetchLaundryDetails = await fetch(
    `https://illuminational-earlene-incoherently.ngrok-free.dev/public/laundries/${data.laundries[0].id}`
  );
  const laundryDetails = await fetchLaundryDetails.json();
  return laundryDetails.laundry;
}
