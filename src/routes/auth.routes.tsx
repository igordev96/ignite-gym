import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SignIn } from '@screens/SignIn';
import { SignUp } from '@screens/SignUp';

type IAuthRoutes = {
  signIn: undefined;
  signUp: undefined;
};

export type AuthNavigatorRoutes = NativeStackNavigationProp<IAuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<IAuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name='signIn' component={SignIn} />
      <Screen name='signUp' component={SignUp} />
    </Navigator>
  );
}
