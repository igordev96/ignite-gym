import { createContext, useEffect, useState } from 'react';
import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';
import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storageUser';
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken';

export interface ISignInResponse {
  user: UserDTO;
  token: string;
  refresh_token: string;
}

export interface IAuthContextProvider {
  children: React.ReactNode;
}

export interface IAuthContextData {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (val: UserDTO) => Promise<void>;
  isLoadingUserStorageData: boolean;
}

export const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export function AuthContextProvider(props: IAuthContextProvider) {
  const { children } = props;
  const [user, setUser] = useState({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  const updateUserAndToken = (userData: UserDTO, token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const updateUserProfile = async (userUpdated: UserDTO) => {
    try {
      await storageUserSave(userUpdated);
      setUser(userUpdated);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post<ISignInResponse>('/sessions', { email, password });

      if (data.user && data.token && data.refresh_token) {
        setIsLoadingUserStorageData(true);
        await storageUserSave(data.user);
        await storageAuthTokenSave(data.token, data.refresh_token);

        updateUserAndToken(data.user, data.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const loadUserData = async () => {
    try {
      setIsLoadingUserStorageData(true);
      const loggedUser = await storageUserGet();
      const userToken = await storageAuthTokenGet();

      if (!!Object.keys(loggedUser).length && !!userToken) {
        updateUserAndToken(loggedUser, userToken.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoadingUserStorageData(true);
      await updateUserAndToken({} as UserDTO, '');
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(logout);

    return () => {
      subscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, logout, isLoadingUserStorageData, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
