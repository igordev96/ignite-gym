import { Center, Heading } from 'native-base';

export interface IScreenHeader {
  title: string;
}

export function ScreenHeader(props: IScreenHeader) {
  const { title } = props;

  return (
    <Center bg='gray.600' pb='6' pt='16'>
      <Heading fontFamily='heading' color='gray.100' fontSize='xl'>
        {title}
      </Heading>
    </Center>
  );
}
