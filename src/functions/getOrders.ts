import { OrderType, ItemType, CompletedOrderType } from "@/types";

export default async function getOrders(
  laundryId: string
): Promise<CompletedOrderType[]> {
  const responseOrders = await fetch(
    `https://illuminational-earlene-incoherently.ngrok-free.dev/laundries/${laundryId}/orders?page=1&pageSize=1000`
  );
  const dataOrders = await responseOrders.json();

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
