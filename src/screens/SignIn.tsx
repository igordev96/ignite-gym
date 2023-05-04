import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Center, Heading, Image, Text, VStack, ScrollView, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { AuthNavigatorRoutes } from '@routes/auth.routes';
import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { useAuth } from '@hooks/useAuth';
import AppError from '@utils/AppError';
import { useState } from 'react';

const SIGNIN_DEFAULT_VALUES = {
  email: '',
  password: '',
};

const signInSchema = yup.object({
  email: yup.string().required('You must enter your email').email('Invalid email'),
  password: yup.string().required('You must enter your password').min(6, 'Wrong password length'),
});

export function SignIn() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { navigate } = useNavigation<AuthNavigatorRoutes>();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: SIGNIN_DEFAULT_VALUES,
    resolver: yupResolver(signInSchema),
  });

  const handleSignUp = () => {
    navigate('signUp');
  };

  const handleSignIn = async (formData: typeof SIGNIN_DEFAULT_VALUES) => {
    const { email, password } = formData;
    setIsLoading(true);
    try {
      await signIn(email, password);
      reset();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Server error, please try again later';
      toast.show({
        title,
        placement: 'top',
        backgroundColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <VStack flex={1} px={10} pb={16}>
        <Image
          defaultSource={BackgroundImg}
          source={BackgroundImg}
          alt='people training'
          resizeMode='contain'
          position='absolute'
        />
        <Center my='24'>
          <LogoSvg />
          <Text fontSize='sm' color='gray.100'>
            Train your mind and body
          </Text>
        </Center>
        <Center>
          <Heading fontFamily='heading' fontSize='xl' mb={6} color='gray.100'>
            Log in
          </Heading>
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                autoCapitalize='none'
                keyboardType='email-address'
                placeholder='E-mail'
                errorMsg={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, value } }) => (
              <Input
                onSubmitEditing={handleSubmit(handleSignIn)}
                returnKeyType='send'
                onChangeText={onChange}
                value={value}
                secureTextEntry
                placeholder='Password'
                errorMsg={errors.password?.message}
              />
            )}
          />
          <Button isLoading={isLoading} onPress={handleSubmit(handleSignIn)} title='Enter' />
        </Center>
        <Center mt={24}>
          <Text color='gray.100' fontSize='sm' mb={3} fontFamily='body'>
            Don't have access yet?
          </Text>
          <Button onPress={handleSignUp} variant='outline' title='Create an account' />
        </Center>
      </VStack>
    </ScrollView>
  );
}
