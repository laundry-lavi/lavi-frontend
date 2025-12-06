import React, { useState, useContext } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { BackArrow, Text } from "@/components";
import {
  CustomerContext,
  LaundryContext,
  OwnerContext,
  AuthenticationContext,
} from "@/contexts";

// NOVO: Objeto padrão para o estado inicial do formulário de Cliente
const defaultCustomerState = {
  id: "",
  name: "",
  email: "",
  address: "",
  cep: "",
  cpf: "",
  birthDate: "",
  gender: "",
  isPj: false,
  profileUrl: null,
  // Adicione quaisquer outras propriedades obrigatórias do seu tipo CustomerData
};

// NOVO: Objeto padrão para o estado inicial do formulário de Lavanderia
const defaultLaundryState = {
  id: "",
  name: "",
  email: "",
  cnpj: "",
  address: "",
  bank_code: "",
  bank_agency: "",
  account_number: "",
  account_type: "",
  // Inclua os campos não editáveis para manter a estrutura do tipo
  latitude: "",
  longitude: "",
  profile_url: null,
  type: "",
  opening: "",
};

// Componente reutilizável para os campos de input
const ProfileInput = ({ label, value, onChangeText, ...props }) => (
  <View className="mb-4">
    <Text className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
      {label}
    </Text>
    <TextInput
      className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-base text-gray-900 dark:text-white"
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  </View>
);

// --- Formulário Específico para Cliente ---
const CustomerProfileForm = ({
  formData,
  onInputChange,
}: {
  formData: any;
  onInputChange: any;
}) => (
  <View>
    <ProfileInput
      label="Nome Completo"
      value={formData.name}
      onChangeText={(text: any) => onInputChange("name", text)}
    />
    <ProfileInput
      label="Email"
      value={formData.email}
      onChangeText={(text: any) => onInputChange("email", text)}
      keyboardType="email-address"
      autoCapitalize="none"
    />
    <ProfileInput
      label="Endereço"
      value={formData.address}
      onChangeText={(text: any) => onInputChange("address", text)}
    />
    <ProfileInput
      label="CPF/CNPJ"
      value={formData.doc}
      onChangeText={(text: any) => onInputChange("doc", text)}
      keyboardType="numeric"
    />
    <ProfileInput
      label="Data de Nascimento (AAAA-MM-DD)"
      value={formData.birth_date}
      onChangeText={(text: any) => onInputChange("birth_date", text)}
    />
    {/* Adicione outros campos como gender, is_pj, profile_url se desejar que sejam editáveis */}
  </View>
);

// --- Formulário Específico para Lavanderia ---
const LaundryProfileForm = ({
  formData,
  onInputChange,
}: {
  formData: any;
  onInputChange: any;
}) => (
  <View>
    <ProfileInput
      label="Nome da Lavanderia"
      value={formData.name}
      onChangeText={(text: any) => onInputChange("name", text)}
    />
    <ProfileInput
      label="Email de Contato"
      value={formData.email}
      onChangeText={(text: any) => onInputChange("email", text)}
      keyboardType="email-address"
      autoCapitalize="none"
    />
    <ProfileInput
      label="CNPJ"
      value={formData.cnpj}
      onChangeText={(text: any) => onInputChange("cnpj", text)}
      keyboardType="numeric"
    />
    <ProfileInput
      label="Endereço Completo"
      value={formData.address}
      onChangeText={(text: any) => onInputChange("address", text)}
    />
    <Text className="text-lg font-bold text-gray-800 dark:text-white mt-6 mb-2">
      Dados Bancários
    </Text>
    <ProfileInput
      label="Código do Banco"
      value={formData.bank_code}
      onChangeText={(text: any) => onInputChange("bank_code", text)}
      keyboardType="numeric"
    />
    <ProfileInput
      label="Agência"
      value={formData.bank_agency}
      onChangeText={(text: any) => onInputChange("bank_agency", text)}
      keyboardType="numeric"
    />
    <ProfileInput
      label="Número da Conta"
      value={formData.account_number}
      onChangeText={(text: any) => onInputChange("account_number", text)}
      keyboardType="numeric"
    />
    <ProfileInput
      label="Tipo da Conta"
      value={formData.account_type}
      onChangeText={(text: any) => onInputChange("account_type", text)}
    />
  </View>
);

// --- TELA PRINCIPAL ---
export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const { customerData, setCustomerData } = useContext(CustomerContext);
  const { ownerData } = useContext(OwnerContext);
  const { isLaundry } = useContext(AuthenticationContext);
  const { laundryData, setLaundryData } = useContext(LaundryContext);

  const [formData, setFormData] = useState(
    isLaundry
      ? laundryData?.laundry || defaultLaundryState
      : customerData || defaultCustomerState
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    // CORREÇÃO 1: Adiciona uma verificação inicial para garantir que formData não é nulo/undefined
    if (!formData) {
      Alert.alert("Erro", "Os dados do formulário não foram carregados.");
      return;
    }

    setIsLoading(true);

    const id = isLaundry ? laundryData?.laundry?.id : customerData?.id;
    if (!id) {
      Alert.alert("Erro", "Não foi possível encontrar o ID do usuário.");
      setIsLoading(false);
      return;
    }

    const url = isLaundry
      ? `https://illuminational-earlene-incoherently.ngrok-free.dev/laundries/${id}`
      : `https://illuminational-earlene-incoherently.ngrok-free.dev/customer/${id}`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Falha ao salvar os dados.");
      }

      // Como a resposta é vazia, não tentamos mais usar `updatedData`.
      // Vamos atualizar os contextos com os dados que já temos no estado `formData`.

      if (isLaundry) {
        if (laundryData?.ownerId) {
          // CORREÇÃO 2: A forma mais limpa de atualizar. Usa o spread operator para
          // mesclar os dados originais com os novos dados do formulário.
          setLaundryData({
            ownerId: laundryData.ownerId,
            laundry: {
              ...laundryData.laundry, // Mantém dados antigos como lat/long
              ...formData, // Sobrescreve com os dados editados
            },
          });
        }
      } else {
        // CORREÇÃO DEFINITIVA: Construímos o novo objeto CustomerData explicitamente.
        // Isso garante que apenas as propriedades corretas sejam usadas e que todas as
        // propriedades obrigatórias do tipo `CustomerData` estejam presentes.
        if (customerData) {
          // Garante que temos um customerData base para mesclar
          const updatedCustomer = {
            ...customerData, // Começa com os dados antigos para não perder nada
            ...formData,
            // Adicione outras propriedades do formulário de cliente aqui
          };
          setCustomerData(updatedCustomer);
        }
      }

      Alert.alert("Sucesso!", "Seus dados foram atualizados.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <BackArrow />
      <View className="bg-[#2c003d] dark:bg-[#8313af] p-4 pt-3.5 pl-20">
        <View>
          <Text className="text-white text-2xl font-bold">Editar Perfil</Text>
          <Text className="text-gray-300 text-sm">
            Altere seus dados cadastrais
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {isLaundry ? (
          <LaundryProfileForm
            formData={formData}
            onInputChange={handleInputChange}
          />
        ) : (
          <CustomerProfileForm
            formData={formData}
            onInputChange={handleInputChange}
          />
        )}
      </ScrollView>

      <View className="p-5 border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={handleSaveChanges}
          disabled={isLoading}
          className="bg-purple-800 dark:bg-purple-600 rounded-lg p-4 items-center justify-center"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Salvar Alterações
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
