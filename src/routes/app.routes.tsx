import { View } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from 'native-base';
import { Exercise } from '@screens/Exercise';
import { History } from '@screens/History';
import { Home } from '@screens/Home';
import { Profile } from '@screens/Profile';
import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';

const SmallContainer = ({
  focused,
  color,
  children,
}: {
  focused: boolean;
  color: string;
  children: JSX.Element;
}): JSX.Element => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: focused ? color : 'transparent',
      }}
    >
      {children}
    </View>
  );
};

type IAppRoutes = {
  home: undefined;
  history: undefined;
  profile: undefined;
  exercise: { exerciseId: number };
};

export type AppNavigatorRoutes = BottomTabNavigationProp<IAppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<IAppRoutes>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[8];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: 84,
        },
      }}
    >
      <Screen
        name='home'
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <SmallContainer focused={focused} color={color}>
              <HomeSvg width={iconSize} height={iconSize} fill={color} />
            </SmallContainer>
          ),
        }}
      />
      <Screen
        name='history'
        component={History}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <SmallContainer focused={focused} color={color}>
              <HistorySvg width={iconSize} height={iconSize} fill={color} />
            </SmallContainer>
          ),
        }}
      />
      <Screen
        name='profile'
        component={Profile}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <SmallContainer focused={focused} color={color}>
              <ProfileSvg width={iconSize} height={iconSize} fill={color} />
            </SmallContainer>
          ),
        }}
      />
      <Screen
        name='exercise'
        component={Exercise}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  );
}
