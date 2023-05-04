import { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { HStack, Heading, Icon, Text, VStack, Image, Box, ScrollView, useToast } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { Button } from '@components/Button';
import { Loading } from '@components/Loading';
import { AppNavigatorRoutes } from '@routes/app.routes';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { api } from '@services/api';
import AppError from '@utils/AppError';
import BodySvg from '@assets/body.svg';
import RepsSvg from '@assets/repetitions.svg';
import SetsSvg from '@assets/series.svg';

type RouteParams = {
  exerciseId: string;
};

export function Exercise() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const toast = useToast();

  const { navigate, goBack } = useNavigation<AppNavigatorRoutes>();
  const route = useRoute();

  const { exerciseId } = route.params as RouteParams;

  const handleGoBack = () => {
    goBack();
  };

  const fetchExerciseById = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/exercises/${exerciseId}`);
      setExercise(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Something strange happened while fetching the exercise, try again later';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseDone = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/history', { exercise_id: exerciseId });

      toast.show({
        title: 'Exercise successfully marked as done',
        placement: 'top',
        bgColor: 'green.700',
        duration: 500,
        onCloseComplete: () => navigate('history'),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Something strange happened while registering your exercise, try again later';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchExerciseById();
    }, [exerciseId])
  );

  return (
    <VStack flex={1}>
      {!isLoading ? (
        <>
          <VStack px='8' pt='12' bgColor='gray.600'>
            <TouchableOpacity onPress={handleGoBack}>
              <Icon as={Feather} name='arrow-left' color='green.500' size='6' />
            </TouchableOpacity>
            <HStack justifyContent='space-between' mt='4' mb='8' alignItems='center'>
              <Heading fontFamily='heading' flexShrink={1} color='gray.100' fontSize='lg'>
                {exercise.name}
              </Heading>
              <HStack alignItems='center'>
                <BodySvg />
                <Text color='gray.200' ml='1' textTransform='capitalize'>
                  {exercise.group}
                </Text>
              </HStack>
            </HStack>
          </VStack>
          <ScrollView>
            <VStack p='8'>
              <Image
                w='full'
                h='80'
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt='exercise name'
                mb='3'
                rounded='lg'
                resizeMode='cover'
              />
              <Box bgColor='gray.600' rounded='md' pb='4' px='4'>
                <HStack alignItems='center' justifyContent='space-around' mb='6' mt='5'>
                  <HStack alignItems='center'>
                    <SetsSvg />
                    <Text color='gray.200' ml='2'>
                      {exercise.series} sets
                    </Text>
                  </HStack>
                  <HStack alignItems='center'>
                    <RepsSvg />
                    <Text color='gray.200' ml='2'>
                      {exercise.repetitions} reps
                    </Text>
                  </HStack>
                </HStack>
                <Button
                  onPress={handleExerciseDone}
                  isLoading={isSubmitting}
                  title='Mark as done'
                />
              </Box>
            </VStack>
          </ScrollView>
        </>
      ) : (
        <Loading />
      )}
    </VStack>
  );
}
