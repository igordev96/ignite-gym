import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { VStack, SectionList, Heading, Text, useToast } from 'native-base';
import { HistoryCard } from '@components/HistoryCard';
import { Loading } from '@components/Loading';
import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryDTO } from '@dtos/HistoryDTO';
import { api } from '@services/api';
import AppError from '@utils/AppError';

export function History() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [exercises, setExercises] = useState<HistoryDTO[]>([]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/history');
      setExercises(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Something strange happened while fetching your history';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title='Exercises History' />
      {!isLoading ? (
        <SectionList
          px={4}
          keyExtractor={(item) => item.id.toString()}
          sections={exercises}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section: { title } }) => (
            <Heading fontFamily='heading' color='gray.200' fontSize='md' mt='10' mb='3'>
              {title}
            </Heading>
          )}
          contentContainerStyle={
            !exercises.length && {
              flex: 1,
              justifyContent: 'center',
            }
          }
          renderItem={({ item }) => <HistoryCard data={item} />}
          ListEmptyComponent={({}) => (
            <Text color='gray.100' textAlign='center'>
              No exercises registered yet.{'\n'}
              Let's exercise today?
            </Text>
          )}
        />
      ) : (
        <Loading />
      )}
    </VStack>
  );
}
