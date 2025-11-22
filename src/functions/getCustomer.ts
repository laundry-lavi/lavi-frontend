import { API_URL } from "@/constants/backend";
import { Alert } from "react-native";

export default async function getCustomer(email: string) {
  try {
    const idsResponse = await fetch(
      `${API_URL}/public/customers`
    );

    if (!idsResponse.ok) {
      console.log("Falha ao buscar IDs dos clientes. Status:", idsResponse);
      Alert.alert("Erro!", "Aguarde um momento e tente novamente.");
      return;
    }

    // array de IDs
    const idsData = await idsResponse.json();

    const customerPromises = idsData.ids.map(async (id: string) => {
      try {
        const customerResponse = await fetch(
          `${API_URL}/customer/${id}`
        );

        if (!customerResponse.ok) {
          console.warn(
            `Falha ao buscar cliente com ID: ${id}. Status: ${customerResponse.status}`
          );
          return null; // Retorna nulo para clientes que falharam
        }
        return customerResponse.json();
      } catch (error) {
        console.error(`Erro na requisição para o ID: ${id}`, error);
        return null; // Retorna nulo em caso de erro
      }
    });

    const customersResults = await Promise.all(customerPromises);

    // Filtra os resultados nulos antes de procurar o cliente
    const validCustomers = customersResults.filter((c) => c !== null);

    const customer = validCustomers.find((c) => c.customer.email === email);

    return customer;
  } catch (error) {
    console.error("Ocorreu um erro geral na função getCustomer:", error);
    Alert.alert("Erro", "Não foi possível buscar os dados dos clientes.");
  }
}
