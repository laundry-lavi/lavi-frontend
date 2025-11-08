import { Slice } from "react-native-pie-chart";

export interface FeedbackPost {
  id: string;
  content: string;
  title: string;
  rate: number;
  created_at: string;
  laundryId: string;
  customerId: string;
}

export interface Feedback {
  feedbackPost: FeedbackPost;
  customerName: string;
  customerProfileUrl: string;
}

export interface ChartData {
  series: Slice[];
  legendData: {
    name: string;
    value: string;
    color: string;
  }[];
}
