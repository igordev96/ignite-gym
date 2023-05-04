import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { HStack, Heading, Image, VStack, Text, Icon } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { api } from '@services/api';

export interface IExerciseCard extends TouchableOpacityProps {
  exercise: ExerciseDTO;
}

export function ExerciseCard(props: IExerciseCard) {
  const { exercise, ...rest } = props;

  return (
    <TouchableOpacity {...rest}>
      <HStack bg='gray.500' alignItems='center' p='2' pr='4' rounded='md' mb='3'>
        <Image
          mr='4'
          w='16'
          h='16'
          rounded='md'
          resizeMode='cover'
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}`,
          }}
          alt='one arm dumbbell row'
        />
        <VStack flex={1}>
          <Heading fontFamily='heading' fontSize='lg' color='white'>
            {exercise.name}
          </Heading>
          <Text numberOfLines={2} mt='1' fontSize='sm' color='gray.200'>
            {exercise.series} sets x {exercise.repetitions} reps
          </Text>
        </VStack>
        <Icon color='gray.300' name='chevron-thin-right' as={Entypo} />
      </HStack>
    </TouchableOpacity>
  );
}
