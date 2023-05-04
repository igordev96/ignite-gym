import { Spinner, Center } from 'native-base';

export function Loading() {
  return (
    <Center bg='gray.700' flex={1}>
      <Spinner color='green.500' />
    </Center>
  );
}
