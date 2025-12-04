import AsyncStorage from "@react-native-async-storage/async-storage";

// Defina as chaves em constantes para evitar erros de digitação no futuro
export const STORAGE_KEYS = {
  TOKEN: "@auth_token",
  USER_TYPE: "@user_type",
};

export const saveCustomerSession = async (token: string) => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.TOKEN, token],
      [STORAGE_KEYS.USER_TYPE, "customer"],
    ]);

    console.log("✅ Sessão de cliente salva com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar sessão no AsyncStorage:", error);
    throw new Error("Falha ao salvar dados locais.");
  }
};

export const saveMemberSession = async (token: string) => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.TOKEN, token],
      [STORAGE_KEYS.USER_TYPE, "member"],
    ]);

    console.log("Sessão de membro salva com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar sessão no AsyncStorage:", error);
    throw new Error("Falha ao salvar dados locais.");
  }
};

interface SessionData {
  token: string | null;
  userType: string | null;
}

export const getSession = async (): Promise<SessionData> => {
  try {
    // O multiGet retorna um array de arrays: [ ['key1', 'val1'], ['key2', 'val2'] ]
    const values = await AsyncStorage.multiGet([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.USER_TYPE,
    ]);

    const token = values[0][1];
    const userType = values[1][1];

    return { token, userType };
  } catch (error) {
    console.error("Erro ao buscar sessão:", error);
    return { token: null, userType: null };
  }
};

export const clearSession = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.USER_TYPE,
    ]);
  } catch (error) {
    console.error("Erro ao limpar sessão:", error);
  }
};