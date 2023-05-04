import { TouchableOpacity } from 'react-native';
import { HStack, Heading, Text, VStack, Icon, View } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { UserPhoto } from './UserPhoto';
import { useAuth } from '@hooks/useAuth';
import { createAvatar } from '@dicebear/core';
import { adventurerNeutral } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import { api } from '@services/api';

export function HomeHeader() {
  const { user, logout } = useAuth();

  const seedAvatar = createAvatar(adventurerNeutral, {
    seed: user?.name ?? 'default',
  });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <HStack bgColor='gray.600' pt='16' pb='5' px='8' alignItems='center'>
      {user?.avatar ? (
        <UserPhoto
          size={16}
          mr={4}
          source={{ uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }}
          alt='profile picture'
        />
      ) : (
        <View
          overflow='hidden'
          width={16}
          height={16}
          mr={4}
          rounded='full'
          borderWidth='2'
          borderBottomColor='gray.400'
        >
          <SvgXml width='100%' height='100%' xml={seedAvatar.toString()} />
        </View>
      )}
      <VStack flex={1}>
        <Text fontSize='md' color='gray.100'>
          Hi,
        </Text>
        <Heading fontFamily='heading' fontSize='md' color='gray.100'>
          {user?.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleLogout}>
        <Icon as={MaterialIcons} name='logout' color='gray.200' size='7' />
      </TouchableOpacity>
    </HStack>
  );
}
