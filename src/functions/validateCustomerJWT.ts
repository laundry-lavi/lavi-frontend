import { API_URL } from "@/constants/backend";

export const validateCustomerJWT = async (
  token: string
): Promise<string | undefined> => {
  try {
    const response = await fetch(`${API_URL}/customers/auth`, {
      method: "patch",
      body: JSON.stringify({
        token,
      }),
    });
    if (!response.ok) {
      console.log("Erro ao validar JWT de cliente.");
      return;
    }
    const body = await response.json();
    return body.payload.customerId as string;
  } catch (err) {
    console.error("Erro ao validar JWT do cliente");
    throw err;
  }
};
