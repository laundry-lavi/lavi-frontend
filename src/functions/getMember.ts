import { API_URL } from "@/constants/backend";

export default async function getMember(email: string) {
  const response = await fetch(
    `${API_URL}/public/members`
  );
  const data = await response.json();
  const member = await data.members.find((m: any) => m.email === email);
  return member;
}
