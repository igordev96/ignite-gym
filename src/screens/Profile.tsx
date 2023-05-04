import { useState, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { getInfoAsync } from 'expo-file-system';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import { useAuth } from '@hooks/useAuth';
import defaultPhoto from '@assets/userPhotoDefault.png';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { api } from '@services/api';
import AppError from '@utils/AppError';

const PIC_SIZE = 32;
const ONE_MB_IN_BYTES = 1 * 1024 * 1024;

interface IFormData {
  name: string;
  email: string;
  previousPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const profileSchema = yup.object({
  name: yup.string().required('You must enter your name'),
  newPassword: yup
    .string()
    .min(6, 'Password minimun length is 6 chars')
    .nullable()
    .transform((value) => (!value ? null : value))
    .when('previousPassword', {
      is: (value: string) => !!value,
      then: (schema) =>
        schema.notOneOf(
          [yup.ref('previousPassword')],
          'The new password cannot be the same as the previous one'
        ),
    }),
  confirmNewPassword: yup
    .string()
    .nullable()
    .transform((value) => (!value ? null : value))
    .when('newPassword', {
      is: (value: string) => !!value,
      then: (schema) =>
        schema
          .required('Please confirm your password')
          .oneOf([yup.ref('newPassword')], 'Wrong new password, please try again'),
    }),
});

export function Profile() {
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isPicLoaded, setIsPicLoaded] = useState<boolean>(true);

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  const resetPasswords = () => {
    resetField('previousPassword');
    resetField('newPassword');
    resetField('confirmNewPassword');
  };

  const handleChooseImage = async () => {
    try {
      setIsPicLoaded(false);
      const imageResult = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        quality: 0.85,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (imageResult.canceled) {
        return;
      }

      const imageInfo = await getInfoAsync(imageResult.assets[0].uri);

      if (!imageInfo.exists) {
        return;
      } else if (imageInfo.size >= ONE_MB_IN_BYTES) {
        return toast.show({
          title: 'Please choose a picture smaller than 1MB',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      const fileExtension = imageResult.assets[0].uri.split('.').at(-1) ?? 'jpeg';
      const userName = user.name.trim().split(' ').join('-');

      const imageFile: any = {
        name: `${userName}-${user.id}.${fileExtension}`.toLowerCase(),
        uri: imageResult.assets[0].uri,
        type: `${imageResult.assets[0].type}/${fileExtension}`,
      };

      const userPhotoUploadForm = new FormData();
      userPhotoUploadForm.append('avatar', imageFile);

      const { data } = await api.patch('/users/avatar', userPhotoUploadForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await updateUserProfile(data);
      toast.show({
        title: 'Pic uploaded successfully',
        placement: 'top',
        bgColor: 'green.500',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Error uploading your picture, try again later';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsPicLoaded(true);
    }
  };

  const handleUpdate = async (formData: IFormData) => {
    try {
      setIsUpdating(true);

      await api
        .put('/users', {
          name: formData.name,
          password: formData.newPassword,
          old_password: formData.previousPassword,
        })
        .then(() => ({ ...user, name: formData.name }))
        .then((userUpdated) => updateUserProfile(userUpdated))
        .then(() => resetPasswords());

      toast.show({
        title: 'Profile updated successfully!',
        placement: 'top',
        bgColor: 'green.500',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Error while updatingm, try again later';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => resetPasswords();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title='Profile' />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 56,
        }}
      >
        <Center mt='6' px='10'>
          <Skeleton
            isLoaded={isPicLoaded}
            startColor='gray.600'
            endColor='gray.300'
            w={PIC_SIZE}
            h={PIC_SIZE}
            rounded='full'
          >
            <UserPhoto
              size={PIC_SIZE}
              source={
                !!user.avatar
                  ? {
                      uri: `${api.defaults.baseURL}/avatar/${user.avatar}`,
                    }
                  : defaultPhoto
              }
              alt='profile picture'
            />
          </Skeleton>
          <TouchableOpacity onPress={handleChooseImage}>
            <Text color='green.500' fontWeight='bold' fontSize='md' mt='2' mb='8'>
              Change picture
            </Text>
          </TouchableOpacity>
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                bgColor='gray.600'
                placeholder='Name'
                errorMsg={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                bgColor='gray.600'
                placeholder='E-mail'
                isDisabled
              />
            )}
          />
          <Heading
            fontFamily='heading'
            mt='12'
            alignSelf='flex-start'
            color='gray.200'
            fontSize='md'
            mb='2'
          >
            Change password
          </Heading>
          <Controller
            control={control}
            name='previousPassword'
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                bgColor='gray.600'
                placeholder='Previous password'
                secureTextEntry
                errorMsg={errors.previousPassword?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='newPassword'
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                bgColor='gray.600'
                placeholder='New password'
                secureTextEntry
                errorMsg={errors.newPassword?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='confirmNewPassword'
            render={({ field: { onChange, value } }) => (
              <Input
                onSubmitEditing={handleSubmit(handleUpdate)}
                returnKeyType='send'
                onChangeText={onChange}
                value={value}
                bgColor='gray.600'
                placeholder='Confirm new password'
                secureTextEntry
                errorMsg={errors.confirmNewPassword?.message}
              />
            )}
          />
          <Button
            isLoading={isUpdating}
            onPress={handleSubmit(handleUpdate)}
            mt='4'
            title='Update'
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
