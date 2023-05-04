import { Box, useTheme } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';
import { useAuth } from '@hooks/useAuth';
import { Loading } from '@components/Loading';

export function Routes() {
  const { user, isLoadingUserStorageData } = useAuth();

  const {
    colors: { gray },
  } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = gray[700];

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg='gray.700'>
      <NavigationContainer theme={theme}>
        {!!Object.keys(user).length ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
