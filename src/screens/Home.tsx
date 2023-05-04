import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList, HStack, Heading, Text, VStack, useToast } from 'native-base';
import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';
import { AppNavigatorRoutes } from '@routes/app.routes';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { api } from '@services/api';
import AppError from '@utils/AppError';

export function Home() {
  const toast = useToast();
  const { navigate } = useNavigation<AppNavigatorRoutes>();
  const [groupSelected, setGroupSelected] = useState<string>('back');
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(false);

  const handleOpenExercise = (exerciseId: number) => {
    navigate('exercise', { exerciseId });
  };

  const fetchGroups = async () => {
    try {
      setIsLoadingGroups(true);
      const { data } = await api.get('/groups');
      setGroups(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Something strange happened while fetching the groups, try again later';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const fetchExercisesByGroup = async () => {
    try {
      setIsLoadingExercises(true);
      const { data } = await api.get<ExerciseDTO[]>(`/exercises/bygroup/${groupSelected}`);
      setExercises(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Something strange happened while fetching the exercises, try again later';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoadingExercises(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      {!isLoadingGroups ? (
        <>
          <HomeHeader />
          <FlatList
            horizontal
            my='10'
            maxH='10'
            minH='10'
            _contentContainerStyle={{ px: 8 }}
            showsHorizontalScrollIndicator={false}
            data={groups}
            renderItem={({ item }) => (
              <Group
                name={item}
                isActive={groupSelected.toLowerCase() === item.toLowerCase()}
                onPress={() => setGroupSelected(item)}
              />
            )}
          />
          {!isLoadingExercises ? (
            <VStack flex={1} px='8'>
              <HStack justifyContent='space-between' mb='5'>
                <Heading fontFamily='heading' color='gray.200' fontSize='md'>
                  Exercises
                </Heading>
                <Text color='gray.200' fontSize='sm'>
                  {exercises.length}
                </Text>
              </HStack>
              <FlatList
                keyExtractor={(item) => item.id.toString()}
                _contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                data={exercises}
                renderItem={({ item }) => (
                  <ExerciseCard exercise={item} onPress={() => handleOpenExercise(item.id)} />
                )}
              />
            </VStack>
          ) : (
            <Loading />
          )}
        </>
      ) : (
        <Loading />
      )}
    </VStack>
  );
}
