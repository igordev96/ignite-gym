import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '@dtos/UserDTO';
import { USER_STORAGE } from '@storage/storageConfig';
import AppError from '@utils/AppError';

export const storageUserSave = async (user: UserDTO) => {
  try {
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
  } catch (error) {
    throw new AppError('Error while trying to save user');
  }
};

export const storageUserGet = async () => {
  try {
    const userStorage = await AsyncStorage.getItem(USER_STORAGE);
    const user: UserDTO = !!userStorage ? JSON.parse(userStorage) : {};

    return user;
  } catch (error) {
    throw new AppError('Error while trying to get user');
  }
};

export const storageUserRemove = async () => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE);
  } catch (error) {
    throw new AppError('Error while trying to log out user');
  }
};
