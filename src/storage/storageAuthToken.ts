import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_STORAGE } from '@storage/storageConfig';

export const storageAuthTokenSave = async (token: string, refresh_token: string) => {
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify({ token, refresh_token }));
};

export const storageAuthTokenGet = async () => {
  const stringifiedTokens = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);
  const tokensObject = stringifiedTokens ? await JSON.parse(stringifiedTokens) : {};

  return tokensObject;
};

export const storageAuthTokenRemove = async () => {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
};
