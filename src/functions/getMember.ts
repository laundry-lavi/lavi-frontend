export default async function getMember(email: string) {
  const response = await fetch(
    "https://illuminational-earlene-incoherently.ngrok-free.dev/public/members"
  );
  const data = await response.json();
  const member = await data.members.find((m: any) => m.email === email);
  return member;
}
