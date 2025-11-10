import { Slice } from "react-native-pie-chart";

// Interface para cada imagem dentro de um feedback
export interface FeedbackImage {
  id: string;
  url: string;
  objectId: string;
  postId: string;
}

// Interface para o post do feedback
export interface FeedbackPost {
  id: string;
  content: string;
  title: string;
  rate: number;
  created_at: string;
  laundryId: string;
  customerId: string;
}

// Interface principal do Feedback, agora incluindo as imagens
export interface Feedback {
  feedbackPost: FeedbackPost;
  feedbackImages: FeedbackImage[]; // <--- ALTERAÇÃO PRINCIPAL AQUI
  customerName: string;
  customerProfileUrl: string;
}

// Interface para os dados do gráfico (sem alterações)
export interface ChartData {
  series: Slice[];
  legendData: {
    name: string;
    value: string;
    color: string;
  }[];
}
