import { Feedback } from "@/types/";

export default async function getFeedbacks(
  laundryId: string,
  page: number = 1 // Adiciona o parâmetro de página com valor padrão 1
): Promise<Feedback[]> {
  // Retorna um array vazio se o laundryId não for válido
  if (!laundryId) {
    return [];
  }

  const response = await fetch(
    `https://illuminational-earlene-incoherently.ngrok-free.dev/feedbacks/${laundryId}?page=${page}&pageSize=10`
  );

  // Adiciona um tratamento de erro básico
  if (!response.ok) {
    console.error("Falha ao buscar feedbacks:", response.status);
    return [];
  }

  const data = await response.json();
  return data.feedbacks || []; // Retorna um array vazio se 'feedbacks' não existir
}
