import { Slice } from "react-native-pie-chart";
import { Feedback, FeedbackPost, ChartData } from "@/types/";

export default function generateChartDataFromFeedbacks(
  feedbacks: Feedback[]
): ChartData {
  // Se não houver feedbacks, retorna um estado vazio para o gráfico
  if (!feedbacks || feedbacks.length === 0) {
    return {
      series: [{ value: 1, color: "#E0E0E0" }], // Cor cinza para indicar "sem dados"
      legendData: [{ name: "Sem avaliações", value: "0", color: "#E0E0E0" }],
    };
  }

  const starCounts: { [key: number]: number } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // Itera sobre os feedbacks e conta a ocorrência de cada avaliação (rate)
  feedbacks.forEach((feedback) => {
    const rate = feedback.feedbackPost.rate;
    if (rate >= 1 && rate <= 5) {
      starCounts[rate]++;
    }
  });

  const totalReviews = feedbacks.length;
  const colors: { [key: number]: string } = {
    1: "#4B2D6B", // Roxo bem escuro
    2: "#6A3E9A", // Roxo escuro
    3: "#8A63D2", // Roxo médio
    4: "#B19CD9", // Roxo pastel claro
    5: "#E6D4F2", // Roxo bem claro (lavanda)
  };

  const series: Slice[] = [];
  const legendData: { name: string; value: string; color: string }[] = [];

  // Monta os dados para o gráfico e legenda, começando das 5 estrelas
  for (let stars = 5; stars >= 1; stars--) {
    const count = starCounts[stars];
    if (count > 0) {
      series.push({
        value: count,
        color: colors[stars],
      });
      legendData.push({
        name: `${stars} Estrela${stars > 1 ? "s" : ""}`,
        value: `${count} / ${totalReviews}`,
        color: colors[stars],
      });
    }
  }

  return { series, legendData };
}
