import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { AuthNavigatorRoutes } from '@routes/auth.routes';
import { api } from '@services/api';
import AppError from '@utils/AppError';
import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';

const SIGNUP_FORM_DEFAULT_VALUES = {
  name: '',
  email: '',
  password: '',
  'confirm-password': '',
};

const signUpSchema = yup.object({
  name: yup.string().required('Type your name'),
  email: yup.string().required('Type your email').email('Invalid email'),
  password: yup
    .string()
    .required('Type your password')
    .min(6, 'Password must have at least 6 chars'),
  'confirm-password': yup
    .string()
    .required('You must confirm your password')
    .oneOf([yup.ref('password'), ''], "Passwords don't match"),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const toast = useToast();
  const { navigate } = useNavigation<AuthNavigatorRoutes>();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: SIGNUP_FORM_DEFAULT_VALUES,
    resolver: yupResolver(signUpSchema),
  });

  const handleGoBack = () => {
    navigate('signIn');
  };

  const handleSignUp = async (formData: typeof SIGNUP_FORM_DEFAULT_VALUES) => {
    const { name, email, password } = formData;
    setIsLoading(true);
    try {
      await api.post('/users', { name, email, password });
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'It was not possible to create your account, try again later.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <VStack flex={1} px={10} pb={16}>
        <Image
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
            Create an account
          </Heading>
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Name'
                onChangeText={onChange}
                value={value}
                errorMsg={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, value } }) => (
              <Input
                autoCapitalize='none'
                keyboardType='email-address'
                placeholder='E-mail'
                onChangeText={onChange}
                value={value}
                errorMsg={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, value } }) => (
              <Input
                secureTextEntry
                placeholder='Password'
                onChangeText={onChange}
                value={value}
                errorMsg={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='confirm-password'
            render={({ field: { onChange, value } }) => (
              <Input
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType='send'
                secureTextEntry
                placeholder='Confirm your password'
                onChangeText={onChange}
                value={value}
                errorMsg={errors['confirm-password']?.message}
              />
            )}
          />
          <Button
            isLoading={isLoading}
            onPress={handleSubmit(handleSignUp)}
            title='Create and enter'
          />
        </Center>
        <Button onPress={handleGoBack} mt={12} variant='outline' title='Back to login' />
      </VStack>
    </ScrollView>
  );
}
