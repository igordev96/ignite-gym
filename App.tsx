import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { Loading } from '@components/Loading';
import { AuthContextProvider } from '@contexts/AuthContext';
import { Routes } from '@routes/index';
import { THEME } from './src/theme';

export default function App() {
  const [isLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <AuthContextProvider>
        {isLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
