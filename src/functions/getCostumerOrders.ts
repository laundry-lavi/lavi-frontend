import { CompletedOrderType, OrderType } from "@/types";
import { Alert } from "react-native";

export default async function getCostumerOrders(
  costumerId: string
): Promise<CompletedOrderType[]> {
  const response = await fetch(
    `https://illuminational-earlene-incoherently.ngrok-free.dev/customers/${costumerId}/orders`
  );

  if (!response.ok) {
    Alert.alert(
      "Houve um erro",
      "Ocorreu um erro no servidor, os seus pedidos não serão mostrados, tente novamente mais tarde."
    );
    return [];
  }
  const dataOrders = await response.json();
  const itemsPromise = await dataOrders.orders.map(async (ord: OrderType) => {
    const responseItems = await fetch(
      `https://illuminational-earlene-incoherently.ngrok-free.dev/orders/${ord.id}/items`
    );
    const dataItems = await responseItems.json();

    return {
      ...ord,
      items: dataItems,
    };
  });

  const completedOrders = await Promise.all(itemsPromise);

  return completedOrders;
}
