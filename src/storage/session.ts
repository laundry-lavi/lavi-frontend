import AsyncStorage from '@react-native-async-storage/async-storage';

// Defina as chaves em constantes para evitar erros de digitação no futuro
export const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER_TYPE: '@user_type',
};

export const saveCustomerSession = async (token: string) => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.TOKEN, token],
      [STORAGE_KEYS.USER_TYPE, 'customer'],
    ]);
    
    console.log('✅ Sessão de cliente salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar sessão no AsyncStorage:', error);
    throw new Error('Falha ao salvar dados locais.');
  }
};

export const saveMemberSession = async (token: string) => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.TOKEN, token],
      [STORAGE_KEYS.USER_TYPE, 'member'],
    ]);
    
    console.log('Sessão de membro salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar sessão no AsyncStorage:', error);
    throw new Error('Falha ao salvar dados locais.');
  }
};